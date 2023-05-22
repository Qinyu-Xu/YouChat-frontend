import Sidebar from "@/components/sidebar";
import UserSetting from "@/components/settings/user_setting";
import Profile from "@/components/settings/profile";
import styles from '@/styles/layout.module.css'
import {ReceiverBoard} from "@/components/chat/single_message/video_chat";
import {useState} from "react";

const Settings = () => {
    const [refresh, setRefresh] = useState(false);
    return (
        <div className={styles.container}>
            <Sidebar type={"settings"}/>
            <div className={styles.content}>
                <Profile refresh={refresh}/>
            </div>
            <div className={styles.content}>
                <UserSetting setRefresh={setRefresh}/>
            </div>
            <ReceiverBoard />
        </div>
    )
};


export default Settings;