import {useEffect, useState} from "react";
import { request } from "@/utils/network";
import {message, Modal, Spin} from "antd";
import { isBrowser } from "@/utils/store";
import {store} from "@/utils/store";
import MessageItem from "./message_item";
import ProForm from "@ant-design/pro-form";
import LoginInput from "@/components/login/login_input";
import {encryptParam} from "@/utils/utilities";

const SecondAuth = (props: any) => {
    const [form] = ProForm.useForm();
    const [loginType, setLoginType] = useState('account');

    const [name, setName] = useState<any>(undefined);
    const [email, setEmail] = useState<any>(undefined);
    const [refersh, setRefresh] = useState(false);

    useEffect(() => {
        if( props.place !== "login" ) {
            request("/api/people/profile/"+store.getState().userId, "GET", "").then((res) => {
                setName(res.profile.username);
                setEmail(res.profile.email);
            });
        }
    }, []);

    useEffect(() => {
        if(name !== undefined && email != undefined) {
            setRefresh(true);
        }
    }, [name, email]);

    const initial_value = {
        'username': name,
        'email': email,
        'captcha': '',
        'password': '',
    }

    const handleOk = async () => {
        if (loginType === 'email') {
            const email_ = form.getFieldValue('email');
            const veri_code = form.getFieldValue('captcha');
            if( email_ === "" || veri_code === "" ) {
                message.error('请输入完整的信息！');
                return;
            }
            const response = await request(
                "api/people/modify/email",
                "POST",
                JSON.stringify({
                    "email": email_,
                    "veri_code": veri_code as string,
                })
            );
            if (response.code == 0) {
                message.success('二次验证成功！');
                props.setOpen(false);
                props.setAuth(true);
                form.resetFields();
            } else {
                message.error('二次验证失败！');
            }
        } else {
            const user = form.getFieldValue('username');
            const pwd = form.getFieldValue('password');
            if( user === "" || pwd === "" ) {
                message.error('请输入完整的信息！');
                return;
            }
            const response = await request(
                "/api/people/modify",
                "POST",
                JSON.stringify({
                    "userName": user,
                    "password": encryptParam(pwd),
                })
            );
            if (response.code == 0) {
                message.success('二次验证成功！')
                props.setOpen(false);
                props.setAuth(true);
                form.resetFields();
            } else {
                message.error('二次验证失败！');
            }
        }
    };

    const handleCancel = () => {
        props.setOpen(false);
    };

    return (
        <Modal title="验证你的身份" open={props.open} onOk={handleOk} onCancel={handleCancel}>
            { !refersh ? <div></div> :
                <ProForm form={form} initialValues={initial_value} submitter={{
                    resetButtonProps: {style: {display: 'none'}},
                    submitButtonProps: {style: {display: 'none'}}
                }}>
                    <LoginInput form={form} loginType={loginType} setLoginType={setLoginType} place={"secret"}/>
                </ProForm>
            }
        </Modal>
    );
}

const LeftColumn = (props: any) => {

    const [load, setLoad] = useState(false);
    const [loadname, setLoadname] = useState(false);
    const [sorted, setSorted] = useState(false);
    const [open, setOpen] = useState(false);
    const [auth, setAuth] = useState(false);
    const [potential, setPotential] = useState<any>();
    const [id, setId] = useState(0);

    const handleNew = (res: any) => {
        res = JSON.parse(res.data);
        if(res.type === "new_session") {
            const is_exist = () => {
                return (props.list.filter((_message: any) => _message.sessionId === res.sessionId)).length !== 0;
            };
            if (!is_exist()) {
                refreshList();
                loadName();
            }
        }
    }

    const loadName = () => {
        let l : any[] = [];
        for (let i = 0; i < props.list.length; ++ i) {
            l.push(props.list[i]);
        }
        for(let i = 0; i < l.length; ++i) {
            if(l[i].sessionType === 1 && l[i].sessionName === "friend") {
                request(
                    "api/session/chatroom?id=" + l[i].sessionId,
                    "GET",
                    ""
                ).then((res: any) => {
                    l[i].sessionName =
                        (res.members.filter((member: any) =>
                                member.id !== store.getState().userId)
                        )[0].nickname;
                    // console.log("@@@@@@@@@@@");
                    // console.log(l);
                    props.setList(() => l.slice());
                })
            }
        }
    }

    useEffect(() => {
        const socket: any = store.getState().webSocket;
        socket.addEventListener("message", handleNew);
        return () => {
            socket.removeEventListener("message", handleNew);
        }
    }, []);

    const cmp = (a: any, b:any) => {
        if(a.isTop !== b.isTop) return - a.isTop + b.isTop;
        return - a.timestamp + b.timestamp;
    };

    const clearList = (sessionId: number) => {
        props.list.filter((msg: any) => msg.sessionId === sessionId)[0].unread = 0;
    }

    const handleClick = (session: any) => {
        return () => {
            if(session.isSecret) {
                setPotential(session);
                setAuth(false);
                setOpen(true);
            } else {
                setId(session.sessionId);
                props.setSession(session);
                clearList(session.sessionId);
            }
        }
    }

    useEffect(() => {
        if(auth) {
            setId(potential.sessionId);
            props.setSession(potential);
            clearList(potential.sessionId);
        }
    }, [auth]);

    const refreshList = () => {
        request(
            `api/session/message/${store.getState().userId}`,
            "GET",
            ""
        ).then((response) => {
            if (response.code === 0) {
                const new_list = response.data;
                let old_list: any[] = props.list;
                for (let i = 0; i < new_list.length; ++i) {
                    if (old_list.filter((msg: any) => msg.sessionId === new_list[i].sessionId).length !== 0) {
                        old_list = old_list.map((msg: any) => msg.sessionId !== new_list[i].sessionId
                            ? msg
                            :
                            {
                                "sessionId": msg.sessionId,
                                "sessionName": msg.sessionName,
                                "sessionType": msg.sessionType,
                                "timestamp": new_list[i].timestamp,
                                "type": new_list[i].type,
                                "lastSender": new_list[i].lastSender,
                                "message": new_list[i].message,
                                "isTop": new_list[i].isTop,
                                "isMute": new_list[i].isMute,
                                "isSecret": new_list[i].isSecret,
                                "unread": new_list[i].unread,
                            });
                    } else {
                        old_list.push(new_list[i]);
                    }
                }
                for (let i = 0; i < old_list.length; ++i) {
                    if (new_list.filter((msg: any) => msg.sessionId === old_list[i].sessionId).length === 0) {
                        old_list.splice(i, 1);
                        break;
                    }
                }
                old_list = old_list.sort(cmp);
                props.setList([...old_list]);
            } else {
                message.error("获取聊天列表发生错误！").then(_ => _);
            }
        });
    }

    useEffect(() => {
        if (!load) {
            request(
                `api/session/message/${store.getState().userId}`,
                "GET",
                ""
            ).then((response) => {
                if( response.code === 0 ) {
                    props.setList(() => [-1]);
                    props.setList(() => response.data);
                }
                else {
                    message.error("获取聊天列表发生错误！").then(_=>_);
                }
            });
        }
    }, [load]);

    useEffect(() => {
        // console.log(list);
        // console.log(load);
        // console.log(loadname);
        // console.log(sorted);
        if (!load) {
            if (props.list[0] != -1) {
                setLoad(true);
                loadName();
            }
        }
        else if (!loadname) {
            let isTrue = true;
            for(let i = 0; i < props.list.length; ++i) {
                if(props.list[i].sessionType === 1 && props.list[i].sessionName === "friend") {
                    isTrue = false;
                    // console.log("# " + i + "  " + list[i].sessionName);
                }
            }
            // console.log("^^^^" + isTrue);
            if (isTrue) {
                setLoadname(true);
                props.setList((list : any) => list.sort(cmp));
            }
        }
        else {
            let isTrue = true;
            for (let i = 0; i + 1 < props.list.length; ++ i) {
                // console.log(i + "  " + (cmp(list[i], list[i + 1])));
                if (cmp(props.list[i], props.list[i + 1]) > 0) {
                    isTrue = false;
                }
            }
            // console.log("!" + isTrue);
            if(isTrue) {
                setSorted(true);
            }
        }
    }, [props.list, load, loadname]);

    useEffect(() => {
        if(load && loadname && sorted) refreshList();
        // refreshList();
    }, [props.refresh]);

    useEffect(() => {
        const socket: any = store.getState().webSocket;

        const handleNewSend =  (res: any) => {
            const msg = JSON.parse(res.data);
            if (msg.type === 'send') {
                props.setList((list: any) => list.map((item: any) => item.sessionId !== msg.sessionId ? item : {
                    "sessionId": item.sessionId,
                    "sessionName": item.sessionName,
                    "sessionType": item.sessionType,
                    "timestamp": msg.timestamp,
                    "type": msg.messageType,
                    "lastSender": msg.SenderName,
                    "message": msg.message,
                    "isTop": item.isTop,
                    "isMute": item.isMute,
                    "isSecret": item.isSecret,
                    "unread": msg.senderId === store.getState().userId
                        ?
                        item.unread
                        : (
                            msg.sessionId !== id
                                ?
                                item.unread + 1 : item.unread)

                }));
                props.setList((list : any) => list.sort(cmp));
            }
        };

        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handleNewSend);
            return () => {
                socket.removeEventListener("message", handleNewSend);
            }
        }
    }, [id, loadname, sorted, store.getState().webSocket]);

    return load && loadname && sorted
        ?
        (
        <div>
            {
                props.list.map((session: any) => (
                    <div key={session.sessionId} onClick={handleClick(session)}>
                        <MessageItem session={session}/>
                    </div>
                ))
            }
            <SecondAuth open={open} setOpen={setOpen} setAuth={setAuth} />
        </div>
        )
        :
        <Spin />
        ;
};

export default LeftColumn;
