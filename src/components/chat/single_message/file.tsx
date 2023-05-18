import styles from "@/styles/chat.module.css";
import {message} from "antd";
import {fileToBase64} from "@/utils/utilities";
import {store} from "@/utils/store";
import CircularJson from "circular-json";
import {FileOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";

export const FileViewer = ({base}: any) => {
    const [fileName, setFileName] = useState(null);

    useEffect( () => {
            fetch(base).then(res => res.blob()).then((blob: any) => {
                setFileName(blob.name)
            });
        }
    ,[]);
    const handleClick = () => {
        fetch(base).then(res => res.blob()).then(blob => {
            const url = URL.createObjectURL(blob);
            const win: any = window.open(url, "_blank");
            if(win !== null) win.focus();
            else message.error("弹窗未能正常弹出！");
        });
    }
    return (
    <div onClick={handleClick}>
        <FileOutlined />
        {fileName === null ? "文件" : fileName}
    </div>
    );
}

export const FileIcon = (props: any) => {
    // 发送图片
    const handleFileClick = () => {
        const fileInput: any = document.getElementById("fileInput");
        fileInput.click();
    };

    const handleFileSelect = (e: any) => {
        const file = e.target.files[0];
        if(file) {
            if (/*!file.type.startsWith("file/")*/false) {
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