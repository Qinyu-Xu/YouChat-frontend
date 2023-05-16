import {isBrowser, store} from "@/utils/store";
import { MentionsInput, Mention } from 'react-mentions';
import CircularJson from "circular-json";
import styles from "@/styles/chat.module.css";
import {Button} from "antd";


const TextBoard = (props: any) => {
    const socket: any = store.getState().webSocket;
    // 发送文本信息
    const handleClick = (e: any) => {
        if(isBrowser && socket !== null && socket.readyState===1) {
            if(props.text !== "") {
                const message = {
                    type: "send",
                    id: store.getState().userId,
                    sessionId: props.sessionId,
                    timestamp: Date.now(),
                    message: props.text,
                    messageType: "text",
                    reply: props.reply
                };
                const addM = {
                    "senderId": store.getState().userId,
                    "timestamp": Date.now(),
                    "messageId": -1,
                    "message": props.text,
                    "messageType": "text",
                    "reply": props.reply
                }
                socket.send(CircularJson.stringify(message));
                props.setMessages((message: any) => [...message, addM]);
            }
        }
        props.setText("");
    };

    return (
        <div className={styles.writing_box}>
            <MentionsInput
                style={{
                    height: "12.5rem",
                    '&multiLine': {
                        input: {
                            padding: "0 0.5rem 0 0.5rem",
                            margin: "0",
                            border: "0",
                            outline: "none",
                            overflow: "auto",
                            width: "100%",
                            height: "12.5rem",
                            fontSize: "1rem",
                            lineHeight: "1.5rem",
                        },
                        highlighter: {
                            padding: "0 0.5rem 0 0.5rem",
                            margin: "0",
                            border: "0",
                            outline: "none",
                            overflow: "auto",
                            width: "100%",
                            height: "12.5rem",
                            fontSize: "1rem",
                            lineHeight: "1.5rem",
                        },
                        suggestions: {
                            backgroundColor: "rgba(255,255,255,0.75)",
                            borderRadius: "0.5rem",
                            border: "0rem",
                            fontSize: "1rem",
                            lineHeight: "1.25rem",
                            color: "black",
                            padding: "0rem",
                            margin: "0",
                            zIndex: 1,
                            item: {
                                padding: '0.25rem 0.3rem',
                                borderRadius: '0.5rem',
                                '&focused': {
                                  backgroundColor: 'rgba(170, 220, 220, 0.5)',
                                },
                            }
                        },
                    },
                }}
                onChange={(e: any) => props.setText(e.target.value)}
                value={props.text}>
                <Mention 
                    style={{
                        backgroundColor: "rgba(255,255,255,0.5)",
                        borderRadius: "0.25rem",

                    }}
                    trigger="@"
                    markup="@[__display__](user:__id__)"
                    data={props.members.map((member: any) => ({id: member.id, display: member.nickname}))}
                    renderSuggestion={(suggestion, search, highlightedDisplay) => (
                        <div>{highlightedDisplay}</div>
                    )}
                />
            </MentionsInput>
            <div className={styles.send}>
                <Button onClick={handleClick} >发送</Button>
            </div>
        </div>
    )
};

export default TextBoard;