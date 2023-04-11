import Sidebar from "@/components/sidebar";
import UserSetting from "@/components/settings/user_setting";
import Profile from "@/components/settings/profile";
import styles from '@/styles/layout.module.css'

const Settings = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <Profile />
            <UserSetting />
        </div>
    )
};


export default Settings;