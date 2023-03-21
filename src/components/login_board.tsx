import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "@/utils/auth_provider";
import {formatParams} from "@/utils/utilities";
import {request} from "@/utils/network";
import styles from "@/components/login_board.module.css"

const LoginBoard = () => {

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef(null);
    const emailRef = useRef(null);
    const errRef = useRef(null);

    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [isEmail, setIsEmail] = useState(false);

    useEffect(() => {
        if(isEmail) {
            emailRef.current.focus();
        } else {
            userRef.current.focus();
        }
    }, [isEmail]);

    const handleUserSubmit = async (e) => {
        e.preventDefault();

        const userInfo = {
            username: e.username,
            password: e.password,
        };
        try {
            const response = await request(
                "/user?" + formatParams(userInfo),
                "GET",
                "",
            );

            const accessToken = response?.data?.token;
            setAuth({accessToken});
            setPwd('');
            setPwd('');
        } catch(err) {
            errRef.current.focus();
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        const userInfo = {
            email: e.email,
            password: e.password,
        };
        try {
            const response = await request(
                "/user?" + formatParams(userInfo),
                "GET",
                "",
            );

            const accessToken = response?.data?.token;
            setAuth({accessToken});
            setPwd('');
            setPwd('');
        } catch(err) {
            errRef.current.focus();
        }
    };

    return (
        <section>
            <p ref={errRef} className={errMsg ? styles.errmsg : styles.offscreen} aria-live="assertive">
                {errMsg}
            </p>
            <h1>Sign In</h1>
            { isEmail
                ?
                <form onSubmit={handleEmailSubmit}>
                    <label htmlFor="email">Email:</label>
                    <br/>
                    <input
                        type="text"
                        id="email"
                        ref={emailRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={email}
                        required
                    />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <br />
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <br />
                    <button>Submit</button>
                    <br />
                    <div>
                        <div>Do not have an account?</div>
                        <a href='#'>Sign Up</a>
                        <p onClick={()=>{setIsEmail(false);}}>Login with password</p>
                    </div>
                </form>
                :
                <form onSubmit={handleUserSubmit}>
                    <label htmlFor="username">UserName:</label>
                    <br/>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <br />
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <br />
                    <button>Submit</button>
                    <br />
                    <div>
                        <div>Do not have an account?</div>
                        <a href='#'>Sign Up</a>
                        <p onClick={()=>setIsEmail(true)}>Login with email</p>
                    </div>
                </form>
            }
        </section>
    )
}

export default LoginBoard;
