import React, {useState} from "react";
import Sidebar from "@/components/sidebar";
import styles from "@/styles/layout.module.css"
import LeftColumn from "@/components/chat/left_column/left_column";
import ChatBoard from "@/components/chat/chat_board";
import UpperBar from "@/components/chat/upper_bar";

const Chat = () => {

    const [list, setList] = useState<any>([]);
    const [session, setSession] = useState(null);
    const [refresh, setRefresh] = useState(0);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.column}>
                <UpperBar setRefresh={setRefresh}/>
                <LeftColumn setSession={setSession} refresh={refresh}
                    list={list} setList={setList}/>
            </div>
            { session === null ? <div></div> :
                <div className={styles.content}>
                    <ChatBoard session={session}/>
                </div>
            }
        </div>
    );
}

export default Chat;