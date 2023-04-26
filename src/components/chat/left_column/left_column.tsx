import {useEffect, useState} from "react";
import { request } from "@/utils/network";
import {message, Skeleton, Spin} from "antd";
import { isBrowser } from "@/utils/store";
import styles from "@/styles/layout.module.css";
import {store} from "@/utils/store";
import MessageItem from "./message_item";

const LeftColumn = (props: any) => {

    const [list, setList] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const id = store.getState().userId;

    const sortList = () => {
        setList((list : any) => list.sort((a: any, b:any) => {
            if(a.isTop !== b.isTop) return - a.isTop + b.isTop;
            return - a.timestamp + b.timestamp;
        }));
    };

    const getList = () => {
        request(
            `api/session/message/${id}`,
            "GET",
            ""
        ).then((response ) => {
        if( response.code === 0 ) {
            const l = (response.data);
            for(let i = 0; i < l.length; ++i) {
                if(l[i].sessionType === 1) {
                    request(
                        "api/session/chatroom?id=" + l[i].sessionId,
                        "GET",
                        "").then((res: any) => {
                            l[i].sessionName =
                                (res.members.filter((member: any) =>
                                    member.id !== store.getState().userId)
                                )[0].nickname;
                            setList(l);
                        }
                    )
                }
            }
            sortList();
            setLoad(true);
        } else {
            message.error("获取聊天列表发生错误！").then(_=>_);
        }});
    };

    useEffect(() => {
        let isTrue = true;
        for(let i = 0; i < list.length; ++i) {
            if(list[i].sessionType === 1 && list[i].sessionName === "friend") {
                isTrue = false;
            }
        }
        if(isTrue)
            setLoad(true);
    }, [list]);

    useEffect(() => {
        getList();
        sortList();
    }, [props.refresh]);

    useEffect(() => {
        const socket: any = store.getState().webSocket;
        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", (res: any) => {
                const msg = (eval("("+res.data+")"));
                if (msg.type === 'send') {
                    console.log(msg);
                    setList((list: any) => list.map((item: any) => item.sessionId !== msg.sessionId ? item : {
                        "sessionId": item.sessionId,
                        "sessionName": item.sessionName,
                        "sessionType": item.sessionType,
                        "timestamp": msg.timestamp,
                        "type": msg.messageType,
                        "lastSender": msg.senderName,
                        "message": msg.message,
                        "isTop": item.isTop,
                        "isMute": item.isMute
                    }));
                    sortList();
                }
            });
        }
    }, [load, store.getState().webSocket]);

    return load
        ?
        (
        <div>
            {
                list.map((session: any) => (
                    <div key={session.sessionId} onClick={ _ => {props.setSession(session);}}>
                        <MessageItem session={session}/>
                    </div>
                ))
            }
        </div>
        )
        :
        <Spin />
        ;
};

export default LeftColumn;
