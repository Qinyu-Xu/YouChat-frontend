import {Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar} from "antd";
import {useEffect, useState} from "react";
import {request} from "@/utils/network";
import {isBrowser, store} from "@/utils/store";

const { RangePicker } = DatePicker;

const AllPicker = (props: any) => {
    return <div>
        <List
            itemLayout="horizontal"
            dataSource={props.messages}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={
                            props.images.filter( (image: any) => image.id === item.senderId)[0] === undefined
                                ?
                                "/headshot/01.svg"
                                :
                                props.images.filter( (image: any) => image.id === item.senderId)[0].image
                        } />}
                        title={}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                </List.Item>
            )}
        />
    </div>
};

const TimestampPicker = (props: any) => {
    const [begin, setBegin] = useState(null);
    const [end, setEnd] = useState(null);
    const handleChange = (e: any) => {
        setBegin(e[0]);
        setEnd(e[1]);
    }

    return <div>
        <RangePicker showTime onChange={handleChange}/>
    </div>
};

const TypePicker = (props: any) => {
    const handleChange = () => {};
    const options: any = [
        { value: '文本', label: 'text' },
        { value: '图片', label: 'image' },
        { value: '语音', label: 'audio' },
    ]
    return <div>
        <Select
            defaultValue="text"
            style={{ width: 120 }}
            onChange={handleChange}
            options={options}
        />
    </div>
}

const MemberPicker = (props: any) => {

    const options: any = props.members.map((member: any) => {
        return {
            label: member.nickname,
            value: member.id
        }
    });
    const default_val = options[0];
    const handleChange = (e: any) => {console.log(e);};

    return <div>
        <Select
            mode="multiple"
            style={{ width: '50%' }}
            allowClear
            defaultValue={default_val}
            onChange={handleChange}
            options={options}
        />
    </div>

}

const ChatHistory = (props: any) => {

    const items: MenuProps['items'] = [
        {
            label: '所有',
            key: 'all',
        }, {
            label: '按消息类型',
            key: 'type',
        }, {
            label: '按时间顺序',
            key: 'time',
        }, {
            label: '按发送成员',
            key: 'member',
        },
    ];


    const [current, setCurrent] = useState('all');
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
                    sessionId: props.session.sessionId,
                    messageScale: 100
                })
            );
        };
        const handlePull = (res: any) => {
            res = eval("(" + res.data + ")")
            if ( res.type === 'pull' ) {
                setMessages(res.messages);
                setMessages((messages) => messages.reverse());
            }
        };
        const socket: any = store.getState().webSocket;
        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handlePull);
            getPull();
        }
        return () => {
            socket.removeEventListener('message', handlePull);
        };
    }, [props.sessionId, store.getState().webSocket]);

    return (
        <Modal title={"筛选聊天记录"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <br />
            {current === 'all'
                ? <AllPicker message={messages} images={props.images}/>
                : (current === 'type'
                    ? <TypePicker message={messages} images={props.images}/>
                    : (current === 'time'
                        ? <TimestampPicker message={messages} images={props.images}/>
                        : <MemberPicker members={props.members} message={messages} images={props.images}/>
                        )
                    )
            }
        </Modal>
    )
}

export default ChatHistory;