import { Button, Input } from "antd";

interface SingleMessageProps {
    session: number;
}

const SingleMessage = (props: SingleMessageProps) => {
    /*
    const handleClick = (text: any) => {
        socket.emit("send", {
            "sessionId": props.session,
            "message": text
        });
    }*/
    return (
        <div>
            <Input />
            <Button /*onClick={handleClick}*/ />
        </div>
    );
}

export default SingleMessage;