import {useEffect, useState} from "react";
import ProForm from "@ant-design/pro-form";
import {useRouter} from "next/router";
import {Button, message, Modal} from "antd";
import {request} from "@/utils/network";
import LoginInput from "@/components/login/login_input";
import {store} from "@/utils/store";
import {refreshReducer} from "next/dist/client/components/router-reducer/reducers/refresh-reducer";
import {encryptParam} from "@/utils/utilities";

const SecondAuthentication = (props: any) => {
    const [open, setOpen] = useState(false);
    const [loginType, setLoginType] = useState('account');
    const [form] = ProForm.useForm();
    const router = useRouter();

    const [refresh, setRefresh] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();

    useEffect(() => {
        if( props.place !== "login" ) {
            request("/api/people/profile/"+store.getState().userId, "GET", "").then((res) => {
                setName(res.profile.username);
                setEmail(res.profile.email);
            });
        }
    }, []);

    const initial_value = {
        'username': name,
        'email': email,
        'captcha': '',
        'password': '',
    }
    useEffect(() => {
        if(name !== undefined && email != undefined) {
            setRefresh(true);
        }
    }, [name, email]);

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
                    "veri_code": veri_code as string,
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
                    "password": encryptParam(pwd),
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
                    "password": encryptParam(pwd),
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
                {
                    !refresh
                        ?
                        <div></div>
                        :
                    <ProForm form={form} initialValues={initial_value} submitter={{
                        resetButtonProps: {style: {display: 'none'}},
                        submitButtonProps: {style: {display: 'none'}}
                    }}>
                        <LoginInput form={form} loginType={loginType} setLoginType={setLoginType} place={"delete"}/>
                    </ProForm>
                }
            </Modal>
        </div>
    );
};

export default SecondAuthentication;