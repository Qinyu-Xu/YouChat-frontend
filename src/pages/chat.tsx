import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import SideBar from "@/components/chat/bar/side_bar"
import NavBar from "@/components/chat/bar/nav_bar";
import TopicMenu from "@/components/chat/bar/topic_menu";
import styles from "@/styles/chat.module.css"
import Settings from "@/components/chat/settings";


const Chat = () => {
    const topics = ["聊天", "好友", "设置"];
    const [contentIndex, setContentIndex] = useState(0);
    const [selectedKey, setSelectedKey] = useState("0");

    const changeSelectedKey = (event) => {
        const key = event.key;
        setSelectedKey(key);
        setContentIndex(+key);
    };

    const Menu = <TopicMenu
            selectedKey={selectedKey}
            changeSelectedKey={changeSelectedKey}/>;

    let content = <Settings />;
    useEffect(() => {
        if (contentIndex == 1) {
            content = <Settings />
        }
    }, [contentIndex]);

    return (
        <div className={styles.main}>
            <NavBar menu={Menu} />
            <Layout>
                <SideBar menu={Menu} />
                <Layout.Content className="content">
                    {content}
                </Layout.Content>
            </Layout>
        </div>
    );
}

export default Chat;