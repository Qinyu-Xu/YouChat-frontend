import { useState, useContext } from 'react';
import AuthContext from "@/utils/auth_provider";
import {formatParams} from "@/utils/utilities";
import {request} from "@/utils/network";
import { MailOutlined, LockOutlined, UserOutlined,} from '@ant-design/icons';
import { message, Tabs } from 'antd';
import ProForm from "@ant-design/pro-form";
import {LoginForm, ProFormText, ProFormCaptcha, ProConfigProvider} from '@ant-design/pro-components';

type LoginType = 'email' | 'account';

const LoginBoard = () => {

    const { setAuth } = useContext(AuthContext);
    const [loginType, setLoginType] = useState<LoginType>('email');
    const [form] = ProForm.useForm();

    const handleVerification = async (value) => {
        if (!form.getFieldValue('email')) {
            message.error('请先输入邮箱');
            return;
        }
        let m = form.getFieldsError(['email']);
        if (m[0].errors.length > 0) {
            message.error(m[0].errors[0]);
            return;
        }
        let response = await request(
            "people/email/send"+formatParams({email: value}),
            "GET",
            ""
        );
        if (response.code === 200) message.success('验证码发送成功!');
        else message.error(response.message);
    }

    const handleUserSubmit = async (e) => {

        const userInfo = {
            userName: e.username,
            password: e.password,
        };

        try {
            const response = await request(
                "/people/user?" + formatParams(userInfo),
                "GET",
                "",
            );

            const accessToken = response?.data?.token;
            setAuth({accessToken});

        } catch(err) {
            console.log(err);
        }
    };

    const handleEmailSubmit = async (e) => {

        try {
            const response = await request(
                "/people/email/verify?" + formatParams({token: e.captcha}),
                "GET",
                "",
            );
            const accessToken = response?.data?.token;
            setAuth({accessToken});
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: 'white' }}>
                <LoginForm
                    title="SwimChat"
                    subTitle="前端工程师爱划水"
                    actions={

                            <>
                            <div style={{float: "right", fontSize: "14px"}}>
                                没有账号？
                            <a>注册一个！</a>
                            </div>
                            </>
                    }
                    onFinish={loginType==='email'?handleEmailSubmit:handleUserSubmit}
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                        onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                    >
                        <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
                        <Tabs.TabPane key={'email'} tab={'邮箱登录'} />
                    </Tabs>

                    {loginType === 'account' && (
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
                    {loginType === 'email' && (
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
                </LoginForm>
            </div>
        </ProConfigProvider>
    )
}

export default LoginBoard;
