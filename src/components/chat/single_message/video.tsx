import styles from "@/styles/chat.module.css";
import {useState} from "react";
import {Modal} from "antd";
import {Receiver, ReceiverBoard, Sender, SenderBoard} from "@/components/chat/single_message/video_chat";

export const VideoIcon = (props: any) => {

    const [senderOpen, setSenderOpen] = useState(false);
    const [isSender, setSender] = useState(false);
    const [isOk, setOk] = useState(false);

    const handleClick = () => {
        setSenderOpen(true);
        setSender(true);
    }

    return (
        <div>
            <div className={styles.function_button} onClick={handleClick}>
                <img src="ui/phone-video-call.svg"/>
            </div>
            <SenderBoard to={props.to} setSender={setSender} sessionId={props.sessionId} setOpen={setSenderOpen} open={senderOpen} setOk={setOk}/>
            <ReceiverBoard to={props.to} setSender={setSender} sessionId={props.sessionId} setOk={setOk}/>
            {
                !isOk ? <div> </div> :  isSender ? <Sender sessionId={props.sessionId} to={props.to} /> : <Receiver to={props.to} />
            }
        </div>
    );
}