import { Button, Input } from "antd";
import {isBrowser} from "@/utils/store";
import {store} from "@/utils/store"

interface SingleMessageProps {
    session: number;
}

const SingleMessage = (props: SingleMessageProps) => {
    const socket: any = store.getState().webSocket;
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