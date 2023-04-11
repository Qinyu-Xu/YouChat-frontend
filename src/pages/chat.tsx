import React, {useState} from "react";
import Sidebar from "@/components/sidebar";
import styles from "@/styles/layout.module.css"
import ChatList from "@/components/chat/chat_list";
import ChatBoard from "@/components/chat/chat_board";
import UpperBar from "@/components/chat/upper_bar";


const Chat = () => {

    const [session, setSession] = useState<number>(0);

    return (
        <div>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.column}>
                <UpperBar />
                <ChatList setSession={setSession}/>
            </div>
            { session !== 0
                ?
                <div className={styles.content}>
                    <ChatBoard sessionId={session}/>
                </div>
                :
                <div>
                </div>
            }
        </div>
    );
}

export default Chat;