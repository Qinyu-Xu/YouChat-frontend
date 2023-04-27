import {useEffect, useState} from "react";
import { request } from "@/utils/network";
import {message, Skeleton, Spin} from "antd";
import { isBrowser } from "@/utils/store";
import styles from "@/styles/layout.module.css";
import {store} from "@/utils/store";
import MessageItem from "./message_item";

const LeftColumn = (props: any) => {

    const [list, setList] = useState<any>([-1]);
    const [load, setLoad] = useState(false);
    const [loadname, setLoadname] = useState(false);
    const [sorted, setSorted] = useState(false);
    const id = store.getState().userId;

    const cmp = (a: any, b:any) => {
        if(a.isTop !== b.isTop) return - a.isTop + b.isTop;
        return - a.timestamp + b.timestamp;
    };

    useEffect(() => {
        if (!load) {
            request(
                `api/session/message/${id}`,
                "GET",
                ""
            ).then((response) => {
                if( response.code === 0 ) {
                    setList(() => [-1]);
                    setList(() => response.data);
                }
                else {
                    message.error("获取聊天列表发生错误！").then(_=>_);
                }
            });
        }
    }, [load, props.refresh]);

    useEffect(() => {
        // console.log(list);
        // console.log(load);
        // console.log(loadname);
        // console.log(sorted);
        if (!load) {
            if (list[0] != -1) {
                setLoad(true);
                var l : any[] = [];
                for (let i = 0; i < list.length; ++ i) {
                    l.push(list[i]);
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
                            setList(() => l.slice());
                        })
                    }
                }
            };
        }
        else if (!loadname) {
            let isTrue = true;
            for(let i = 0; i < list.length; ++i) {
                if(list[i].sessionType === 1 && list[i].sessionName === "friend") {
                    isTrue = false;
                    // console.log("# " + i + "  " + list[i].sessionName);
                }
            }
            // console.log("^^^^" + isTrue);
            if (isTrue) {
                setLoadname(true);
                setList((list : any) => list.sort(cmp));
            }
        }
        else {
            let isTrue = true;
            for (let i = 0; i + 1 < list.length; ++ i) {
                // console.log(i + "  " + (cmp(list[i], list[i + 1])));
                if (cmp(list[i], list[i + 1]) > 0) {
                    isTrue = false;
                }
            }
            // console.log("!" + isTrue);
            if(isTrue) {
                setSorted(true);
            }
        }
    }, [list, load, loadname]);

    useEffect(() => {
        setList([-1]);
        setLoad(false);
        setLoadname(false);
        setSorted(false);
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
                    setList((list : any) => list.sort(cmp));
                }
            });
        }
    }, [loadname, sorted, store.getState().webSocket]);

    return load && loadname && sorted
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
