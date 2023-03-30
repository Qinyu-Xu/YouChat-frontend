import { request } from "@/utils/network";
import { useRef, useState } from "react";
import { Button, Divider, Input, message, Modal, Space } from "antd";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

import styles from "@/styles/layout.module.css";
import ProForm from "@ant-design/pro-form";
import { LoginInput } from "@/components/login_board";

const LogOut = () => {

    const router = useRouter();
    const [cookie, , removeCookie] = useCookies(['token', 'id']);
    const handleLogOut = () => {
        removeCookie('id', {path: "/"});
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

const SecondAuthentication = (props: any) => {

    const [open, setOpen] = useState(false);
    const [loginType, setLoginType] = useState('account');
    const [form] = ProForm.useForm();
    const router = useRouter();

    const handleAuth = () => {
        setOpen(true);
    };

    const handleOk = async (e: any) => {
        if (loginType === 'email') {
            const email = form.getFieldValue('email');
            const veri_code = form.getFieldValue('captcha');
            if( email === "" || veri_code === "" ) {
                message.error('请输入完整的信息！');
                return;
            }
            const response = await request(
                "api/people/modify/email",
                "POST",
                JSON.stringify({
                    "email": email,
                    "veri_code": veri_code,
                })
            );
            if (response.code == 0) {
                message.success('二次验证成功！')
                setOpen(false);
                props.setAuth(true);
            } else {
                message.error('二次验证失败！');
            }
        } else {
            const user = form.getFieldValue('username');
            const pwd = form.getFieldValue('password');
            if( user === "" || pwd === "" ) {
                message.error('请输入完整的信息！');
                return;
            }
            const response = await request(
                "/api/people/modify",
                "POST",
                JSON.stringify({
                    "userName": user,
                    "password": pwd,
                })
            );
            if (response.code == 0) {
                message.success('二次验证成功！')
                setOpen(false);
                props.setAuth(true);
            } else {
                message.error('二次验证失败！');
            }
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        if(loginType=='email') {
            message.error("使用邮箱验证码删除用户功能暂未开放");
        } else {
            const user = form.getFieldValue('username');
            const pwd = form.getFieldValue('password');
            if (user === "" || pwd === "") {
                message.error('请输入完整的信息！');
                return;
            }
            const response = await request(
                "/api/people/user",
                "DELETE",
                JSON.stringify({
                    "userName": user,
                    "password": pwd,
                })
            );
            if (response.code == 0) {
                message.success('删除用户成功！');
                setOpen(false);
                await router.push('/login');
            } else {
                message.error('删除用户失败...');
            }
        }
    };

    return (
        <div>
            <div>{props.type==="modify"?"验证身份以修改你的个人信息":"验证身份以删除用户"}</div>
            <br />
            <Button onClick={handleAuth}>验证身份</Button>
            <Modal title="验证你的身份" open={open} onOk={props.type==="modify"?handleOk:handleDelete} onCancel={handleCancel}>
                <ProForm form={form} submitter={{resetButtonProps: {style: {display: 'none'}}, submitButtonProps: {style: {display: 'none'}}}} >
                    <LoginInput form={form} loginType={loginType} setLoginType={setLoginType}/>
                </ProForm>
            </Modal>
        </div>
    );
};

const EditProfile = (props: any) => {

    const [cookie, setCookie] = useCookies(['token', 'id']);
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
        let username = null;

        const profile = await request(
            `api/people/profile/${cookie.id}`,
            "GET",
            ""
        );
        if(profile.id===0) {
            message.error("Error!");
            return;
        } else {
            username = profile.profile.username;
        }

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
            "/api/people/modify",
            "PUT",
            JSON.stringify({
                "userName": username,
                "code": code.current,
                "new": new_val
            })
        )
        if (response.code === 0) {
            message.success('修改成功！');
        } else {
            message.error('修改失败！');
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
};

const DeleteUser = () => {
    return (
        <div>
            <SecondAuthentication type={"delete"}/>
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
                    : <SecondAuthentication setAuth={setAuthentication} type={"modify"} />}
                <Divider />
                 <DeleteUser />
            </div>

    );
}

export default Setting;