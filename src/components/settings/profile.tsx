import styles from "@/components/settings/setting.module.css";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { request } from "@/utils/network";
import { Button, Image, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {store} from "@/utils/store";

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

    const [response, setResponse] = useState(null);

    useEffect(() => {
        request("api/people/profile/" + store.getState().userId, "GET", "").then(res => {
            if(res.code === 0) { setResponse(res);}
            else { message.error("获取用户信息错误！").then(r => "error"); }
        })}, []
    );

    return (
        <div className={styles.profile}>
            { response === null
                ?
                (<div>
                    Loading...
                </div>)
                :
                (<div>
                    UserName : {response.profile.username}
                    <br />
                    NickName: {response.profile.nickname}
                    <br />
                    Your Email: {response.profile.email}
                </div>)
            }
            <br />

            <ImageUpload />
        </div>
    );
};

export default Profile;