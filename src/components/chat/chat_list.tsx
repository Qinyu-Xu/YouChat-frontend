import {useEffect, useState} from "react";
import { request } from "@/utils/network";
import { message } from "antd";
import styles from "@/styles/layout.module.css";
import {store} from "@/utils/store";

const ChatList = (props: any) => {

    const [list, setList] = useState([]);
    const id = store.getState().userId;

    const sortList = () => {
        list.sort((a: any, b:any) => {
            if(a.isTop < b.isTop) return 1;
            else if(a.isTop > b.isTop) return -1;
            return a.timestamp - b.timestamp;
        })
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
        } else {
            message.error("获取聊天列表发生错误！").then(_=>_);
        }});
    };

    /*
    if(isBrowser && socket) {
        socket.addEventListener("message", (res: any) => {
            console.log(res.data);
            const msg = (eval("("+res.data+")"));
            if (msg.type === 'send') {
                setList((list: any) => list.map((item: any) => item.sessionId !== msg.sessionId ? item : {
                    "sessionId": item.sessionId,
                    "sessionName": item.sessionName,
                    "timestamp": item.timestamp,
                    "type": "text",
                    "message": res.message,
                    "isTop": item.isTop,
                    "isMute": item.isMute
                }));
                sortList();
            }
        });
    }*/

    useEffect(() => {
        getList();
        sortList();
    }, [props.refresh]);

    return (
        <div>
            {
                list.map((session: any) => (
                    <div className={styles.column_item} key={session.sessionId} onClick={ _ => {props.setSession(session);}}>
                        {session.sessionName}
                    </div>
                ))
            }
        </div>
    );
};

export default ChatList;