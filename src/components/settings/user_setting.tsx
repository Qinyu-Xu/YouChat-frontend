import { useState } from "react";
import { Button, Divider, Input, message, Modal, Space } from "antd";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import SecondAuthentication from "@/components/settings/second_authentication";
import EditProfile from "@/components/settings/edit_profile";

const LogOut = () => {
    const router = useRouter();
    const [cookie, , removeCookie] = useCookies(['token']);
    const handleLogOut = () => {
        removeCookie('token', {path: "/"});
        message.success('成功登出！');
        router.push('/login');
    }
    return (
        <div>
            <p>当前的账号是：</p>
            <Button onClick={handleLogOut}>登出</Button>
        </div>
    );
};

const DeleteUser = () => {
    return (
        <div>
            <SecondAuthentication type={"delete"}/>
        </div>
    );
};

const UserSetting = () => {

    const [isAuthenticated, setAuthentication] = useState(false);

    return (
        <div>
                <LogOut />
                <Divider />
                {isAuthenticated
                    ? <EditProfile setAuth={setAuthentication}/>
                    : <SecondAuthentication setAuth={setAuthentication} type={"modify"} />}
                <Divider />
                <DeleteUser />
        </div>
    );
}

export default UserSetting;