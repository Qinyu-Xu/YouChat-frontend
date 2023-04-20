import ProForm from "@ant-design/pro-form";
import { useState } from 'react';
import { request} from "@/utils/network";
import { message } from 'antd';
import { LoginForm, ProConfigProvider } from '@ant-design/pro-components';
import { useRouter } from "next/router";
import { isBrowser } from "@/utils/store";
import { store } from "@/utils/store";
import LoginInput from "@/components/login/login_input";

type LoginType = 'email' | 'account';

const LoginBoard = () => {
    const socket:any = store.getState().webSocket;
    const [form] = ProForm.useForm();
    const [loginType, setLoginType] = useState<LoginType>('account');
    const router = useRouter();

    const initSocket = () => {
        if(isBrowser && socket !== null) {
            socket.send(JSON.stringify({
                type: 'user_auth',
                id: store.getState().userId
            }));
        }
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
                store.dispatch({type: 'getId', data: response.id});
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
                store.dispatch({type: 'getId', data: response.id});
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
