import styles from "@/styles/right.module.css";
import {Divider, message, Switch} from "antd";
import {useState} from "react";
import {request} from "@/utils/network";
import {store} from "@/utils/store";
import {RightOutlined, UnorderedListOutlined} from "@ant-design/icons";
import ChatHistory from "@/components/chat/right_column/chat_history";
import UserList from "@/components/chat/right_column/user_list";

export const MenuShow = (_: any) => {
    const handleClick = (_: any) => {
        const item = document.getElementById("mySidenav");
        if(item) {
            if (item.style.right === "-20rem") item.style.right = "0";
            else if(item.style.right === "0") item.style.right = "-20rem";
            else item.style.right = "0";
        }
    }
    return (
        <UnorderedListOutlined onClick={handleClick}> </UnorderedListOutlined>
    );
}

const RightColumn = (props: any) => {
    const [open, setOpen] = useState(false);
    const curTop = true;
    const curMute = false;
    const handleMute = (isMute: boolean) => {
        request(
            "/api/session/setting",
            "PUT",
            JSON.stringify({
                userId: store.getState().userId,
                sessionId: props.sessionId,
                isMute: isMute,
                isTop: curTop
            })
        ).catch((e: any) => {
            message.error("设置静音失败！");
        })
    }
    const handleTop = (isTop: boolean) => {
        request(
            "/api/session/setting",
            "PUT",
            JSON.stringify({
                userId: store.getState().userId,
                sessionId: props.sessionId,
                isMute: curMute,
                isTop: isTop
            })
        ).catch((e: any) => {
            message.error("设置置顶失败！");
        })
    }

    const handleHistory = () => setOpen(true);
    const handleBoard = () => {};
    const handleMana = () => {};
    const handleInvite = () => {};

    return <div id="mySidenav" className={styles.sidenav}>
        群成员
        <UserList members={props.members}/>
        <Divider />
        群名：
        <br />
        <div onClick={handleBoard}>
            群公告
            <RightOutlined />
        </div>
        <br />
        <Divider />
        <div onClick={handleInvite}>
            管理群成员
            <RightOutlined />
        </div>
        <br/>
        <div onClick={handleMana}>
            设置管理员
            <RightOutlined />
        </div>
        <br/>
        <div onClick={handleHistory}>
            消息记录
            <RightOutlined />
        </div>
        <br />



        <Divider />
        设置静音<Switch defaultChecked onChange={handleMute} />
        <br />
        设置置顶<Switch defaultChecked onChange={handleTop} />
        <br />
        <ChatHistory open={open} setOpen={setOpen} members={props.members}/>
    </div>
}

export default RightColumn;