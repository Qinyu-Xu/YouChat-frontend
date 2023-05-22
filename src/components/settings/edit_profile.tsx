import {useCookies} from "react-cookie";
import {useRef, useState} from "react";
import {request} from "@/utils/network";
import {Button, Input, message, Space} from "antd";
import {store} from "@/utils/store";
import {encryptParam} from "@/utils/utilities";

const EditProfile = (props: any) => {

    const [cookie, setCookie] = useCookies(['token']);
    const code = useRef(0);
    const [user, setUser] = useState(null);
    const [pwd, setPwd] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const handleCancel = (e: any) => {
        props.setAuth(false);
    };

    const handleClick = async (e: any) => {
        let new_val = undefined;
        let username = null;

        const profile = await request(
            `api/people/profile/${store.getState().userId}`,
            "GET",
            ""
        );
        if(profile.id===0) {
            message.error("Error!");
            return;
        } else {
            username = profile.profile.username;
        }

        if (code.current === 1) {
            new_val = user;
        } else if (code.current === 2) {
            new_val = pwd;
        } else if (code.current === 4) {
            new_val = email;
        } else if (code.current == 5) {
            new_val = phone;
        }
        const response = await request(
            "/api/people/modify",
            "PUT",
            JSON.stringify({
                "userName": username,
                "code": code.current,
                "new": code.current === 2 ? encryptParam( new_val ) : new_val,
            })
        )
        if (response.code === 0) {
            props.setRefresh((refresh: any) => !refresh);
            message.success('修改成功！');
        } else {
            message.error('修改失败！');
        }
    }

    return (
        <div>
            <p>Edit Your Profile</p>
            <Space direction="vertical" size="middle">
                <Space.Compact style={{ width: 500 }}>
                    <Input placeholder="修改你的用户名" onChange={(e: any)=>setUser(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=1; handleClick(e)}}>Submit</Button>
                </Space.Compact >
                <Space.Compact style={{ width: 500 }}>
                    <Input placeholder="修改你的密码" onChange={(e: any)=>setPwd(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=2; handleClick(e)}}>Submit</Button>
                </Space.Compact >
                <Space.Compact style={{ width: '100%' }}>
                    <Input placeholder="修改你的邮箱" onChange={(e: any)=>setEmail(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=4; handleClick(e)}}>Submit</Button>
                </Space.Compact>
                <Space.Compact style={{ width: '100%' }}>
                    <Input placeholder="修改你的手机号" onChange={(e: any)=>setPhone(e.target.value)}/>
                    <Button type="primary" onClick={(e) => {code.current=5; handleClick(e)}}>Submit</Button>
                </Space.Compact>

                <Button onClick={handleCancel}>结束更改</Button>
            </Space>
        </div>
    );
};

export default EditProfile;