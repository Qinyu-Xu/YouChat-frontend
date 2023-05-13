import {useEffect, useState} from "react";
import {request} from "@/utils/network";
import {formatParams} from "@/utils/utilities";
import {store} from "@/utils/store";
import CircularJson from "circular-json";
import {Avatar, Checkbox, Image, List, Modal} from "antd";


export const MultiPicker = (props: any) => {
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        request("api/session/history?"+formatParams({id: props.sessionId}), "GET", "").then(() => {
            setMessages(res.messages);
        });
    }, []);

    const handleChoose = (item: any) => {
        return (e: any) => {
            if (e.target.checked) setSelected((selected: any) => [...selected, item]);
            else setSelected((selected: any) => selected.filter((x: any) => x.messageId !== item.messageId));
        };
    };

    const handleOk = () => {
        const socket = store.getState().webSocket;
        const message = {
            type: "send",
            id: store.getState().userId,
            sessionId: props.sessionId,
            timestamp: Date.now(),
            message: selected,
            messageType: "history"
        };
        const addM = {
            "senderId": store.getState().userId,
            "timestamp": Date.now(),
            "messageId": Date.now(),
            "message": selected,
            "messageType": "history"
        }
        socket.send(CircularJson.stringify(message));
        props.setMessages((message: any) => [...message, addM]);
    };

    const handleCancel = () => {
        setSelected([]);
        props.setOpen(false);
    };
    return (
        <Modal title="请多选" open={props.open} onOk={handleOk} onCancel={handleCancel}>
            <List
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={(item: any, index: number) => (
                    <List.Item>
                        <Checkbox onChange={handleChoose(item)} />
                        <List.Item.Meta
                            avatar={<Avatar src={
                                props.images.filter( (image: any) => image.id === item.senderId)[0] === undefined
                                    ? "/headshot/01.svg"
                                    : props.images.filter( (image: any) => image.id === item.senderId)[0].image
                            } />}
                            title={(props.members.filter((member: any) => member.id === item.senderId))[0] === undefined
                                ? "Stranger" :
                                (props.members.filter((member: any) => member.id === item.senderId))[0].nickname}
                            description={ item.messageType === "text" || item.messageType === "notice" ? item.message : <Image src={item.message} />}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};


const MultiChat = (props: any) => {

    const handleOk = () => {
        props.setOpen(false);
    };

    const handleCancel = () => {
        props.setOpen(false);
    };

    return (
    <Modal title="聊天记录" open={props.open} onOk={handleOk} onCancel={handleCancel}>
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
                        description={ item.messageType === "text" || item.messageType === "notice" ? item.message : <Image src={item.message} />}
                    />
                </List.Item>
            )}
        />
    </Modal>
    )
}

export default MultiChat;