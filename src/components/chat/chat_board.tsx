import { getSocket } from "@/utils/websocket";
import {useState} from "react";
import {useCookies} from "react-cookie";

interface ChatBoardProps {
    sessionId: number;
}

const ChatBoard = (props: ChatBoardProps) => {

    const socket = getSocket();
    const [cookie, setCookie] = useCookies(["id"]);
    const [messages, setMessages] = useState([]);
    const id = cookie.id;

    socket.emit("pull", {"sessionId": props.sessionId, "messageScale": 30});
    socket.on("pull", (res) => {
        setMessages(res.messages);
    })
    socket.on("send", (res) => {
        if(res.sessionId === props.sessionId) {
            setMessages(messages => [...messages, {
                "senderId": res.senderId,
                "timestamp": res.timestamp,
                "message": res.message,
            }]);
        }
    })

    return (
        <div>
            {messages.map((message) => (
                <div>
                    <img src={`api/session/img/${message.senderId}`} alt={"Loading..."}/>
                    <text>
                        {message.message}
                    </text>
                </div>
            ))}
        </div>
    )
};

export default ChatBoard;
