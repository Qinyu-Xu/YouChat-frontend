import { Button, Input } from "antd";
import { useContext } from "react";
import {isBrowser, MyContext} from "@/utils/global";

interface SingleMessageProps {
    session: number;
}

const SingleMessage = (props: SingleMessageProps) => {
    const socket: any = useContext(MyContext);
    const handleClick = (text: any) => {
        if(isBrowser)
            socket?.send(JSON.stringify({
            type: "send",
            "sessionId": props.session,
            "message": text
        }));
    }
    return (
        <div>
            <Input />
            <Button onClick={handleClick} />
        </div>
    );
}

export default SingleMessage;