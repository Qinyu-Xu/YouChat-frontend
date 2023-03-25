import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import styles from "@/components/chat/bar/nav_bar.module.css";

const NavBar = ({menu}: {menu: any}) => {
    const [visible, setVisible] = useState(false);
    return (
        <nav className={styles.navbar}>
            <Button
                className={styles.menu}
                type="primary"
                icon={<MenuOutlined />}
                onClick={() => setVisible(true)}
            />
            <Drawer
                title="Topics"
                placement="left"
                onClick={() => setVisible(false)}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                {menu}
            </Drawer>
        </nav>
    );
};
export default NavBar;