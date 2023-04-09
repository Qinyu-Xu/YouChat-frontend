import styles from "@/components/settings/setting.module.css";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { request } from "@/utils/network";
import { Button, Image, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import store from "@/utils/store";

const fileToBase64 = (file: any) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const customUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;

    try {
        const base64 = await fileToBase64(file);
        const response = await request(`api/people/img/${store.getState().userId}`, "PUT", {
            "img": base64,
        });
        onSuccess();
    } catch (error) {
        console.error('Upload failed:', error);
        onError(error);
    }
};

const beforeUpload = (file:any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        message.error('You can only upload image files!');
    }
    return isImage;
};

const ImageUpload = () => {
    return (
        <Upload
            accept="image/*"
            beforeUpload={beforeUpload}
            customRequest={customUpload}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
    )
}

const Profile = () => {

    const [cookie, setCookie] = useCookies(['id']);
    const [loading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState<string>();
    const user_id = cookie.id;
    let response;

    useEffect(() => {
        request("api/people/profile"+user_id, "GET", "").then(res => {
            if(res.code === 0) { response = res; }
            else { message.error("获取用户信息错误！").then(r => "error"); }
        })}, []
    );

    return (
        <div className={styles.profile}>
            <ImageUpload />
        </div>
    );
};

export default Profile;