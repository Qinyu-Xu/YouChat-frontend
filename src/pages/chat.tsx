import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import SideBar from "@/components/chat/bar/side_bar"
import NavBar from "@/components/chat/bar/nav_bar";
import TopicMenu from "@/components/chat/bar/topic_menu";
import Setting from "@/components/settings/setting";
import Sidebar from "@/components/sidebar";


const Chat = () => {
    const topics = ["聊天", "好友", "设置"];
    const [contentIndex, setContentIndex] = useState(0);
    const [selectedKey, setSelectedKey] = useState("0");

    const changeSelectedKey = (event: any) => {
        const key = event.key;
        setSelectedKey(key);
        setContentIndex(+key);
    };

    const Menu = <TopicMenu
            selectedKey={selectedKey}
            changeSelectedKey={changeSelectedKey}/>;

    let content = <Setting />;
    useEffect(() => {
        if (contentIndex == 1) {
            content = <Setting />
        }
    }, [contentIndex]);

    return (
        <div>
            <NavBar menu={Menu} />
            <Layout>
                <Sidebar />
                <Layout.Content className="content">
                    {content}
                </Layout.Content>
            </Layout>
        </div>
    );
}

export default Chat;