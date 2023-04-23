import styles from "@/styles/right.module.css";
import {Divider, message, Switch} from "antd";
import {request} from "@/utils/network";
import {store} from "@/utils/store";
import {RightOutlined} from "@ant-design/icons";

export const MenuShow = () => {
    const handleClick = () => {
        const item = document.getElementById("mySidenav");
        if(item.style.width ===  "20rem")  item.style.width = "0";
        else item.style.width = "20rem";

    }

    return (
        <div>
            <button onClick={handleClick}> </button>
        </div>
    );
}

const RightColumn = (props: any) => {
    const curTop = true;
    const curMute = false;
    const handleMute = (isMute: boolean) => {
        request(
            "session/setting",
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
            "session/setting",
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

    const handleHistory = () => {

    }

    return <div id="mySidenav" className={styles.sidenav}>
        <Divider />
        设置静音<Switch defaultChecked onChange={handleMute} />
        <br />
        设置置顶<Switch defaultChecked onChange={handleTop} />
        <br />
        <Divider />
        <div onClick={handleHistory}>
            消息记录
            <RightOutlined />
        </div>
        <Divider />
    </div>
}

export default RightColumn;