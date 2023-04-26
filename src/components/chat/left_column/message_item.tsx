import styles from "@/styles/chat.module.css";
import { request } from "@/utils/network";
import { Avatar } from "antd";
import {store} from "@/utils/store";
import { useEffect, useState } from "react";
import {getRandomNumber} from "@/utils/utilities";

const MessageItem = (props: any) => {
    const [image, setImage] = useState("");

    useEffect(() => {
        if(props.session.sessionType === 1) {
            request(
                "api/session/chatroom?id=" + props.session.sessionId,
                "GET",
                "").then((res: any) => {
                    const id = (res.members.filter((member: any) =>
                            member.id !== store.getState().userId)
                    )[0].id;
                    request("api/people/img/" + id, "GET", "").then((r: any) => {
                        setImage(r.img);
                    });
                }
            )
        } else {
            if(image === "") {
                setImage(`/headshot/${getRandomNumber(1, 99)}.svg`);
            }
        }
    });

    return (
        <div className={styles.message_item}>
            <Avatar className={styles.message_item_left} src={image}/>
            <div className={styles.message_item_right}>
                <div className={styles.message_item_title}>
                    {props.session.sessionName}
                </div>
                <div className={styles.message_item_content}>
                    {
                        props.session.lastSender
                    }
                    :
                    {
                        props.session.type == "audio" ?
                            "[语音]"
                        : ( props.session.type == "photo" ?
                                "[图片]"
                            :
                                props.session.message
                        )
                    }
                </div>
            </div>
        </div>
    )
};

export default MessageItem;