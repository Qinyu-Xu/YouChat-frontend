import {useEffect, useRef, useState} from "react";
import SingleMessage from "@/components/chat/single_message";
import styles from "@/styles/chat.module.css"
import { isBrowser } from "@/utils/store";
import { store } from "@/utils/store";
import Linkify from "react-linkify";
import { MenuProps, Modal } from 'antd';
import {Avatar, Dropdown, Image, message, Skeleton, Spin, Tooltip} from 'antd';
import {MenuShow} from "@/components/chat/right_column/right_column";
import {request} from "@/utils/network";
import RightColumn from "@/components/chat/right_column/right_column";
import moment from "moment";
import {AudioPlayer} from "@/components/chat/single_message/audio";
import {FileViewer} from "@/components/chat/single_message/file";

const left_items: MenuProps['items'] = [
    {
      key: '1',
      label: (<text>回复</text>),
    },
    {
      key: '2',
      label: (<text>翻译</text>),
    },
    {
      key: '3',
      label: (<text>语⾳转⽂字</text>),
    },
];

const right_items: MenuProps['items'] = [
    {
      key: '0',
      label: (<text>撤回</text>),
    },
    {
      key: '1',
      label: (<text>回复</text>),
    },
    {
      key: '2',
      label: (<text>翻译</text>),
    },
    {
      key: '3',
      label: (<text>语⾳转⽂字</text>),
    },
];

const ChatBoard = (props: any) => {

    const [messages, setMessages] = useState<any>([]);
    const [members, setMembers] = useState<any>([]);
    const [images, setImages] = useState<any>([]);
    const [height, setHeight] = useState(0);
    const [iload, setIload] = useState(false);
    const [mload, setMload] = useState(false);
    const [newinfo, setNewinfo] = useState(false);
    const [newmsg, setNewmsg] = useState(false);
    const [newpull, setNewpull] = useState(false);
    const [count, setCount] = useState(0);
    const [role, setRole] = useState(2);
    const [bRefresh, setBRefresh] = useState(0);

    const [translated, setTranslated] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => { setIsModalOpen(true); };
    const handleOk = () => { setIsModalOpen(false); };
    const handleCancel = () => { setIsModalOpen(false); };

    const onDropDownClick: any = (messageId: any, message: any) => {
        return ({key}: any) => {
            if(key === '0') {
                if(messageId !== -1) {
                    const socket: any = store.getState().webSocket;
                    socket.send(JSON.stringify(
                        {
                            type: "delete",
                            id: store.getState().userId,
                            messageId: messageId
                        })
                    );
                } else {
                    message.error("服务器繁忙，请稍后撤回！");
                }
            }
            if(key === '2') {
                // console.log(message);
                request("api/session/message/translate", "PUT",
                    JSON.stringify({ 
                        "language": "English",
	                    "text": message
                    })
                ).then((res: any) => {
                    // console.log(res);
                    setTranslated(res.text);
                    setIsModalOpen(true);
                });
            }
        };
    };

    const handleDelete = (res: any) => {
        res = eval("(" + res.data + ")");
        const is_exist = () => {
            return messages.filter((message: any) => message.messageId !== res.messageId).length !== 0;
        }
        if (res.type === 'delete' && is_exist()) {
            if(res.code === 0) {
                setMessages((messages: any) => messages.filter((message: any) => message.messageId !== res.messageId));
            } else if(res.code === 1) {
                message.error("User Not Existed");
            } else if(res.code === 2) {
                message.error("Message Not Existed");
            } else if(res.code === 3) {
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
        res = eval("(" + res.data + ")");
        if (res.type === 'send' && res.sessionId === props.session.sessionId) {
            if(res.senderId === store.getState().userId) {
                setNewmsg(true);
                setMessages((messages: any) => messages.map((message: any) => {
                    return message.messageId === -1 && message.timestamp === res.timestamp
                        ?
                        {
                            message: message.message,
                            messageId: res.messageId,
                            messageType: message.messageType,
                            senderId: message.senderId,
                            senderName: message.senderName,
                            timestamp: message.timestamp
                        }
                        : message;
                }))
            } else {
                setMessages((messages: any) => {
                    return [...messages, {
                        message: res.message,
                        messageId: res.messageId,
                        messageType: res.messageType,
                        senderId: res.senderId,
                        senderName: res.senderName,
                        timestamp: res.timestamp
                    }]
                })
            }
        }
    };

    const handlePull = (res: any) => {
        res = eval("(" + res.data + ")");
        if ( res.type === 'pull' ) {
            setMload(true);
            setMessages((messages: any) => [...res.messages.reverse(), ...messages]);
        }
    };

    const scroll = () => {
        const board: any = document.getElementById('board');
        if(board.scrollTop === 0) {
            setHeight(board.scrollHeight);
            if(!newpull) setCount(count=>count+1);
            setNewpull(true);
            setNewinfo(true);
        }
    }

    useEffect(()=>{
        if(newpull && messages.length >= (count-1)*30) {
            getPull(messages[0].timestamp-1);
            setNewpull(false);
        }
    }, [messages, newpull]);

    useEffect(() => {
        if(iload && mload && (messages.length <= 30 || newmsg)) {
            document
                ?.getElementById("THEEND")
                ?.scrollIntoView();
            setNewmsg(false);
        }
    }, [messages, iload, mload, newmsg]);

    useEffect(() => {
        if(newinfo) {
            const board: any =document.getElementById('board');
            board.scrollTo(0, board.scrollHeight - height);
            setNewinfo(false);
        }
    }, [messages]);


    useEffect(() => {
        for (let i = 0; i < members.length; ++i) {
            request("api/people/img/" + members[i].id, "GET", "").then((r: any) => {
                if(images.every((image: any) => image.id !== members[i].id)) {
                    setImages((images: any) => [...images, {id: members[i].id, image: r.img}]);
                }}).then(() => {});
        }
    }, [members]);

    useEffect(() => {
        setCount(1);
        setNewinfo(false);
        setNewpull(false);
        setMload(false);
        setIload(false);
        request("/api/session/chatroom?id="+props.session.sessionId, "GET", "").then((res: any) => {setMembers(res.members);setRole(res.members.filter((member: any) => member.id === store.getState().userId)[0].role);});
    }, [props.session.sessionId]);

    useEffect(() => {
        if(members.length !== 0) {
            let isTrue = true;
            for (let i = 0; i < members.length; ++i)
                if (images.every((image: any) => image.id !== members[i].id)) isTrue = false;
            if (isTrue) setIload(true);
        }
    }, [images, props.session.sessionId]);

    useEffect(() => {
        setMessages(( _ : any) => []);
        const socket: any = store.getState().webSocket;
        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handleSend);
            socket.addEventListener("message", handlePull);
            socket.addEventListener("message", handleDelete);
            getPull(Date.now());
        }
        return () => {
            socket.removeEventListener('message', handleSend);
            socket.removeEventListener('message', handlePull);
            socket.removeEventListener('message', handleDelete);
        };
    }, [props.session.sessionId, store.getState().webSocket]);

    useEffect( () => {
        const board = document.getElementById('board');
        if(mload && iload && board) board.addEventListener('scroll', scroll);
        return () => {
            if(board) board.removeEventListener('scroll', scroll);
        }
    }, [props.session.sessionId, mload, iload]);

    return iload && mload
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
                        <div className={styles.message} key={index+1} id={index+1}>
                            <div className={styles.headshot_right}>
                                <Avatar src={
                                    images.filter( (image: any) => image.id === message.senderId)[0] === undefined
                                        ?
                                        "/headshot/01.svg"
                                        :
                                        images.filter( (image: any) => image.id === message.senderId)[0].image
                                } />
                            </div>
                            <Tooltip title={
                                message.senderName + " " +
                                moment(message.timestamp).format("MM/DD HH:mm:ss")
                            } trigger="hover"
                                arrow={false} placement="topRight" color="rgba(100,100,100,0.5)">
                                <Dropdown menu={{ items: right_items, onClick: onDropDownClick(message.messageId, message.message) }} placement="bottomLeft" trigger={['contextMenu']}>
                                    {
                                        message.messageType === "text"
                                        ?
                                        <div className={styles.message_right}>
                                            <Linkify>{message.message}</Linkify>
                                        </div>
                                        :
                                        message.messageType === "notice"
                                        ?
                                        <div className={styles.message_right}>
                                            <Linkify>{"群公告\n" + message.message}</Linkify>
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
                                            <FileViewer base={message.message}/>
                                        </div>
                                        :
                                        <div>

                                        </div>

                                    }
                                </Dropdown>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className={styles.message} key={index+1} id={index+1}>
                            <div className={styles.headshot_left}>
                                <Avatar src={
                                    images.filter( (image: any) => image.id === message.senderId)[0] === undefined
                                        ?
                                        "/headshot/01.svg"
                                        :
                                        images.filter( (image: any) => image.id === message.senderId)[0].image
                                } />
                            </div>
                            <Tooltip title={
                                message.senderName + " " +
                                moment(message.timestamp).format("MM/DD HH:mm:ss")
                            } trigger="hover"
                                arrow={false} placement="topLeft" color="rgba(100,100,100,0.5)">
                                <Dropdown menu={{ items: left_items, onClick: onDropDownClick(message.messageId, message.message) }} placement="bottomLeft"  trigger={['contextMenu']}>
                                    {
                                        message.messageType === "text"
                                        ?
                                        <div className={styles.message_left}>
                                        <Linkify>{message.message}</Linkify>
                                        </div>
                                            :
                                            message.messageType === "notice"
                                            ?
                                            <div className={styles.message_left}>
                                                <Linkify>{"群公告\n" + message.message}</Linkify>
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
                                        <FileViewer base={message.message}/>
                                        </div>
                                        :
                                        <div>

                                        </div>
                                    }
                                </Dropdown>
                            </Tooltip>
                        </div>
                ))}
                <div id="THEEND"/>
            </div>
            <SingleMessage sessionId={props.session.sessionId} setMessages={setMessages}/>
            <RightColumn session={props.session} members={members}  messages={messages} images={images} setRefresh={props.setRefresh} setSession={props.setSession} setMessages={setMessages} role={role} setBRefresh={setBRefresh}/>
            <Modal title="翻译结果" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{translated}</p>
            </Modal>
        </div>
        )
        :
        (
            <Skeleton />
        )
};

export default ChatBoard;
