import { useState, useContext } from "react";
import AuthContext from "@/utils/auth_provider";
import {request} from "@/utils/network";
import styles from '@/styles/register.module.css'

function Register() {

    const { setAuth } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [initialPwd, setInitialPwd] = useState("");
    const [confirmedPwd, setConfirmedPwd] = useState("");

    const handleSubmit = async (e: any) => {
        console.log(e.target);
        e.preventDefault();

        const userInfo = {
            email: email,
            userName: username,
            nickname: nickname,
            password: initialPwd,
        }

        try {
            const response = await request(
                "/people/user",
                "PUT",
                JSON.stringify(userInfo),
            );

            const accessToken = response?.data?.token;
            setAuth({accessToken});
        } catch(err) {

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