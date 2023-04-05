import Sidebar from "@/components/sidebar";
import UserSetting from "@/components/settings/user_setting";
import Profile from "@/components/settings/profile";

const Settings = () => {
    return (
        <div>
            <Sidebar />
            <Profile />
            <UserSetting />
        </div>
    )
};


export default Settings;