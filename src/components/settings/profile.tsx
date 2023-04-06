import styles from "@/components/settings/setting.module.css";
import { useCookies } from "react-cookie";
import {useEffect, useState} from "react";
import { request } from "@/utils/network";
import { Image, message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const Profile = () => {
    const [cookie, setCookie] = useCookies(['id']);
    const [loading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState<string>();

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

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