import { useEffect, useRef, useState } from "react";
import SingleMessage from "@/components/chat/single_message";
import styles from "@/styles/chat.module.css"
import { isBrowser } from "@/utils/store";
import { store } from "@/utils/store";
import Linkify from "react-linkify";
import { MenuProps, Modal } from 'antd';
import { Avatar, Dropdown, Image, message, Skeleton, Spin, Tooltip } from 'antd';
import { MenuShow } from "@/components/chat/right_column/right_column";
import { request } from "@/utils/network";
import RightColumn from "@/components/chat/right_column/right_column";
import moment from "moment";
import { AudioPlayer } from "@/components/chat/single_message/audio";
import { FileViewer } from "@/components/chat/single_message/file";
import { MultiPicker } from "@/components/chat/single_message/history";
import MultiChat from "@/components/chat/single_message/history";

const left_items: MenuProps['items'] = [
    {
        key: '1',
        label: (<div>回复</div>),
    },
    {
        key: '2',
        label: (<div>翻译</div>),
    },
    {
        key: '3',
        label: (<div>语⾳转⽂字</div>),
    },
    {
        key: '4',
        label: (<div>多选</div>)
    },
    {
        key: '5',
        label: (<div>删除</div>)
    },
];

const right_items: MenuProps['items'] = [
    {
        key: '0',
        label: (<div>撤回</div>),
    },
    {
        key: '1',
        label: (<div>回复</div>),
    },
    {
        key: '2',
        label: (<div>翻译</div>),
    },
    {
        key: '3',
        label: (<div>语⾳转⽂字</div>),
    },
    {
        key: '4',
        label: (<div>多选</div>)
    },
    {
        key: '5',
        label: (<div>删除</div>)
    },
];

const left_reply_items: MenuProps['items'] = [
    {
        key: '-1',
        label: (<div>出处</div>),
    },
    {
        key: '1',
        label: (<div>回复</div>),
    },
    {
        key: '2',
        label: (<div>翻译</div>),
    },
    {
        key: '3',
        label: (<div>语⾳转⽂字</div>),
    },
    {
        key: '4',
        label: (<div>多选</div>)
    },
    {
        key: '5',
        label: (<div>删除</div>)
    },
];

const right_reply_items: MenuProps['items'] = [
    {
        key: '-1',
        label: (<div>出处</div>),
    },
    {
        key: '0',
        label: (<div>撤回</div>),
    },
    {
        key: '1',
        label: (<div>回复</div>),
    },
    {
        key: '2',
        label: (<div>翻译</div>),
    },
    {
        key: '3',
        label: (<div>语⾳转⽂字</div>),
    },
    {
        key: '4',
        label: (<div>多选</div>)
    },
    {
        key: '5',
        label: (<div>删除</div>)
    },
];

const ChatBoard = (props: any) => {

    const [messages, setMessages] = useState<any>([]);
    const [members, setMembers] = useState<any>([]);
    const [height, setHeight] = useState(0);
    const [iload, setIload] = useState(false);
    const [mload, setMload] = useState(false);
    const [memload, setMemload] = useState(false);
    const [newinfo, setNewinfo] = useState(false);
    const [newmsg, setNewmsg] = useState(false);
    const [newpull, setNewpull] = useState(false);
    const [count, setCount] = useState(0);
    const [role, setRole] = useState(2);
    const [reply, setReply] = useState(-1);
    const [getReply, setGetReply] = useState(-1);
    const [text, setText] = useState("");
    const [translated, setTranslated] = useState("");
    const [audio, setAudio] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
    const [isPickerOpen, setPickerOpen] = useState(false);
    const [isMultiChat, setMultiChat] = useState(false);
    const [multiSource, setMultiSource] = useState();

    const id = store.getState().userId;
    const sessionId = useRef(props.session.sessionId);

    const getRightItems = (reply_status: any, timestamp: number) => {
        if(reply_status === -1 || reply_status === undefined) {
            if ((Date.now() - timestamp <= 120000 || props.session.sessionType === 2 && (role === 0 || role === 1))) return right_items;
            else return left_items;
        } else {
            if ((Date.now() - timestamp <= 120000 || props.session.sessionType === 2 && (role === 0 || role === 1))) return right_reply_items;
            else return left_reply_items;
        }
    }

    const getLeftItems = (reply_status: any, timestamp: number, senderId: number) => {
        if (reply_status === -1 || reply_status === undefined)  {
            if(
                props.session.sessionType === 2 &&
                ( role === 0
                    || (role === 1
                        && members.filter((member: any) => member.id === senderId)[0]?.role !== 0
                        && members.filter((member: any) => member.id === senderId)[0]?.role !== 1)
                )
            ) {
                return right_items;
            } else {
                return left_items;
            }
        } else  {
            if(
                props.session.sessionType === 2 &&
                ( role === 0
                    || (role === 1
                        && members.filter((member: any) => member.id === senderId)[0]?.role !== 0
                        && members.filter((member: any) => member.id === senderId)[0]?.role !== 1)
                )
            ) {
                return right_reply_items;
            } else {
                return left_reply_items;
            }
        }
    }


    const handleMulti = (item: any) => {
        return (e: any) => {
            setMultiChat(true);
            setMultiSource(JSON.parse(item.message));
        }
    };

    const showModal = () => { setIsModalOpen(true); };
    const handleOk = () => { setIsModalOpen(false); };
    const handleCancel = () => { setIsModalOpen(false); };
    const handleAudioOk = () => { setIsAudioModalOpen(false); };
    const handleAudioCancel = () => { setIsAudioModalOpen(false); };

    const onDropDownClick: any = (messageId: any, ms: any, timestamp: any,  replyId: number, info: string) => {
        return ({ key }: any) => {
            if (key === '-1') {
                setGetReply(replyId);
            }
            else if (key === '0') {
                if (messageId !== -1) {
                    const socket: any = store.getState().webSocket;
                    socket.send(JSON.stringify(
                        {
                            type: "delete",
                            id: store.getState().userId,
                            messageId: messageId,
                            role: role
                        })
                    );
                } else {
                    message.error("服务器繁忙，请稍后撤回！");
                }
            }
            else if (key == '1') {
                setReply(messageId);
                setText(
                    "回复 " +
                    info +
                    "\n" +
                    ms.trim().split("\n").map((line: any) => "    " + line).join("\n") +
                    "\n"
                )
            }
            else if (key === '2') {
                // console.log(message);
                request("api/session/message/translate", "PUT",
                    JSON.stringify({
                        "language": "English",
                        "text": ms
                    })
                ).then((res: any) => {
                    // console.log(res);
                    setTranslated(res.text);
                    setIsModalOpen(true);
                });
            } else if (key === '3') {
                request("api/session/message/transaudio", "PUT",
                    JSON.stringify({
                        "audio": ms
                    })
                ).then((res: any) => {
                    // console.log(res);
                    setAudio(res.text);
                    setIsAudioModalOpen(true);
                });
            } else if (key === '4') {
                setPickerOpen(true);
            }
            else if (key === '5') {
                if(Date.now() - timestamp > 120000) {
                    message.error("撤回时间太长啦！");
                } else {
                    request("api/session/delete", "PUT",
                        JSON.stringify({
                            "userId": store.getState().userId,
                            "messageId": messageId
                        })
                    ).then((res: any) => {
                        setMessages((_messages: any) => _messages.filter((_message: any) => _message.messageId !== messageId));
                    });
                }
            }
        };
    };

    const handleDelete = (res: any) => {
        res = JSON.parse(res.data);
        if (res.type === 'delete') {
            if (res.code === 0) {
                setMessages((_messages: any) => [...(_messages.filter((_message: any) => _message.messageId !== res.messageId))]);
            } else if (res.code === 1) {
                message.error("User Not Existed");
            } else if (res.code === 2) {
                message.error("Message Not Existed");
            } else if (res.code === 3) {
                message.error("不是对应用户！");
            } else {
                message.error("超出时间限制！");
            }
        }
    }

    const getPull = (timestamp: any) => {
        const socket: any = store.getState().webSocket;
        socket.send(JSON.stringify({
            type: "pull",
            id: store.getState().userId,
            sessionId: props.session.sessionId,
            messageScale: 30,
            timestamp: timestamp
        })
        );
    };

    const handleSend = (res: any) => {
        res = JSON.parse(res.data);
        if (res.type === 'send' && res.sessionId === props.session.sessionId) {
            const socket: any = store.getState().webSocket;
            socket.send(JSON.stringify({
                type: "pull",
                id: store.getState().userId,
                sessionId: props.session.sessionId,
                messageScale: 0,
                timestamp: 0,
            })
            );
            if (res.senderId === store.getState().userId) {
                setNewmsg(true);
                setMessages((messages: any) => messages.map((message: any) => {
                    return message.messageId === -1 && message.timestamp === res.timestamp
                        ?
                        {
                            message: message.message,
                            renderedMessage: message.message,
                            messageId: res.messageId,
                            messageType: message.messageType,
                            senderId: message.senderId,
                            senderName: message.senderName,
                            timestamp: message.timestamp,
                            reply: res.reply,
                        }
                        : message;
                }))
            } else {
                setMessages((messages: any) => {
                    return [...messages, {
                        message: res.message,
                        renderedMessage: res.message,
                        messageId: res.messageId,
                        messageType: res.messageType,
                        senderId: res.senderId,
                        senderName: res.senderName,
                        timestamp: res.timestamp,
                        reply: res.reply,
                    }]
                })
            }
        }
    };

    useEffect(() => {
        if( messages.length !== 0 ) {
            store.dispatch(
                { type: 'addMessage',
                        message: {key: props.session.sessionId, value: messages}
                });
        }
    }, [messages]);

    const handlePull = (res: any) => {
        res = JSON.parse(res.data);

        if (res.type === 'pull' && res.sessionId === props.session.sessionId) {
            setMload(true);
            for (let i = 0; i < res.messages.length; ++i) {
                res.messages[i].renderedMessage = res.messages[i].message;
            }
            setMessages((messages: any) => [...res.messages.reverse(), ...messages]);
        }
    };

    const scroll = () => {
        const board: any = document.getElementById('board');
        if (board.scrollTop === 0) {
            setHeight(board.scrollHeight);
            if (!newpull) setCount(count => count + 1);
            setNewpull(true);
            setNewinfo(true);
        }
    };

    const randerMssage = (message_: string, pos: string, timestamp: any) => {
        if (!memload) return (<div>{message_}</div>);
        let result: any = [];
        let buffer: string = "";
        for (let i = 0; i < message_.length; ++i) {
            let found = false;
            if (i + 1 < message_.length && message_[i] === '@' && message_[i + 1] === '[') {
                let j = i + 2;
                while (j < message_.length && message_[j] !== ']') ++j;
                if (j < message_.length && message_[j] === ']') {
                    const name = message_.substring(i + 2, j);
                    if (j + 1 < message_.length && message_[j + 1] === '(') {
                        let k = j + 2;
                        while (k < message_.length && message_[k] !== ')') ++k;
                        if (k < message_.length && message_[k] === ')') {
                            const id_ = message_.substring(j + 2 + 5, k);
                            result.push(
                                <Linkify key={i}>
                                    {buffer}
                                </Linkify>
                            );
                            result.push(
                                <Tooltip title={
                                    id_ === "-2"
                                    ? <div>全体成员</div>
                                    : <div>
                                        <Avatar src={
                                            store.getState().imgMap.hasOwnProperty(parseInt(id_))
                                                ? "/headshot/01.svg"
                                                : store.getState().imgMap[parseInt(id_)]
                                        } />
                                            &nbsp;&nbsp;
                                            {name}
                                        </div>
                                }
                                    trigger="hover"
                                    overlayInnerStyle={{ color: "rgb(50,50,50)" }}
                                    color="rgba(255,255,255,0.75)"
                                >
                                    <div style={{
                                        display: "inline-block",
                                        color: (pos === "left" ? "rgb(225,75,125)" : "rgb(255, 200, 220")
                                    }}>
                                        {name}
                                        {
                                            members.filter((member: any) => member.id.toString() === id_).length !== 0 &&
                                                members.filter((member: any) => member.id.toString() === id_)[0].readTime < timestamp
                                                    ? " (未读)" : ""
                                        }
                                    </div>
                                </Tooltip>
                            );
                            i = k;
                            found = true;
                            buffer = "";
                        };
                    }
                }
            }
            if (!found) buffer = buffer + message_[i];
        }
        result.push(
            <Linkify key={message_.length}>
                {buffer}
            </Linkify>
        );
        return (
            <div>
                {result}
            </div>
        )
    };

    useEffect(() => {
        sessionId.current = props.session.sessionId;
    }, [props.session.sessionId]);

    useEffect(() => {
        if (newpull && messages.length >= (count - 1) * 30) {
            getPull(messages[0].timestamp - 1);
            setNewpull(false);
        }
    }, [messages, newpull]);

    useEffect(() => {
        if (mload && (messages.length <= 30 || newmsg)) {
            const element: any = document.getElementById("THEEND");
            if(element){
                element.scrollIntoView();
            } else {
                console.log('Element with id THEEND not found');
            }
            setNewmsg(false);
        }
    }, [messages, mload, newmsg]);

    useEffect(() => {
        const element: any = document.getElementById("THEEND");
        if(element){
            element.scrollIntoView();
        } else {
            console.log('Element with id THEEND not found');
        }
    }, [props.session.sessionId]);

    useEffect(() => {
        if (newinfo) {
            const board: any = document.getElementById('board');
            board.scrollTo(0, board.scrollHeight - height);
            setNewinfo(false);
        }
    }, [messages]);

    useEffect(() => {
        for (let i = 0; i < members.length; ++i) {
            if(!iload) {
                if(!store.getState().imgMap.hasOwnProperty(members[i].id)) {
                    request("api/people/img/" + members[i].id, "GET", "").then((r: any) => {
                        store.dispatch({type: "addImage", data: {key: members[i].id, value: r.img}});
                    }).then(() => {});
                }
            }
        }
    }, [members]);

    useEffect(() => {
        setCount(1);
        setNewinfo(false);
        setNewpull(false);
        setMload(false);
        setIload(false);
        setMemload(false);
        if(store.getState().members.hasOwnProperty(props.session.sessionId)) {
            setMembers(store.getState().members[props.session.sessionId]);
            setMemload(true);
        } else {
            request("/api/session/chatroom?id=" + props.session.sessionId, "GET", "")
                .then((res: any) => {
                    store.dispatch({type: "addMember", members: {key: props.session.sessionId, value: res.members}});
                    setMembers(res.members);
                    setMemload(true);
                    setRole(res.members.filter((member: any) => member.id === store.getState().userId)[0].role);
                });
        }
    }, [props.session.sessionId]);

    useEffect(() => {
        if (members.length !== 0) {
            let isTrue = true;
            for (let i = 0; i < members.length; ++i)
                if (store.getState().imgMap.hasOwnProperty(members[i].id)) isTrue = false;
            if (isTrue) setIload(true);
        }
    }, [store.getState().imgMap, props.session.sessionId]);

    useEffect(() => {
        setMessages((_: any) => []);
        const socket: any = store.getState().webSocket;
        if (isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handleSend);
            socket.addEventListener("message", handlePull);
            socket.addEventListener("message", handleDelete);
            if(!store.getState().message.hasOwnProperty(props.session.sessionId)) {
                getPull(Date.now());
            } else {
                setMload(true);
                setMessages(store.getState().message[props.session.sessionId]);
            }
        }
        return () => {
            socket.removeEventListener('message', handleSend);
            socket.removeEventListener('message', handlePull);
            socket.removeEventListener('message', handleDelete);
        };
    }, [props.session.sessionId, store.getState().webSocket]);

    useEffect(() => {
        const board = document.getElementById('board');
        if (mload && board) board.addEventListener('scroll', scroll);
        return () => {
            if (board) board.removeEventListener('scroll', scroll);
        }
    }, [props.session.sessionId, mload]);

    useEffect(() => {
        setInterval(() => {
            request("/api/session/chatroom?id=" + sessionId.current, "GET", "")
                .then((res: any) => {
                    if(res.sessionId === sessionId.current.toString()) {
                        setMembers(res.members);
                    }
                });
            request(
                `api/session/message/${id}`,
                "POST",
                JSON.stringify({
                    sessionId: sessionId.current,
                    readTime: Date.now()
                })
            );
        }, 10000);
    }, []);

    useEffect(() => {
        if (getReply !== -1) {
            console.log(getReply);
            console.log(messages);
            if (messages.filter((message: any) => message.messageId === getReply).length === 0) {
                const board: any = document.getElementById('board');
                board.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
            else {
                const message: any = document.getElementById(getReply.toString());
                console.log(message);
                message.scrollIntoView({ behavior: "smooth" });
                setGetReply(-1);
            }
        }
    }, [getReply, messages]);

    useEffect(() => {
        for (let i = 0; i < messages.length; ++i) {
            messages[i].renderedMessage = randerMssage(
                messages[i].message,
                messages[i].senderId === store.getState().userId ? "right" : "left",
                messages[i].timestamp
            );
        }
    }, [messages, members, memload]);

    return mload && memload
        ?
        (
            <div className={styles.container}>
                <div className={styles.title_bar}>
                    {props.session.sessionName}
                </div>
                <div className={styles.menu_show}>
                    <MenuShow />
                </div>
                <div id="board" className={styles.display_board} >
                    {messages.map((message: any, index: any) =>
                        message.senderId === store.getState().userId ? (
                            <div className={styles.message} key={index + 1} id={message.messageId}>
                                <div className={styles.headshot_right}>
                                    <Avatar src={
                                        !store.getState().imgMap.hasOwnProperty(message.senderId)
                                            ?
                                            "/headshot/01.svg"
                                            :
                                            store.getState().imgMap[message.senderId]
                                    } />
                                </div>
                                <Tooltip title={
                                    (message.senderName ?  message.senderName : "Myself") + " " +
                                    moment(message.timestamp).format("MM/DD HH:mm:ss")
                                } trigger="hover"
                                    arrow={false} placement="topRight" color="rgba(100,100,100,0.5)">
                                    <Dropdown menu={{
                                        items: getRightItems(message.reply, message.timestamp),
                                        onClick: onDropDownClick(message.messageId, message.message, message.timestamp, message.reply,
                                            message.senderName + " " + moment(message.timestamp).format("MM/DD HH:mm:ss"))
                                    }}
                                        placement="bottomLeft" trigger={['contextMenu']}>
                                        {
                                            message.messageType === "text"
                                                ?
                                                <div className={styles.message_right}>
                                                    {message.renderedMessage}
                                                </div>
                                                :
                                                message.messageType === "notice"
                                                    ?
                                                    <div className={styles.message_right}>
                                                        {"群公告\n" + message.message}
                                                    </div>
                                                    :
                                                    message.messageType === "photo"
                                                        ?
                                                        <div className={styles.photo_right}>
                                                            <Image src={message.message} />
                                                        </div>
                                                        :
                                                        message.messageType === "audio"
                                                            ?
                                                            <div className={styles.photo_right}>
                                                                <AudioPlayer base64Audio={message.message} />
                                                            </div>
                                                            :
                                                            message.messageType === "file"
                                                                ?
                                                                <div className={styles.photo_right}>
                                                                    <FileViewer base={message.message} />
                                                                </div>
                                                                :
                                                                message.messageType === "history"
                                                                    ?
                                                                    <div className={styles.message_right} onClick={handleMulti(message)}>
                                                                        [转发消息]
                                                                    </div>
                                                                    :
                                                                    <div>

                                                                    </div>
                                        }
                                    </Dropdown>
                                </Tooltip>
                                <Tooltip title={
                                    members
                                        .filter((member: any) => member.readTime < message.timestamp)
                                        .map((member: any, index: any) => (
                                            <div key={index}>
                                                <Avatar src={
                                                    !store.getState().imgMap.hasOwnProperty(member.id)
                                                        ?
                                                        "/headshot/01.svg"
                                                        :
                                                        store.getState().imgMap[member.id]
                                                } />
                                                &nbsp;&nbsp;
                                                {member.nickname}
                                                <br />
                                            </div>
                                        ))
                                } trigger="hover" overlayInnerStyle={{ color: "rgb(50,50,50)" }}
                                    arrow={false} placement="bottomRight" color="rgba(255,255,255,0.5)">
                                    <div className={styles.read_right}>
                                        {
                                            members.filter((member: any) => member.readTime < message.timestamp).length
                                        }
                                        /
                                        {
                                            members.length
                                        }
                                        &thinsp;未读
                                    </div>
                                </Tooltip>
                            </div>
                        ) : (
                            <div className={styles.message} key={index + 1} id={message.messageId}>
                                <div className={styles.headshot_left}>
                                    <Avatar src={
                                        !store.getState().imgMap.hasOwnProperty(message.senderId)
                                            ?
                                            "/headshot/01.svg"
                                            :
                                            store.getState().imgMap[message.senderId]
                                    } />
                                </div>
                                <Tooltip title={
                                    message.senderName + " " +
                                    moment(message.timestamp).format("MM/DD HH:mm:ss")
                                } trigger="hover"
                                    arrow={false} placement="topLeft" color="rgba(100,100,100,0.5)">
                                    <Dropdown menu={{
                                        items: getLeftItems(message.reply, message.timestamp, message.senderId),
                                        onClick: onDropDownClick(message.messageId, message.message, message.timestamp, message.reply,
                                            message.senderName + " " + moment(message.timestamp).format("MM/DD HH:mm:ss"))
                                    }}
                                        placement="bottomLeft" trigger={['contextMenu']}>
                                        {
                                            message.messageType === "text"
                                                ?
                                                <div className={styles.message_left}>
                                                    {message.renderedMessage}
                                                </div>
                                                :
                                                message.messageType === "notice"
                                                    ?
                                                    <div className={styles.message_left}>
                                                        {"群公告\n" + message.message}
                                                    </div>
                                                    :
                                                    message.messageType === "photo"
                                                        ?
                                                        <div className={styles.photo_left}>
                                                            <Image src={message.message} />
                                                        </div>
                                                        :
                                                        message.messageType === "audio"
                                                            ?
                                                            <div className={styles.photo_left}>
                                                                <AudioPlayer base64Audio={message.message} />
                                                            </div>
                                                            :
                                                            message.messageType === "file"
                                                                ?
                                                                <div className={styles.photo_left}>
                                                                    <FileViewer base={message.message} />
                                                                </div>
                                                                :
                                                                message.messageType === "history"
                                                                    ?
                                                                    <div className={styles.message_left} onClick={handleMulti(message)}>
                                                                        [转发消息]
                                                                    </div>
                                                                    :
                                                                    <div>

                                                                    </div>
                                        }
                                    </Dropdown>
                                </Tooltip>
                                <Tooltip title={
                                    members
                                        .filter((member: any) => member.readTime < message.timestamp)
                                        .map((member: any, index: any) => (
                                            <div key={index}>
                                                <Avatar src={
                                                    !store.getState().imgMap.hasOwnProperty(member.id)
                                                        ?
                                                        "/headshot/01.svg"
                                                        :
                                                        store.getState().imgMap[member.id]
                                                } />
                                                &nbsp;&nbsp;
                                                {member.nickname}
                                                <br />
                                            </div>
                                        ))
                                } trigger="hover" overlayInnerStyle={{ color: "rgb(50,50,50)" }}
                                    arrow={false} placement="bottomLeft" color="rgba(255,255,255,0.5)">
                                    <div className={styles.read_left}>
                                        {
                                            members.filter((member: any) => member.readTime < message.timestamp).length
                                        }
                                        /
                                        {
                                            members.length
                                        }
                                        &thinsp;未读
                                    </div>
                                </Tooltip>
                            </div>
                        ))}
                    <div id="THEEND" />
                </div>
                <SingleMessage sessionId={props.session.sessionId} setMessages={setMessages}
                    members={members} reply={reply} text={text} setText={setText} />
                <RightColumn session={props.session} members={members} messages={messages} images={store.getState().imgMap} setRefresh={props.setRefresh}
                    setSession={props.setSession} setMessages={setMessages} role={role} setMembers={setMembers} setRole={setRole} />
                <Modal title="翻译结果" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelButtonProps={{style: {display: 'none'}}}>
                    <p>{translated}</p>
                </Modal>
                <Modal title="转文字结果" open={isAudioModalOpen} onOk={handleAudioOk} onCancel={handleAudioCancel} cancelButtonProps={{style: {display: 'none'}}}>
                    <p>{audio}</p>
                </Modal>
                <MultiPicker sessionId={props.session.sessionId} members={members} setMessages={setMessages} messages={messages}
                    images={store.getState().imgMap} setOpen={setPickerOpen} open={isPickerOpen} list={props.list} />
                <MultiChat open={isMultiChat} setOpen={setMultiChat} messages={multiSource} />
            </div>
        )
        :
        (
            <Skeleton />
        )
};

export default ChatBoard;
