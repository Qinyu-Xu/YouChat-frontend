import {Avatar, Image, List, Modal} from "antd";
import {useEffect, useState} from "react";
import {request} from "@/utils/network";
import {formatParams} from "@/utils/utilities";

const IsRead = (props: any) => {

    const handleOk = () => {props.setOpen(false);};
    const handleCancel = () => {props.setOpen(false);};

    const [isRead, setIsRead] = useState<any>([]);

    useEffect(() => {
        if(props.open) {
            setIsRead([]);
            request("api/session/chatroom?" + formatParams({id: props.sessionId}),
                "GET",
                ""
            ).then((res) => {
                for(let i = 0; i < res.members.length; ++i) {
                    setIsRead((isRead: any) => [...isRead, {
                        name: res.members[i].nickname,
                        read: res.members[i].readTime > props.readTime,
                    }]);
                }
            })
        }
    }, [props.open]);

    return (
        <Modal open={props.open} onOk={handleOk} onCancel={handleCancel}>
            <List
                itemLayout="horizontal"
                dataSource={isRead}
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
};

export default IsRead;
