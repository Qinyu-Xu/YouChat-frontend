import { useEffect, useState } from "react";
import { request } from "@/utils/network";
import {Avatar, Button, Image, message, Skeleton, Spin, Upload} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { store } from "@/utils/store";
import styles  from "@/styles/profile.module.css";
import {avatarToBase64} from "@/utils/utilities";

const ImageUpload = (props: any) => {

    const customUpload = async (options: any) => {
        const { onSuccess, onError, file } = options;
        try {
            const base64 = await avatarToBase64(file);
            const response = await request(`api/people/img/${store.getState().userId}`, "PUT", {
                "img": base64,
            });
            if(response.code === 0)
                props.setImage(base64);
            onSuccess();
        } catch (error) {
            message.error('Upload failed');
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

    return (
        <Upload
            accept="image/*"
            beforeUpload={beforeUpload}
            customRequest={customUpload}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined />} >Upload Image</Button>
        </Upload>
    )
}

const Profile = () => {

    const [response, setResponse] = useState<any>(null);
    const [image, setImage] = useState<any>('/headshot/01.svg');
    const [pload, setPload] = useState(false);
    const [iload, setIload] = useState(false);

    useEffect(() => {
        request("api/people/profile/" + store.getState().userId, "GET", "").then(res => {
            if(res.code === 0) {
                setResponse(res);
                setPload(true);
            }  else {
                message.error("获取用户信息错误！").then(r => "error");
            }
        })
        }, []
    );

    useEffect(() => {
        request("api/people/img/"+store.getState().userId, "GET", "").then(res => {
            if(res.code === 0) {
                setImage(res.img);
                setIload(true);
            }
        })
    }, []);

    return iload && pload
        ?
        (
        <div className={styles.profile}>
            <Avatar size={300} src={image} />
            <br /><br />
            <ImageUpload setImage={setImage}/>
            <br/>

                <div>
                    Nickname: {response.profile.nickname}
                    <br />
                    Username: {response.profile.username}
                    <br />
                    Email: {response.profile.email}
                </div>

            <br />
        </div>
        )
        :
        (
        <div className={styles.profile}>
            <Spin />
        </div>
        )
        ;
};

export default Profile;