import { Button, Input } from "antd";
import store from "@/utils/store";

interface SingleMessageProps {
    session: number;
}

const SingleMessage = (props: SingleMessageProps) => {
    const socket = store.getState().socket;
    const handleClick = (text: any) => {
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