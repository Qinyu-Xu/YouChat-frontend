import styles from "@/components/settings/setting.module.css";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { request } from "@/utils/network";
import { Image, message } from "antd";

const Profile = () => {
    const [cookie, setCookie] = useCookies(['id']);
    const user_id = cookie.id;
    let response;
    useEffect(() => {
        request("api/people/profile"+user_id, "GET", "").then(res => {
            if(res.code === 0) { response = res; }
            else { message.error("获取用户信息错误！").then(r => "error"); }
        })}, []);

    return (
        <div className={styles.profile}>
            <Image src={`api/session/img/${user_id}`} />
            <text></text>
        </div>
    );
};

export default Profile;