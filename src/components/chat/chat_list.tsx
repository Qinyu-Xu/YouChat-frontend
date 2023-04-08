import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { request } from "@/utils/network";
import { message } from "antd";
import styles from "@/styles/layout.module.css";

interface ChatListProps {
    setSession: (value: (((prevState: number) => number) | number)) => void
}

const ChatList = (props: ChatListProps) => {

    const [cookie, setCookie] = useCookies(['token', 'id']);
    const [list, setList] = useState([]);
    const id = cookie.id;

    const sortList = () => {
        list.sort((a: any, b:any) => {
            if(a.isTop < b.isTop) return 1;
            else if(a.isTop > b.isTop) return -1;

            if(a.isMute < b.isMute) return -1;
            else if(a.isMute > b.isMute) return 1;

            return a.timestamp - b.timestamp;
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

    /*socket.on("send", (res: any) => {
        setList((list: any) => list.map((item: any) => item.sessionId !== res.sessionId ? item :{
            "sessionId": item.sessionId,
            "sessionName": item.sessionName,
            "timestamp": item.timestamp,
            "type": "text",
            "message": res.message,
            "isTop": item.isTop,
            "isMute": item.isMute
        }));
        sortList();
    });*/

    useEffect(() => {
        getList();
        sortList();
    }, []);

    return (
        <div>
            {
                list.map((session: any) => (
                    <div className={styles.column_item} key={session.sessionId} onClick={_ => props.setSession(session.sessionId)}>
                        <text>{session.sessionName}</text>
                        <text>{session.message}</text>
                    </div>
                ))
            }
        </div>
    );
};

export default ChatList;