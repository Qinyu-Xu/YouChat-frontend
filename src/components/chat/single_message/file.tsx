import styles from "@/styles/chat.module.css";
import {message} from "antd";
import {fileToBase64} from "@/utils/utilities";
import {store} from "@/utils/store";
import CircularJson from "circular-json";
import {FileOutlined} from "@ant-design/icons";

const extractFileNameAndBase64 = (data: any) => {
    const separatorIndex = data.indexOf('//');
    if (separatorIndex !== -1) {
        const fileName = data.substring(0, separatorIndex).trim();
        const base64Data = data.substring(separatorIndex + 2).trim();
        return { fileName, base64Data };
    }

    return { fileName: '文件！', base64Data: '' };
};

export const FileViewer = ({base}: any) => {
    const {fileName, base64Data} = extractFileNameAndBase64(base);

    const handleClick = () => {
        fetch(base64Data).then(res => res.blob()).then(blob => {
            const url = URL.createObjectURL(blob);
            const win: any = window.open(url, "_blank");
            if(win !== null) win.focus();
            else message.error("弹窗未能正常弹出！");
        }).catch((error: any) => {
            message.error("文件编码有误！");
        });
    }
    return (
    <div onClick={handleClick}>
        <FileOutlined />
        {fileName}
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
            if (file.size > 1024 * 1024) {
                message.error("请上传小于1M的文件！");
            } else {
                fileToBase64(file).then((res: any) => {
                    const socket: any = store.getState().webSocket;
                    const message = {
                        type: "send",
                        id: store.getState().userId,
                        sessionId: props.sessionId,
                        timestamp: Date.now(),
                        message: file.name + "//" +res,
                        messageType: "file"
                    }
                    const addM = {
                        "senderName": props.myName,
                        "senderId": store.getState().userId,
                        "timestamp": Date.now(),
                        "messageId": -1,
                        "message": file.name + "//" + res,
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