import styles from "@/styles/chat.module.css";
import {message} from "antd";
import {fileToBase64} from "@/utils/utilities";
import {store} from "@/utils/store";
import CircularJson from "circular-json";

export const FileIcon = (props: any) => {
    // 发送图片
    const handleFileClick = () => {
        const fileInput: any = document.getElementById("fileInput");
        fileInput.click();
    };

    const handleFileSelect = (e: any) => {
        const file = e.target.files[0];
        if(file) {
            if (!file.type.startsWith("file/")) {
                console.log(file.type);
                message.error("请上传文件！");
            } else {
                fileToBase64(file).then((res: any) => {
                    const socket: any = store.getState().webSocket;
                    const message = {
                        type: "send",
                        id: store.getState().userId,
                        sessionId: props.sessionId,
                        timestamp: Date.now(),
                        message: res,
                        messageType: "file"
                    }
                    const addM = {
                        "senderId": store.getState().userId,
                        "timestamp": Date.now(),
                        "messageId": -1,
                        "message": res,
                        "messageType": "file"
                    };
                    socket.send(CircularJson.stringify(message));
                    props.setMessages((message: any) => [...message, addM]);
                })
            }
        }
        const fileInput: any = document.getElementById("fileInput");
        fileInput.value = "";
    };


    return (
        <div className={styles.function_button} onClick={handleFileClick}>
            <input type="file" id="fileInput" style={{display: "none"}} onChange={handleFileSelect} />
            <img src="ui/file-addition.svg"/>
        </div>
    )
}