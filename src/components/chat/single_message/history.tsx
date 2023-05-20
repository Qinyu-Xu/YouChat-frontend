import {useEffect, useState} from "react";
import {request} from "@/utils/network";
import {formatParams} from "@/utils/utilities";
import {store} from "@/utils/store";
import {Avatar, Checkbox, Image, List, Modal, Select, Radio} from "antd";
import CircularJson from "circular-json";

export const MultiPicker = (props: any) => {
    const [messages, setMessages] = useState<any>([]);
    const [selected, setSelected] = useState<any>([]);
    const [session, setSession] = useState(-1);
    const [transfer, setTransfer] = useState(1);

    useEffect(() => {
        request("api/session/history?"+formatParams({sessionId: props.sessionId, userId: store.getState().userId}), "GET", "").then((res) => {
            setMessages(res.messages);
        });
    }, []);

    const handleSelect = (e: any) => {
        setSession(e);
    }

    const handleChoose = (item: any) => {
        return (e: any) => {
            if (e.target.checked) setSelected((selected: any) => [...selected, item]);
            else setSelected((selected: any) => selected.filter((x: any) => x.messageId !== item.messageId));
        };
    };

    const handleOk = () => {
        if(transfer === 1) {
            const socket: any = store.getState().webSocket;
            const message = {
                type: "send",
                id: store.getState().userId,
                sessionId: session,
                timestamp: Date.now(),
                message: CircularJson.stringify(selected),
                messageType: "history"
            };
            socket.send(CircularJson.stringify(message));
        } else {
            const socket: any = store.getState().webSocket;
            for(let i = 0; i < selected.length; ++i) {
                const message = {
                    type: "send",
                    id: store.getState().userId,
                    sessionId: session,
                    timestamp: Date.now(),
                    message: selected[i].message,
                    messageType: selected[i].messageType !== "notice" ? selected[i].messageType : "text",
                };
                socket.send(CircularJson.stringify(message));
            }
            setSelected([]);
        }
        props.setOpen(false);
    };

    const handleCancel = () => {
        setSelected([]);
        props.setOpen(false);
    };

    const handleRadioChange = (e: any) => {
        setTransfer(e.target.value);
    }

    return (
        <div>
            <Modal title="选择转发的信息以及目标群聊" open={props.open} onOk={handleOk} onCancel={handleCancel}>
                选择目标群聊：
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select"
                    optionFilterProp="children"
                    options={props.list.map((l: any) => {return {
                        value: l.sessionId,
                        label: l.sessionName !== "" ? l.sessionName : " "
                    }})}
                    onChange={handleSelect}
                />
                <br/><br/>
                是否逐条转发：
                <Radio.Group name="radiogroup" defaultValue={1} onChange={handleRadioChange}>
                    <Radio value={1}>否</Radio>
                    <Radio value={2}>是</Radio>
                </Radio.Group>
                <List
                    itemLayout="horizontal"
                    dataSource={messages}
                    renderItem={(item: any, index: number) => (
                        <List.Item>
                            <Checkbox checked={selected.filter((s: any) => s.messageId === item.messageId).length !== 0} onChange={handleChoose(item)} />
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
        </div>
    );
};


const MultiChat = (props: any) => {

    const handleOk = () => {
        props.setOpen(false);
    };

    const handleCancel = () => {
        props.setOpen(false);
    };

    const [images, setImages] = useState<any>([]);
    const [members, setMembers] = useState<any>([]);

    useEffect(() => {
        if(props.messages !== undefined) {
            for (let i = 0; i < props.messages.length; ++i) {
                request("api/people/profile/" + props.messages[i].senderId, "GET", "").then(res => {
                    setMembers((members: any) => [...members, {
                        id: props.messages[i].senderId,
                        nickname: res.profile.nickname
                    }]);
                });
                request("api/people/img/" + props.messages[i].senderId, "GET", "").then(res => {
                    setImages((images: any) => [...images, {id: props.messages[i].senderId, image: res.img}]);
                });
            }
        }
    }, [props.messages]);

    return (
    <Modal title="聊天记录" open={props.open} onOk={handleOk} onCancel={handleCancel}>
        <List
            itemLayout="horizontal"
            dataSource={props.messages}
            renderItem={(item: any, index: number) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={
                            images.filter( (image: any) => image.id === item.senderId)[0] === undefined
                                ? "/headshot/01.svg"
                                : images.filter( (image: any) => image.id === item.senderId)[0].image
                        } />}
                        title={(members.filter((member: any) => member.id === item.senderId))[0] === undefined
                            ? "Stranger" :
                            (members.filter((member: any) => member.id === item.senderId))[0].nickname}
                        description={ item.messageType === "text" || item.messageType === "notice" ? item.message : <Image src={item.message} />}
                    />
                </List.Item>
            )}
        />
    </Modal>
    )
}

export default MultiChat;