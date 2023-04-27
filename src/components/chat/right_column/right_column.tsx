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
            if (item.style.right === "-20rem") item.style.right = "0px";
            else if(item.style.right === "0px") item.style.right = "-20rem";
            else item.style.right = "0px";
        }
    }
    return (
        <UnorderedListOutlined onClick={handleClick}> </UnorderedListOutlined>
    );
}

const RightColumn = (props: any) => {
    const [open, setOpen] = useState(false);
    const [curTop, setCurTop] = useState<boolean>(props.session.isTop);
    const [curMute, setCurMute] = useState<boolean>(props.session.isMute);

    const handleMute = (isMute: boolean) => {
        setCurMute(isMute);
        request(
            "/api/session/setting",
            "PUT",
            JSON.stringify({
                userId: store.getState().userId,
                sessionId: props.session.sessionId,
                isMute: isMute,
                isTop: curTop
            })
        ).then((res: any) => props.setRefresh((refresh: any)=>!refresh)).catch((e: any) => {
            message.error("设置静音失败！");
        })
    }
    const handleTop = (isTop: boolean) => {
        setCurTop(isTop);
        request(
            "/api/session/setting",
            "PUT",
            JSON.stringify({
                userId: store.getState().userId,
                sessionId: props.session.sessionId,
                isMute: curMute,
                isTop: isTop
            })
        ).then((res: any) => props.setRefresh((refresh: any)=>!refresh)).catch((e: any) => {
            message.error("设置置顶失败！");
        })
    }

    const handleHistory = () => setOpen(true);
    const handleBoard = () => {};
    const handleMana = () => {};
    const handleInvite = () => {};

    return <div id="mySidenav" className={styles.sidenav}>
        {props.session.sessionType === 1 ? "" : (<div>群成员<br/></div>)}
        <UserList members={props.members}/>
        {props.session.sessionType === 1 ? <div></div> :
            <div>
            <Divider/>
            群名：{props.session.sessionName}
            <br /> <br/>
            <div onClick={handleBoard}>
            群公告
            <RightOutlined />
            </div>
            <br />
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
            </div>
        }
        <Divider />
        <div onClick={handleHistory}>
            消息记录
            <RightOutlined />
        </div>
        <Divider />
        设置静音<Switch onChange={handleMute} checked={curMute} />
        <br />
        设置置顶<Switch onChange={handleTop} checked={curTop} />
        <br />
        <ChatHistory open={open} setOpen={setOpen} members={props.members}
                     sessionId={props.session.sessionId} images={props.images}/>
    </div>
}

export default RightColumn;