import Sidebar from "@/components/sidebar";
import UserSetting from "@/components/settings/user_setting";
import Profile from "@/components/settings/profile";
import styles from '@/styles/layout.module.css'
import {ReceiverBoard} from "@/components/chat/single_message/video_chat";

const Settings = () => {
    return (
        <div className={styles.container}>
            <Sidebar type={"settings"}/>
            <div className={styles.content}>
                <Profile />
            </div>
            <div className={styles.content}>
                <UserSetting />
            </div>
            <ReceiverBoard />
        </div>
    )
};


export default Settings;