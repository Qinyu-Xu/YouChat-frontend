import { getSocket } from "@/utils/websocket";
import { useState } from "react";
import { useCookies } from "react-cookie";
import SingleMessage from "@/components/chat/single_message";

interface ChatBoardProps {
    sessionId: number;
}

const ChatBoard = (props: ChatBoardProps) => {

    const socket = getSocket();
    const [cookie, setCookie] = useCookies(["id"]);
    const [messages, setMessages] = useState<any>([]);
    const id = cookie.id;

    socket.emit("pull", {"sessionId": props.sessionId, "messageScale": 30});
    socket.on("pull", (res) => {
        setMessages(res.messages);
    })
    socket.on("send", (res) => {
        if(res.sessionId === props.sessionId) {
            setMessages((messages: any) => [...messages, {
                "senderId": res.senderId,
                "timestamp": res.timestamp,
                "message": res.message,
                "messageId": res.messageId
            }]);
        }
    })

    return props.sessionId === 0 ? <div></div> :(
        <div>
            {messages.map((message: any) => (
                <div key={message.messageId} >
                    <img src={`api/session/img/${message.senderId}`} alt={"Loading..."}/>
                    <text>
                        {message.message}
                    </text>
                </div>
            ))}
            <SingleMessage session={props.sessionId}/>
        </div>

    )
};

export default ChatBoard;
