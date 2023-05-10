import styles from "@/styles/right.module.css";
import {Divider, message, Switch, Modal} from "antd";
import {useState} from "react";
import {request} from "@/utils/network";
import {store} from "@/utils/store";
import {RightOutlined, UnorderedListOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import ChatHistory from "@/components/chat/right_column/chat_history";
import Notice from "@/components/chat/right_column/notice";
import UserList from "@/components/chat/right_column/user_list";
import AddMember from "@/components/chat/right_column/member";
import Manager from "@/components/chat/right_column/manager";
import { useRouter } from "next/router";

const { confirm } = Modal;

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
    const [openHistory, setOpenHistory] = useState(false);
    const [openNotice, setOpenNotice] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openInvite, setOpenInvite] = useState(false);
    const [openMana, setOpenMana] = useState(false);
    const [curTop, setCurTop] = useState<boolean>(props.session.isTop);
    const [curMute, setCurMute] = useState<boolean>(props.session.isMute);

    const router = useRouter();

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

    const handleHistory = () => setOpenHistory(true);
    const handleBoard = () => setOpenNotice(true);
    const handleMana = () => {};
    const handleInvite = () => setOpenInvite(true);

    const handleDropout = () => {
        confirm({
          title: '你确定要退出群聊吗？',
          icon: <ExclamationCircleFilled />,
          content: '该操作不可恢复。',
          onOk() {
            request(
                "/api/session/chatroom",
                "DELETE",
                JSON.stringify({
                    userId: store.getState().userId,
                    sessionId: props.session.sessionId,
                })
            ).then((res: any) => {
                props.setRefresh((refresh: any)=>!refresh);
                props.setSession(null);
            }).catch((e: any) => {
                message.error("退出群聊失败!");
            })
          },
          onCancel() {},
        });
      };

    return <div id="mySidenav" className={styles.sidenav}>
        <div className={styles.top}>
            {props.session.sessionType === 1 ? "" : (<div className={styles.title}>群成员</div>)}
            <div className={styles.add_button}>
                <img src="/ui/add.svg"
                    onClick={(e)=>{
                        setOpenAdd(true);
                    }}
                />
            </div>
        </div>
        <UserList members={props.members} images={props.images}/>
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
            {props.role > 1 ? <div></div> :
                <div onClick={handleInvite}>
                管理群成员
                <RightOutlined />
                </div>
            }
            {props.role > 1 ? <div></div> : <div><br/></div>}
            {props.role > 0 ? <div></div> :
                <div onClick={handleMana}>
                设置管理员
                <RightOutlined />
                </div>
            }
            {props.role > 0 ? <div></div> : <div><br/></div>}
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
        <Divider />
        <div className={styles.drop} onClick={handleDropout}>
            退出群聊
        </div>
        <br />
        <ChatHistory open={openHistory} setOpen={setOpenHistory} members={props.members} messages={props.messages}
                     sessionId={props.session.sessionId} images={props.images}/>
        <Notice open={openNotice} setOpen={setOpenNotice} members={props.members} messages={props.messages}
                     sessionId={props.session.sessionId} images={props.images} setMessages={props.setMessages} role={props.role}/>
        <AddMember open={openAdd} setOpen={setOpenAdd} members={props.members} sessionId={props.session.sessionId}/>
        <Manager open={openInvite} setOpen={setOpenInvite} members={props.members}
                     sessionId={props.session.sessionId} images={props.images} setMessages={props.setMessages} role={props.role} setSession={props.setSession}/>
    </div>
}

export default RightColumn;