import React from "react";
import Sidebar from "@/components/sidebar";
import styles from "@/styles/layout.module.css"
import ChatList from "@/components/chat/chat_list";
import ChatBoard from "@/components/chat/chat_board";


const Chat = () => {



    return (
        <div>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.column}>
                <ChatList />
            </div>
            <div className={styles.content}>
                <ChatBoard />
            </div>
        </div>
    );
}

export default Chat;