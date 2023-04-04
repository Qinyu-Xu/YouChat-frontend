import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { getSocket } from "@/utils/websocket";
import { request } from "@/utils/network";
import { message } from "antd";
import styles from "@/styles/layout.module.css";


const ChatList = () => {

    const [cookie, setCookie] = useCookies(['token', 'id']);
    const [list, setList] = useState(null);
    const socket = getSocket();
    const id = cookie.id;

    const sortList = () => {
        list.sort((a, b) => {
            if(a.isTop < b.isTop) return true;
            else if(a.isTop > b.isTop) return false;

            if(a.isMute < b.isMute) return false;
            else if(a.isMute > b.isMute) return true;

            return a.timestamp < b.timestamp;
        })
    }

    const getList = () => {
        request(
            `api/session/message/${id}`,
            "GET",
            ""
        ).then((response ) => {
        if( response.id === 0 ) {
            setList(response.data);
            sortList();
        } else {
            message.error("获取聊天列表发生错误！").then(_=>_);
        }});
    };

    socket.on("send", (res) => {
        setList((list) => list.map((item) => item.sessionId !== res.sessionId ? item :{
            "sessionId": item.sessionId,
            "sessionName": item.sessionName,
            "timestamp": item.timestamp,
            "type": "text",
            "message": res.message,
            "isTop": item.isTop,
            "isMute": item.isMute
        }));
        sortList();
    });

    useEffect(() => {
        getList();
        sortList();
    }, []);

    return (
        <div>
            {
                list.map((session) => (
                    <div className={styles.column_item}>
                        <text>{session.sessionName}</text>
                        <text>{session.message}</text>
                    </div>
                ))
            }
        </div>
    );
};

export default ChatList;