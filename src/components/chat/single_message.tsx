import styles from "@/styles/chat.module.css"
import {useEffect, useState} from "react";
import TextBoard from "@/components/chat/single_message/text";
import {ImgIcon} from "@/components/chat/single_message/image";
import AudioInput, {AudioIcon} from "@/components/chat/single_message/audio";
import EmojiBoard, {EmojiIcon} from "@/components/chat/single_message/emoji";
import {FileIcon} from "@/components/chat/single_message/file";
import {VideoIcon} from "@/components/chat/single_message/video";
import {store} from "@/utils/store";


const SingleMessage = (props: any) => {
    const [audio, setAudio] = useState(false);
    const [emoji, setEmoji] = useState(false);
    const [myName, setMyName] = useState("");
    useEffect(() => {
        setMyName(props.members.filter((member: any) => member.id === store.getState().userId)[0].nickname);
    }, [props.members]);

    return (
        <div className={styles.input_box}>
            {emoji ? <EmojiBoard text={props.text} setText={props.setText}/> : <div></div>}
            <div className={styles.function_bar}>
                <EmojiIcon setEmoji={setEmoji} emoji={emoji}/>
                <ImgIcon sessionId={props.sessionId} setMessages={props.setMessages} myName={myName}/>
                <AudioIcon setAudio={setAudio} myName={myName}/>
                <FileIcon sessionId={props.sessionId} setMessages={props.setMessages} myName={myName}/>
                { props.members.length === 2 ?
                    <VideoIcon
                        sessionId={props.sessionId}
                        to={props.members.filter((member: any) => member.id !== store.getState().userId)[0].id}/>
                    : <div></div>
                }
            </div>
            {
                audio
                    ? <AudioInput sessionId={props.sessionId} setAudio={setAudio} setMessages={props.setMessages} myName={myName}/>
                    : <TextBoard text={props.text} setMessages={props.setMessages} setText={props.setText}
                        sessionId={props.sessionId} members={props.members} reply={props.reply} myName={myName}/>
            }

        </div>
    );
}

export default SingleMessage;