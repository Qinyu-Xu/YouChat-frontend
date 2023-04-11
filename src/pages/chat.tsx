import React, {useState} from "react";
import Sidebar from "@/components/sidebar";
import styles from "@/styles/layout.module.css"
import ChatList from "@/components/chat/chat_list";
import ChatBoard from "@/components/chat/chat_board";
import UpperBar from "@/components/chat/upper_bar";


const Chat = () => {

    const [session, setSession] = useState(null);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.column}>
                <UpperBar />
                <ChatList setSession={setSession}/>
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