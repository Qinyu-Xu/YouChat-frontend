import styles from "@/styles/right.module.css";
import {Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar, Input, Button, Card } from "antd";
import {useEffect, useState} from "react";
import {isBrowser, store} from "@/utils/store";
import CircularJson from "circular-json";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const RequestList = (props: any) => {
    return <div>
        <List 
            grid={{ column: 1 }}
            itemLayout="vertical"
            dataSource={props.members}
            // dataSource={props.members.filter((x: any) => x.role === 3)}
            // bordered={true}
            renderItem={(item: any, index: any) => (
                <List.Item onClick={() => {}}>
                    <Card>
                            <List.Item.Meta
                                avatar={<Avatar src={
                                    props.images.filter( (image: any) => image.id === item.id)[0] === undefined
                                        ? "/headshot/01.svg"
                                        : props.images.filter( (image: any) => image.id === item.id)[0].image
                                } />}
                                title={(props.members.filter((member: any) => member.id === item.id))[0] === undefined
                                    ? "Stranger" :
                                (props.members.filter((member: any) => member.id === item.id))[0].nickname}
                            />
                            <Button type="primary">同意</Button>
                            <Button>拒绝</Button>
                    </Card>
                </List.Item>
            )}
        />

    </div>
};

const Manager = (props: any) => {

    const items: MenuProps['items'] = [
        {
            label: '加群申请',
            key: 'view',
        }, 
    ];

    const [current, setCurrent] = useState('view');
    const [messages, setMessages] = useState([]);

    const onClick: MenuProps['onClick'] = (e: any) => setCurrent(e.key);
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);

    useEffect(() => {
        const getPull = () => {
            const socket: any = store.getState().webSocket;
            socket.send(JSON.stringify({
                    type: "pull",
                    id: store.getState().userId,
                    sessionId: props.sessionId,
                    messageScale: 100
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
            getPull();
        }
        return () => {socket.removeEventListener('message', handlePull);};
    }, [props.sessionId, store.getState().webSocket]);

    return (
        <Modal title={"同意加群申请"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            
            <br />
            <RequestList members={props.members} messages={messages} images={props.images}/>
        </Modal>
    )
}

export default Manager;