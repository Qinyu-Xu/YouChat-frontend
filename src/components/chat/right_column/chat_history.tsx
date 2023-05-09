import {Divider, Modal, MenuProps, Menu, DatePicker, Select, SelectProps, List, Avatar, Image} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const AllPicker = (props: any) => {
    return <div>
        <List
            itemLayout="horizontal"
            dataSource={props.messages}
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
                        description={ item.messageType === "text" ? item.message : <Image src={item.message} />}
                    />
                </List.Item>
            )}
        />
    </div>
};

const TimestampPicker = (props: any) => {
    const [begin, setBegin] = useState<any>(0);
    const [end, setEnd] = useState<any>(2000000000000);
    const handleChange = (e: any) => {
        if(e) {
            setBegin(dayjs(e[0]).unix() * 1000);
            setEnd(dayjs(e[1]).unix() * 1000);
        } else {
            setBegin(0);
            setEnd(2000000000000);
        }
    }

    return <div>
        <RangePicker showTime onChange={handleChange} />
        <List
            itemLayout="horizontal"
            dataSource={props.messages.filter((message: any) => message.timestamp >= begin && message.timestamp <= end)}
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
                        description={ item.messageType === "text" ? item.message : <Image src={item.message} />}
                    />
                </List.Item>
            )}
        />
    </div>
};

const TypePicker = (props: any) => {
    const [type, setType] = useState('text');
    const handleChange = (e: any) => {setType(e);};
    const options: any = [
        { value: 'text', label: '文本' },
        { value: 'photo', label: '图片' },
        { value: 'audio', label: '语音' },
    ]
    return <div>
        <Select
            defaultValue="text"
            style={{ width: 120 }}
            onChange={handleChange}
            options={options}
        />
        <List
            itemLayout="horizontal"
            dataSource={props.messages.filter((message: any) => message.messageType === type)}
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
                        description={ item.messageType === "text" ? item.message : <Image src={item.message} />}
                    />
                </List.Item>
            )}
        />
    </div>
}

const MemberPicker = (props: any) => {
    const [selected, setSelected] = useState<any>([]);
    const [msg, setMsg] = useState([]);
    const options: any = props.members.map((member: any) => {
        return {
            label: member.nickname,
            value: member.id
        }
    });

    const handleChange = (e: any) => {setSelected(e)};

    useEffect(() => {
        setMsg(props.messages.filter((message: any) => selected.includes(message.senderId)));
    }, [selected]);

    return <div>
        <Select
            mode="multiple"
            style={{ width: '50%' }}
            allowClear
            onChange={handleChange}
            options={options}
        />
        <List
            itemLayout="horizontal"
            dataSource={msg}
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
                        description={ item.messageType === "text" ? item.message : <Image src={item.message} />}
                    />
                </List.Item>
            )}
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

    const onClick: MenuProps['onClick'] = (e: any) => setCurrent(e.key);
    const handleOk = () => props.setOpen(false);
    const handleCancel = () => props.setOpen(false);

    /*
    const [messages, setMessages] = useState<any>([]);
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
            // getPull();
        }
        return () => {socket.removeEventListener('message', handlePull);};
    }, [props.sessionId, store.getState().webSocket]);

     */

    return (
        <Modal title={"筛选聊天记录"} open={props.open} onOk={handleOk} onCancel={handleCancel} width={800}>
            <Divider />
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <br />
            {current === 'all'
                ? <AllPicker members={props.members} messages={props.messages} images={props.images}/>
                : (current === 'type'
                    ? <TypePicker members={props.members} messages={props.messages} images={props.images}/>
                    : (current === 'time'
                        ? <TimestampPicker members={props.members} messages={props.messages} images={props.images}/>
                        : <MemberPicker members={props.members} messages={props.messages} images={props.images}/>
                        )
                    )
            }
        </Modal>
    )
}

export default ChatHistory;