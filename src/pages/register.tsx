import { useState } from "react";
import { request } from "@/utils/network";
import styles from '@/styles/register.module.css';
import { message } from "antd";
import { useRouter } from "next/router";

function Register() {

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
            password: initialPwd,
        }

        try {
            const response = await request(
                "/api/people/user",
                "PUT",
                JSON.stringify(userInfo),
            );
            if(response.code === 0) {
                message.success('成功注册！');
                router.push('/login');
            } else {
                message.error(response.info);
            }
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <main className={styles.register}>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <br/>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    required
                />
                <br/>
                <label htmlFor="nickname">Nickname:</label>
                <input
                    type="text"
                    id="nickname"
                    onChange={(e) => setNickname(e.target.value)}
                    value={nickname}
                    required
                />
                <br/>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setInitialPwd(e.target.value)}
                    value={initialPwd}
                    required
                />
                <br/>
                <button>Submit</button>
            </form>
        </main>
    );
};

export default Register;