import styles from "@/components/settings/setting.module.css";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { request } from "@/utils/network";
import { Button, Image, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const customUpload = async (options) => {
    const { onSuccess, onError, file } = options;

    try {
        const base64 = await fileToBase64(file);
        const response = await request("api/session/img", "PUT", {
            "img": base64,
        });
        onSuccess();
    } catch (error) {
        console.error('Upload failed:', error);
        onError(error);
    }
};

const beforeUpload = (file) => {
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

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImgUrl(url);
            });
        }
    };

    useEffect(() => {
        request("api/people/profile"+user_id, "GET", "").then(res => {
            if(res.code === 0) { response = res; }
            else { message.error("获取用户信息错误！").then(r => "error"); }
        })}, []
    );

    return (
        <div className={styles.profile}>
            <text></text>
        </div>
    );
};

export default Profile;