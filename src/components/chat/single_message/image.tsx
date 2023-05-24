import {message} from "antd";
import {fileToBase64} from "@/utils/utilities";
import {store} from "@/utils/store";
import CircularJson from "circular-json";
import styles from "@/styles/chat.module.css";

export const ImgIcon = (props: any) => {
    // 发送图片
    const handleImageClick = () => {
        const imgInput: any = document.getElementById("imgInput");
        imgInput.click();
    };

    const handleImgSelect = (e: any) => {
        const file = e.target.files[0];
        if(file) {
            if (!file.type.startsWith("image/")) {
                message.error("请上传图片！");
            } else if(file.size > 1024 * 1024) {
                message.error("请上传小于1M的图片")
            } else {
                fileToBase64(file).then((res: any) => {
                    const socket: any = store.getState().webSocket;
                    const message = {
                        type: "send",
                        id: store.getState().userId,
                        sessionId: props.sessionId,
                        timestamp: Date.now(),
                        message: res,
                        messageType: "photo"
                    }
                    const addM = {
                        "senderName": props.myName,
                        "senderId": store.getState().userId,
                        "timestamp": Date.now(),
                        "messageId": -1,
                        "message": res,
                        "messageType": "photo",
                    };
                    socket.send(CircularJson.stringify(message));
                    props.setMessages((message: any) => [...message, addM]);
                })
            }
        }
        const imgInput: any = document.getElementById("imgInput");
        imgInput.value = "";
    };

    return (
        <div>
            <div className={styles.function_button} onClick={handleImageClick}>
                <input type="file" id="imgInput" style={{display: "none"}} onChange={handleImgSelect} />
                <img src="ui/pic.svg"/>
            </div>
        </div>
    );
}
