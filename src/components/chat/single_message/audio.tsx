import {useEffect, useState} from "react";
import {Avatar, message} from "antd";
import styles from "@/styles/chat.module.css";
import {AudioFilled, AudioOutlined} from "@ant-design/icons";

const AudioInput = (props: any) => {
    const [recording, setRecording] = useState(false);

    // 发送语音
    /*
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);
    const [mediaStream, setMediaStream] = useState<any>(null);
    let chuncks = [];
     */

    const handleSpeech = () => props.setAudio(audio => !audio);
    useEffect(() => {
        // initMediaRecorder();
        /*
        return () => {
            setRecording(false);
            setMediaRecorder(null);
            setMediaStream(null);
        }

         */
    }, [props.sessionId]);

    /*
    const initMediaRecorder = async () => {
        try {
            const stream: any = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder: any = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setMediaStream(stream);
        } catch (error: any) {
            message.error('Error initializing MediaRecorder:', error);
        }
    };

     */
/*
    useEffect(() => {

        if (mediaRecorder) {
            mediaRecorder.ondataavailable = (e: any) => {
                if (e.data.size > 0)
                    chuncks.push(e.data);
            };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chuncks);
                const base64Audio = await fileToBase64(audioBlob);
                console.log('Base64 Audio:', base64Audio);
                mediaStream.getAudioTracks().forEach((track) => {track.stop();})
            }
        }


    }, [mediaRecorder]);

 */

    const startSpeechRecognition = () => {
        /* if(!recording) {
            if(mediaRecorder) {
                if (mediaStream)
                    mediaStream.getAudioTracks().forEach((track) => {track.enabled = true});
                chuncks = [];
                setRecording(true);
                mediaRecorder.start();
            }
        } else {
            setRecording(false);
            mediaRecorder.stop();
        }
        */
    }

    return (
        <div className={styles.audio}>
            <Avatar icon={recording ? <AudioFilled /> : <AudioOutlined />} size={"large"} onClick={startSpeechRecognition}/>
        </div>
    )
}

export const AudioIcon = (props: any) => {
    const handleSpeech = () => {props.setAudio(audio => !audio);}
    return (
        <div className={styles.function_button} onClick={handleSpeech}>
            <img src="ui/microphone.svg"/>
        </div>
    )
}



export default AudioInput;