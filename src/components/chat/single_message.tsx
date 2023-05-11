import styles from "@/styles/chat.module.css"
import {useState} from "react";
import TextBoard from "@/components/chat/single_message/text";
import {ImgIcon} from "@/components/chat/single_message/image";
import AudioInput, {AudioIcon} from "@/components/chat/single_message/audio";
import EmojiBoard, {EmojiIcon} from "@/components/chat/single_message/emoji";
import {FileIcon} from "@/components/chat/single_message/file";
import {VideoIcon} from "@/components/chat/single_message/video";


const SingleMessage = (props: any) => {
    const [audio, setAudio] = useState(false);
    const [emoji, setEmoji] = useState(false);
    const [vedio, setVideo] = useState(false);
    const [text, setText] = useState("");

    return (
        <div className={styles.input_box}>
            {emoji ? <EmojiBoard text={text} setText={setText}/> : <div></div>}
            <div className={styles.function_bar}>
                <EmojiIcon setEmoji={setEmoji} emoji={emoji}/>
                <ImgIcon sessionId={props.sessionId} setMessages={props.setMessages}/>
                <AudioIcon setAudio={setAudio} />
                <FileIcon />
                <VideoIcon />
            </div>
            {
                audio
                    ? <AudioInput sessionId={props.sessionId} setAudio={setAudio}/>
                    : <TextBoard text={text} setMessages={props.setMessages} setText={setText} sessionId={props.sessionId}/>
            }

        </div>
    );
}

export default SingleMessage;