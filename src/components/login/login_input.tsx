import {message, Tabs} from "antd";
import {request} from "@/utils/network";
import {ProFormCaptcha, ProFormText} from "@ant-design/pro-components";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";

type LoginType = 'email' | 'account';

const LoginInput = ( props: any ) => {

    const items = [
        {label: '账号密码', key: "account"},
        {label: '邮箱登陆', key: 'email', disabled: props.place === "setting"},
    ]


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
                        disabled={props.place!=="login"}
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
                        disabled={props.place!=="login"}
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

export default LoginInput;