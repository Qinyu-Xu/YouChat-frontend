import {useEffect, useState} from "react";
import {request} from "@/utils/network";
import {formatParams} from "@/utils/utilities";
import {store} from "@/utils/store";
import {Avatar, Checkbox, Image, List, Modal, Select, Radio} from "antd";
import CircularJson from "circular-json";
import {FileViewer} from "@/components/chat/single_message/file";
import {AudioPlayer} from "@/components/chat/single_message/audio";

export const MultiPicker = (props: any) => {
    const [selected, setSelected] = useState<any>([]);
    const [session, setSession] = useState(-1);
    const [transfer, setTransfer] = useState(1);

    const handleSelect = (e: any) => {setSession(e);}

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
            const addM = {
                "senderId": store.getState().userId,
                "timestamp": Date.now(),
                "messageId": -1,
                "message": CircularJson.stringify(selected),
                "messageType": "history",
                "reply": -1,
                "renderedMessage": "",
            }
            if(props.sessionId === session) {props.setMessages((_messages: any) => [..._messages, addM]);}
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
                const addM = {
                    "senderId": store.getState().userId,
                    "timestamp": Date.now(),
                    "messageId": -1,
                    "message": selected[i].message,
                    "messageType":selected[i].messageType !== "notice" ? selected[i].messageType : "text",
                    "reply": -1,
                    "renderedMessage": selected[i].message,
                }
                if(props.sessionId === session)
                    props.setMessages((_messages: any) => [..._messages, addM]);
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
                    dataSource={props.messages}
                    renderItem={(item: any, index: number) => (
                        <List.Item>
                            <Checkbox checked={selected.filter((s: any) => s.messageId === item.messageId).length !== 0} onChange={handleChoose(item)} />
                            <List.Item.Meta
                                avatar={<Avatar src={
                                    !store.getState().imgMap.hasOwnProperty(item.senderId) ?"/headshot/01.svg" : store.getState().imgMap[item.senderId]
                                } />}
                                title={(props.members.filter((member: any) => member.id === item.senderId))[0] === undefined
                                    ? "Stranger" :
                                    (props.members.filter((member: any) => member.id === item.senderId))[0].nickname}
                                description={ item.messageType === "text" || item.messageType === "notice" ? item.message :
                                    item.messageType === "photo" ? <Image src={item.message} /> : item.messageType === "file" ? <FileViewer base={item.message} />
                                        : item.messageType === "audio" ? <AudioPlayer base64Audio={item.message}/> : <div>[转发]</div>
                                }
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
                            !store.getState().imgMap.hasOwnProperty(item.senderId) ?"/headshot/01.svg" :store.getState().imgMap[item.senderId]
                        } />}
                        title={(members.filter((member: any) => member.id === item.senderId))[0] === undefined
                            ? "Stranger" :
                            (members.filter((member: any) => member.id === item.senderId))[0].nickname}
                        description={ item.messageType === "text" || item.messageType === "notice" ? item.message :
                            item.messageType === "photo" ? <Image src={item.message} /> : item.messageType === "file" ? <FileViewer base={item.message} />
                                : item.messageType === "audio" ? <AudioPlayer base64Audio={item.message}/> : <div>[转发]</div>
                        }
                    />
                </List.Item>
            )}
        />
    </Modal>
    )
}

export default MultiChat;