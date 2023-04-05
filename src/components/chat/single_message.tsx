import { getSocket } from "@/utils/websocket";
import { Button, Input } from "antd";

interface SingleMessageProps {
    session: number;
}

const SingleMessage = (props: SingleMessageProps) => {
    const socket = getSocket();
    const handleClick = (text) => {
        socket.emit("send", {
            "sessionId": props.session,
            "message": text
        });
    }
    return (
        <div>
            <Input />
            <Button onClick={handleClick} />
        </div>
    );
}

export default SingleMessage;