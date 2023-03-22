import {request} from "@/utils/network";
import {useState} from "react";
import {Button, Divider} from "antd";
import {useRouter} from "next/router";
import {router} from "next/client";

const LogOut = () => {

    const handleLogOut = () => {

    }

    return (
        <div>
            <p>Your Account</p>
            <Button onClick={handleLogOut}>LogOut</Button>
        </div>
    );
};

const SecondAuthentication = (props) => {

    const handleAuth = () => {

    };

    return (
        <div>
            <Button onClick={handleAuth}>修改你的个人信息</Button>
        </div>
    );
};

const EditProfile = () => {
    const handleSubmit = (e) => {
        request(
            "",
            "GET",
            ""
        ).then(() => {

        });
    };

    

    return (
        <div>
            <p>Edit Your Profile</p>
            <label htmlFor="userName">New Use Name:</label>
            <br/>
            <input
                type="text"
                id="userName"
                autoComplete="off"
            />
            <button>Submit</button>
            <br />
            <label htmlFor="email">New Email:</label>
            <br />
            <input
                type="text"
                id="email"
                autoComplete="off"
            />
            <button>Submit</button>
            <br />
            <label htmlFor="password">New Password:</label>
            <br />
            <input
                type="password"
                id="password"
            />
            <button>Submit</button>
            <br />
        </div>
    );
}

const Settings = () => {


    const [isAuthenticated, setAuthentication] = useState(false);


    return (

            <div>
                <LogOut />
                <Divider />
                {isAuthenticated
                    ? <EditProfile />
                    : <SecondAuthentication setAuth={setAuthentication} />}
            </div>

    );
}

export default Settings;