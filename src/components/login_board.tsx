import ProForm from "@ant-design/pro-form";
import { useState } from 'react';
import { request} from "@/utils/network";
import { MailOutlined, LockOutlined, UserOutlined,} from '@ant-design/icons';
import { message, Tabs } from 'antd';
import { LoginForm, ProFormText, ProFormCaptcha, ProConfigProvider } from '@ant-design/pro-components';
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { isBrowser } from "@/utils/store";
import store from "@/utils/store";

type LoginType = 'email' | 'account';

export const LoginInput = ( props: any ) => {

    const form = props.form;

    // handle request to send verification code
    const handleVerification = async () => {
        if(!form.getFieldValue('email')) {
            message.error("请先输入邮箱！");
        }
        let m = form.getFieldsError(['email']);
        if (m[0].errors.length > 0) {
            message.error(m[0].errors[0]);
            return;
        }
        let response = await request(
            `/api/people/email/send/${form.getFieldValue('email')}`,
            "GET",
            ""
        );
        if (response.code === 0) message.success('验证码发送成功!');
        else message.error('验证码发送失败！');
    };

    const items = [
        {label: '账号密码', key: "account"},
        {label: '邮箱登陆', key: 'email'},
    ]

    return (
        <div>
            <Tabs
                centered
                activeKey={props.loginType}
                onChange={(activeKey) => props.setLoginType(activeKey as LoginType)}
                items={items}
            />
        {props.loginType === 'account' && (
        <>
            <ProFormText
                name="username"
                fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'用户名'}
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            />
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'密码'}
                rules={[
                    {
                        required: true,
                        message: '请输入密码！',
                    },
                ]}
            />
        </>
    )}
    {props.loginType === 'email' && (
        <>
            <ProFormText
                fieldProps={{
                    size: 'large',
                    prefix: <MailOutlined className={'prefixIcon'} />,
                }}
                name="email"
                placeholder={'邮箱'}
                rules={[
                    {
                        required: true,
                        message: '请输入邮箱！',
                    },
                ]}
            />
            <ProFormCaptcha
                fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                captchaProps={{
                    size: 'large',
                }}
                placeholder={'验证码'}
                captchaTextRender={(timing, count) => {
                    if (timing) {
                        return `${count} ${'获取验证码'}`;
                    }
                    return '获取验证码';
                }}
                name="captcha"
                rules={[
                    {
                        required: true,
                        message: '请输入验证码！',
                    },
                ]}
                onGetCaptcha={handleVerification}
            />
        </>
    )}
        </div>
);
}

const LoginBoard = () => {

    const socket:any = store.getState().webSocket;
    const [form] = ProForm.useForm();
    const [loginType, setLoginType] = useState<LoginType>('account');
    const [cookies, setCookie] = useCookies(['token', 'id']);
    const router = useRouter();

    if(isBrowser && socket)socket.addEventListener('user_auth', (event: any) => {console.log(event);})

    const initSocket = () => {
        if(isBrowser && socket) socket.send(JSON.stringify({
            'type': 'user_auth',
            'id': 1
        }));
    };

    const handleUserSubmit = async (e: any) => {
        const userInfo = {
            "userName": e.username,
            "password": e.password,
        };

        try {
            const response = await request(
                "/api/people/user",
                "POST",
                JSON.stringify(userInfo),
            );
            if(response.code !== 0) {
                message.error('用户名或密码错误！');
            } else {
                setCookie('token', response.token, {path: "/"});
                setCookie('id', response.id, {path: "/"});
                initSocket();
                await router.push('/chat');
            }
        } catch(err) {
            console.log(err);
        }

    };

    const handleEmailSubmit = async (e: any) => {

        const emailInfo = {
            "email": e.email,
            "veri_code": e.captcha as string,
        };

        try {
            const response = await request(
                "/api/people/email/verify",
                "POST",
                JSON.stringify(emailInfo),
            );
            if(response.code !== 0) {
                message.error('验证码错误！');
            } else {
                setCookie('token', response.token, {path: "/"});
                setCookie('id', response.id, {path: "/"});
                initSocket();
                await router.push('/chat');
            }
        } catch(err) {
            console.log(err);
        }
    };

    const routerRegister = <div style={{float: "right", fontSize: "14px"}}>
        没有账号？
        <a onClick={()=>router.push('/register')}>注册一个！</a>
    </div>;

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: 'white' }}>
                <LoginForm
                    title="YouChat"
                    subTitle="你都对，你来说"
                    actions={routerRegister}
                    form={form}
                    onFinish={loginType==='email'?handleEmailSubmit:handleUserSubmit}
                >
                    <LoginInput form={form} loginType={loginType} setLoginType={setLoginType}/>
                </LoginForm>
            </div>
        </ProConfigProvider>
    )
}

export default LoginBoard;
