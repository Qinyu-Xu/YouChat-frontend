import styles from "@/styles/right.module.css";
import {Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar, Input, Button } from "antd";
import {useEffect, useState} from "react";
import {isBrowser, store} from "@/utils/store";
import CircularJson from "circular-json";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const NoticePicker = (props: any) => {
    return <div>
        <List
            itemLayout="horizontal"
            dataSource={props.messages.filter((message: any) => message.messageType === "notice")}
            renderItem={(item: any, index: number) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={
                            props.images.filter( (image: any) => image.id === item.senderId)[0] === undefined
                                ? "/headshot/01.svg"
                                : props.images.filter( (image: any) => image.id === item.senderId)[0].image
                        } />}
                        title={(props.members.filter((member: any) => member.id === item.senderId))[0] === undefined
                                ? "Stranger" :
                            (props.members.filter((member: any) => member.id === item.senderId))[0].nickname}
                        description={ item.message }
                    />
                </List.Item>
            )}
        />
    </div>
};

const NoticeEditor = (props: any) => {

    const [text, setText] = useState("");

    const socket: any = store.getState().webSocket;
    // 发送文本信息
    const handleClick = (e: any) => {
        if(isBrowser && socket !== null && socket.readyState===1) {
            if(props.text !== "") {
                const message = {
                    type: "send",
                    id: store.getState().userId,
                    sessionId: props.sessionId,
                    timestamp: Date.now(),
                    message: text,
                    messageType: "notice"
                };
                const addM = {
                    "senderId": store.getState().userId,
                    "timestamp": Date.now(),
                    "messageId": Date.now(),
                    "message": text,
                    "messageType": "notice"
                }
                socket.send(CircularJson.stringify(message));
                props.setMessages((message: any) => [...message, addM]);
            }
        }
        setText("");
    };

    return  <div>
                <TextArea
                    rows={4}
                    onChange={(e: any) => setText(e.target.value)}
                    value={text} />
                <div>
                    <Button onClick={handleClick} >发送</Button>
                </div>
            </div>
};

const Notice = (props: any) => {

    const items: MenuProps['items'] = [
        {
            label: '查看',
            key: 'view',
        }, {
            label: '编辑',
            key: 'edit',
        }, 
    ];

    const items_members: MenuProps['items'] = [
        {
            label: '查看',
            key: 'view',
        }, 
    ];

    const [current, setCurrent] = useState('view');
    const [messages, setMessages] = useState([]);

    const onClick: MenuProps['onClick'] = (e: any) => setCurrent(e.key);
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);

    useEffect(() => {
        const getPull = (timestamp: any) => {
            const socket: any = store.getState().webSocket;
            socket.send(JSON.stringify({
                    type: "pull",
                    id: store.getState().userId,
                    sessionId: props.sessionId,
                    messageScale: 30,
                    timestamp: timestamp
                })
            );
        };
        const handlePull = (res: any) => {
            res = eval("(" + res.data + ")")
            if ( res.type === 'pull' ) {
                setMessages(res.messages);
            }
        };
        const socket: any = store.getState().webSocket;
        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handlePull);
            getPull(Date.now());
        }
        return () => {socket.removeEventListener('message', handlePull);};
    }, [props.sessionId, store.getState().webSocket]);

    return (
        <Modal title={"群公告管理"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            {props.role > 1 ? 
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items_members} />
                :
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            }
            
            <br />
            {current === 'view'
                ? <NoticePicker members={props.members} messages={messages} images={props.images}/>
                : <NoticeEditor setMessages={props.setMessages} sessionId={props.sessionId}/>
            }
        </Modal>
    )
}

export default Notice;