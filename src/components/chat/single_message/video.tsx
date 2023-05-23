import styles from "@/styles/chat.module.css";
import {useState} from "react";
import {Receiver, ReceiverBoard, Sender, SenderBoard} from "@/components/chat/single_message/video_chat";

export const VideoIcon = (props: any) => {

    const [senderOpen, setSenderOpen] = useState(false);
    const handleClick = () => {setSenderOpen(true);}

    return (
        <div>
            <div className={styles.function_button} onClick={handleClick}>
                <img src="ui/phone-video-call.svg"/>
            </div>
            <SenderBoard to={props.to} sessionId={props.sessionId} setOpen={setSenderOpen} open={senderOpen}/>
        </div>
    );
}