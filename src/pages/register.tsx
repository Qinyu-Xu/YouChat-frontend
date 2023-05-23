import { useState } from "react";
import { request } from "@/utils/network";
import styles from '@/styles/register.module.css';
import { message, Form, Button, Input, Typography } from "antd";
import { useRouter } from "next/router";
import {readSvgAsBase64, encryptParam} from "@/utils/utilities";

const { Title } = Typography;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

function Register() {
    const [form] = Form.useForm();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [initialPwd, setInitialPwd] = useState("");
    const [confirmedPwd, setConfirmedPwd] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const userInfo = {
            email: email,
            userName: username,
            nickname: nickname,
            password: encryptParam(initialPwd),
        }

        try {
            const response = await request(
                "/api/people/user",
                "PUT",
                JSON.stringify(userInfo),
            );
            if(response.code === 0) {
                message.success('成功注册！');
                await request("api/people/img/"+response.id, "PUT", {
                    img: await readSvgAsBase64(`/headshot/1.svg`),
                })
                await router.push('/login');
            } else {
                message.error(response.info);
            }
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.register}>
            <Title level={2}>Register</Title>
            <br/>
            <Form
                {...formItemLayout}
                form={form}
                name="Register"
                style={{ maxWidth: 600 }}
                scrollToFirstError
                >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                    {
                        max: 40,
                        message: 'Too long!',
                    },
                    ]}
                >
                    <Input 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    {
                        min: 5,
                        message: 'Too short!',
                    },
                    {
                        max: 20,
                        message: 'Too long!',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password
                        onChange={(e) => setInitialPwd(e.target.value)}
                        value={initialPwd}
                    />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Pwd"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { 
                            required: true, 
                            message: 'Please input your username!', 
                            whitespace: true 
                        },
                        {
                            min: 5,
                            message: 'Too short!',
                        },
                        {
                            max: 20,
                            message: 'Too long!',
                        },
                    ]}
                >
                    <Input 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </Form.Item>
                <Form.Item
                    name="nickname"
                    label="Nickname"
                    tooltip="What do you want others to call you?"
                    rules={[
                        { 
                            required: true, 
                            message: 'Please input your nickname!', 
                            whitespace: true 
                        },
                        {
                            min: 1,
                            message: 'Too short!',
                        },
                        {
                            max: 10,
                            message: 'Too long!',
                        },
                    ]}
                >
                    <Input 
                        onChange={(e) => setNickname(e.target.value)}
                        value={nickname}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;