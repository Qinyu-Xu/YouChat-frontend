import { request } from "@/utils/network";
import { useRef, useState } from "react";
import { Button, Divider, Input, message, Modal, Space } from "antd";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

import styles from "@/styles/layout.module.css";
import ProForm from "@ant-design/pro-form";
import {LoginInput} from "@/components/login_board";

const LogOut = () => {

    const router = useRouter();
    const [cookie, , removeCookie] = useCookies(['token']);
    const handleLogOut = () => {
        removeCookie('token', {path: "/"});
        message.success('成功登出！')
        router.push('/login');
    }

    return (
        <div>
            <p>Your Account</p>
            <Button onClick={handleLogOut}>LogOut</Button>
        </div>
    );
};

const SecondAuthentication = (props: any) => {

    const [open, setOpen] = useState(false);
    const [loginType, setLoginType] = useState('email');
    const [form] = ProForm.useForm();

    const handleAuth = () => {
        setOpen(true);
    };
    const handleOk = async () => {
        props.setAuth(true);

        /*if (loginType === 'email') {

        } else {
            const user = form.getFieldValue('username');
            const pwd = form.getFieldValue('password');
            const response = await request(
                "/people/modify",
                "POST",
                JSON.stringify({
                    userName: user,
                    password: pwd,
                })
            );
            if (response.code == 200) {
                setOpen(true);
            } else {
                message.error(response.info);
            }
        }*/
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

const EditProfile = (props: any) => {

    const code = useRef(0);
    const [user, setUser] = useState(null);
    const [pwd, setPwd] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const handleCancel = (e: any) => {
        props.setAuth(false);
    };

    const handleClick = async (e: any) => {
        let new_val = undefined;

        if (code.current === 1) {
            new_val = user;
        } else if (code.current === 2) {
            new_val = pwd;
        } else if (code.current === 4) {
            new_val = email;
        } else if (code.current == 5) {
            new_val = phone;
        }
        const response = await request(
            "/people/modify",
            "PUT",
            JSON.stringify({
                code: code,
                new: new_val
            })
        )
        if (response.code === 200) {
            message.success('successfully change your profile!');
        } else {
            message.error(response.info);
        }
    }

    return (
        <div>
            <p>Edit Your Profile</p>
            <Space direction="vertical" size="middle">
                <Space.Compact style={{ width: 500 }}>
                    <Input placeholder="修改你的用户名" onChange={(e: any)=>setUser(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=1; handleClick(e)}}>Submit</Button>
                </Space.Compact >
                <Space.Compact style={{ width: 500 }}>
                    <Input placeholder="修改你的密码" onChange={(e: any)=>setPwd(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=2; handleClick(e)}}>Submit</Button>
                </Space.Compact >
                <Space.Compact style={{ width: '100%' }}>
                    <Input placeholder="修改你的邮箱" onChange={(e: any)=>setEmail(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=4; handleClick(e)}}>Submit</Button>
                </Space.Compact>
                <Space.Compact style={{ width: '100%' }}>
                    <Input placeholder="修改你的手机号" onChange={(e: any)=>setPhone(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=5; handleClick(e)}}>Submit</Button>
                </Space.Compact>

            <Button onClick={handleCancel}>结束更改</Button>
            </Space>
        </div>
    );
}

const Setting = () => {


    const [isAuthenticated, setAuthentication] = useState(false);

    return (

            <div className={styles.content}>
                <LogOut />
                <Divider />
                {isAuthenticated
                    ? <EditProfile setAuth={setAuthentication}/>
                    : <SecondAuthentication setAuth={setAuthentication} />}
            </div>

    );
}

export default Setting;