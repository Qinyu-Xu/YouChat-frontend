import styles from "@/styles/chat.module.css";
import { request } from "@/utils/network";
import { Avatar } from "antd";
import {store} from "@/utils/store";
import { useEffect, useState } from "react";
import {getRandomNumber} from "@/utils/utilities";
import moment from "moment";

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
        <div className={
            props.session.isTop ?
                styles.message_item_istop
            :
                styles.message_item}>

            <Avatar className={styles.message_item_left} src={image}/>
            <div className={styles.message_item_mid}>
                <div className={styles.message_item_title}>
                    {props.session.sessionName}
                </div>
                <div className={styles.message_item_content}>
                    {
                        props.session.lastSender
                    }
                    ：
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
            <div className={styles.message_item_right}>
                <div className={styles.message_item_mute}>
                    {
                        props.session.isMute
                        ?
                            <img src={"ui/close-remind.svg"}/>
                        :
                            <div/>
                    } 
                </div>
                <div className={styles.message_item_time}>
                    {
                        moment().year() != moment(props.session.timestamp).year() 
                        ?
                            moment(props.session.timestamp).format("YYYY/MM/DD")
                        : (
                            (moment().month() != moment(props.session.timestamp).month()) || (moment().date() != moment(props.session.timestamp).date()) 
                            ?
                                moment(props.session.timestamp).format("MM/DD")
                            : 
                                moment(props.session.timestamp).format("HH:mm")    
                        )
                    }
                </div>        
            </div>
        </div>
    )
};

export default MessageItem;