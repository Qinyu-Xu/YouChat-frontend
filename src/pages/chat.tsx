import React, {useState} from "react";
import Sidebar from "@/components/sidebar";
import styles from "@/styles/layout.module.css"
import ChatList from "@/components/chat/chat_list";
import ChatBoard from "@/components/chat/chat_board";


const Chat = () => {

    const [session, setSession] = useState<number>(0);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.column}>
                <ChatList setSession={setSession}/>
            </div>
          {/* x */}
                <div className={styles.content}>
                    <ChatBoard sessionId={session}/>
                </div>
                {/* :
                <div>
                </div>
            } */}
        </div>
    );
}

export default Chat;