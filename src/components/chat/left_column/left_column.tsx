import {useEffect, useState} from "react";
import { request } from "@/utils/network";
import {message, Spin} from "antd";
import { isBrowser } from "@/utils/store";
import {store} from "@/utils/store";
import MessageItem from "./message_item";

const LeftColumn = (props: any) => {

    const [load, setLoad] = useState(false);
    const [loadname, setLoadname] = useState(false);
    const [sorted, setSorted] = useState(false);
    const id = store.getState().userId;

    const cmp = (a: any, b:any) => {
        if(a.isTop !== b.isTop) return - a.isTop + b.isTop;
        return - a.timestamp + b.timestamp;
    };

    const clearList = (sessionId: number) => {
        props.list.filter((msg: any) => msg.sessionId === sessionId)[0].unread = 0;
    }

    const refreshList = () => {
        request(
            `api/session/message/${id}`,
            "GET",
            ""
        ).then((response) => {
            if (response.code === 0) {
                const new_list = response.data;
                let old_list: any[] = props.list;
                for (let i = 0; i < new_list.length; ++i) {
                    if (old_list.filter((msg: any) => msg.sessionId === new_list[i].sessionId).length !== 0) {
                        old_list = old_list.map((msg: any) => msg.sessionId !== new_list[i].sessionId
                            ? msg
                            :
                            {
                                "sessionId": msg.sessionId,
                                "sessionName": msg.sessionName,
                                "sessionType": msg.sessionType,
                                "timestamp": new_list[i].timestamp,
                                "type": new_list[i].messageType,
                                "lastSender": new_list[i].senderName,
                                "message": new_list[i].message,
                                "isTop": new_list[i].isTop,
                                "isMute": new_list[i].isMute,
                                "unread": new_list[i].unread,
                            });
                    } else {
                        old_list.push(new_list[i]);
                    }
                }
                old_list = old_list.sort(cmp);
                props.setList([...old_list]);
            } else {
                message.error("获取聊天列表发生错误！").then(_ => _);
            }
        });
    }

    useEffect(() => {
        if (!load) {
            request(
                `api/session/message/${id}`,
                "GET",
                ""
            ).then((response) => {
                if( response.code === 0 ) {
                    props.setList(() => [-1]);
                    props.setList(() => response.data);
                }
                else {
                    message.error("获取聊天列表发生错误！").then(_=>_);
                }
            });
        }
    }, [load]);

    useEffect(() => {
        // console.log(list);
        // console.log(load);
        // console.log(loadname);
        // console.log(sorted);
        if (!load) {
            if (props.list[0] != -1) {
                setLoad(true);
                let l : any[] = [];
                for (let i = 0; i < props.list.length; ++ i) {
                    l.push(props.list[i]);
                }
                for(let i = 0; i < l.length; ++i) {
                    if(l[i].sessionType === 1 && l[i].sessionName === "friend") {
                        request(
                            "api/session/chatroom?id=" + l[i].sessionId,
                            "GET",
                            ""
                        ).then((res: any) => {
                            l[i].sessionName =
                                (res.members.filter((member: any) =>
                                    member.id !== store.getState().userId)
                                )[0].nickname;
                            // console.log("@@@@@@@@@@@");
                            // console.log(l);
                            props.setList(() => l.slice());
                        })
                    }
                }
            }
        }
        else if (!loadname) {
            let isTrue = true;
            for(let i = 0; i < props.list.length; ++i) {
                if(props.list[i].sessionType === 1 && props.list[i].sessionName === "friend") {
                    isTrue = false;
                    // console.log("# " + i + "  " + list[i].sessionName);
                }
            }
            // console.log("^^^^" + isTrue);
            if (isTrue) {
                setLoadname(true);
                props.setList((list : any) => list.sort(cmp));
            }
        }
        else {
            let isTrue = true;
            for (let i = 0; i + 1 < props.list.length; ++ i) {
                // console.log(i + "  " + (cmp(list[i], list[i + 1])));
                if (cmp(props.list[i], props.list[i + 1]) > 0) {
                    isTrue = false;
                }
            }
            // console.log("!" + isTrue);
            if(isTrue) {
                setSorted(true);
            }
        }
    }, [props.list, load, loadname]);

    useEffect(() => {
        if(load && loadname && sorted) refreshList();
    }, [props.refresh]);

    useEffect(() => {
        const socket: any = store.getState().webSocket;

        const handleNew =  (res: any) => {
            const msg = (eval("("+res.data+")"));
            if (msg.type === 'send') {
                props.setList((list: any) => list.map((item: any) => item.sessionId !== msg.sessionId ? item : {
                    "sessionId": item.sessionId,
                    "sessionName": item.sessionName,
                    "sessionType": item.sessionType,
                    "timestamp": msg.timestamp,
                    "type": msg.messageType,
                    "lastSender": msg.senderName,
                    "message": msg.message,
                    "isTop": item.isTop,
                    "isMute": item.isMute,
                    "unread": msg.senderId !== store.getState().userId ? item.unread + 1 : item.unread,
                }));
                props.setList((list : any) => list.sort(cmp));
            }
        };

        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handleNew);
            return () => {
                socket.removeEventListener("message", handleNew);
            }
        }
    }, [loadname, sorted, store.getState().webSocket]);

    return load && loadname && sorted
        ?
        (
        <div>
            {
                props.list.map((session: any) => (
                    <div key={session.sessionId} onClick={ _ => {props.setSession(session); clearList(session.sessionId)}}>
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
