import {request} from "@/utils/network";
import {useState} from "react";
import {Button, Divider, Input, Modal, Space, Tabs} from "antd";
import {useRouter} from "next/router";

import styles from "@/components/chat/settings.module.css";
import ProForm from "@ant-design/pro-form";
import {ProFormCaptcha, ProFormText} from "@ant-design/pro-components";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import LoginBoard, {LoginInput} from "@/components/login_board";

const LogOut = () => {

    const router = useRouter();
    const handleLogOut = () => {
        alert('成功登出！')
        router.push('/login');
    }

    return (
        <div>
            <p>Your Account</p>
            <Button onClick={handleLogOut}>LogOut</Button>
        </div>
    );
};

const SecondAuthentication = (props) => {

    const [open, setOpen] = useState(false);
    const [loginType, setLoginType] = useState('email');
    const [form] = ProForm.useForm();

    const router = useRouter();
    const handleAuth = () => {
        setOpen(true);
    };
    const handleOk = () => {
        if (loginType === 'email') {
            const code = form.getFieldValue('captcha');

        } else {
            const user = form.getFieldValue('username');
            const pwd = form.getFieldValue('password');
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };


    return (
        <div>
            <div className={styles.modifyContainer}>验证身份以修改你的个人信息</div>
            <br />
            <Button onClick={handleAuth}>验证身份</Button>
            <Modal title="验证你的身份" open={open} onOk={handleOk} onCancel={handleCancel}>
                <ProForm form={form} submitter={{resetButtonProps: {style: {display: 'none'}}, submitButtonProps: {style: {display: 'none'}}}} >
                    <LoginInput form={form} loginType={loginType} setLoginType={setLoginType}/>
                </ProForm>
            </Modal>
        </div>
    );
};

const EditProfile = (props) => {

    const handleCancel = (e) => {
        props.setAuth(false);
    };

    return (
        <div>
            <p>Edit Your Profile</p>
            <Space direction="vertical" size="middle">
                <Space.Compact style={{ width: 500 }}>
                    <Input placeholder="修改你的用户名" />
                    <Button type="primary">Submit</Button>
                </Space.Compact >
                <Space.Compact style={{ width: 500 }}>
                    <Input placeholder="修改你的密码" />
                    <Button type="primary">Submit</Button>
                </Space.Compact >
                <Space.Compact style={{ width: '100%' }}>
                    <Input placeholder="修改你的邮箱" />
                    <Button type="primary">Submit</Button>
                </Space.Compact>

            <Button onClick={handleCancel}>结束更改</Button>
            </Space>
        </div>
    );
}

const Settings = () => {


    const [isAuthenticated, setAuthentication] = useState(false);

    return (

            <div>
                <LogOut />
                <Divider />
                {isAuthenticated
                    ? <EditProfile setAuth={setAuthentication}/>
                    : <SecondAuthentication setAuth={setAuthentication} />}
            </div>

    );
}

export default Settings;