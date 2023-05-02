import {useEffect, useState} from "react";
import SingleMessage from "@/components/chat/single_message";
import styles from "@/styles/chat.module.css"
import { isBrowser } from "@/utils/store";
import { store } from "@/utils/store";
import Linkify from "react-linkify";
import type { MenuProps } from 'antd';
import {Avatar, Dropdown, Image, Skeleton, Spin, Tooltip} from 'antd';
import {MenuShow} from "@/components/chat/right_column/right_column";
import {request} from "@/utils/network";
import RightColumn from "@/components/chat/right_column/right_column";
import moment from "moment";
import {Simulate} from "react-dom/test-utils";

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

    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState<any>([]);
    const [images, setImages] = useState<any>([]);
    const [height, setHeight] = useState(0);
    const [iload, setIload] = useState(false);
    const [mload, setMload] = useState(false);
    const [newinfo, setNewinfo] = useState(false);

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
            setMessages((messages) => [...messages, ...res.messages.reverse()]);
            setMload(true);
        }
    };

    const scroll = () => {
        const board = document.getElementById('board');
        if(board.scrollTop === 0) {
            setHeight(board.scrollHeight);
            getPull(messages[messages.length-1].timestamp + 1);
            setNewinfo(true);
        }
    }

    useEffect(() => {
        if(iload && mload && messages.length <= 30) {
            document
                ?.getElementById("THEEND")
                ?.scrollIntoView();
        }
    }, [messages, iload, mload]);

    useEffect(() => {
        if(newinfo) {
            const board =document.getElementById('board');
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
        setMload(false);
        setIload(false);
        request("/api/session/chatroom?id="+props.session.sessionId, "GET", "").then((res: any) => {setMembers(res.members);});
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
            getPull(Date.now());
        }
        return () => {
            socket.removeEventListener('message', handleSend);
            socket.removeEventListener('message', handlePull);
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
                            <Tooltip title={moment(message.timestamp).format("HH:mm:ss")} trigger="click"
                                arrow={false} placement="topLeft" color="rgba(100,100,100,0.5)">
                                <Dropdown menu={{ items: right_items }} placement="bottomLeft" trigger={['contextMenu']}>
                                    {
                                        message.messageType === "text"
                                        ?
                                        <div className={styles.message_right}>
                                            <Linkify>{message.message}</Linkify>
                                        </div>
                                        :
                                        message.messageType === "photo"
                                        ?
                                        <div className={styles.photo_right}>
                                            <Image src={message.message} />
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
                            <Tooltip title={moment(message.timestamp).format("HH:mm:ss")} trigger="click"
                                arrow={false} placement="topRight" color="rgba(100,100,100,0.5)">
                                <Dropdown menu={{ items: left_items }} placement="bottomLeft"  trigger={['contextMenu']}>
                                    {
                                        message.messageType === "text"
                                            ?
                                            <div className={styles.message_left}>
                                                <Linkify>{message.message}</Linkify>
                                            </div>
                                            :
                                            message.messageType === "photo"
                                                ?
                                                <div className={styles.photo_left}>
                                                    <Image src={message.message} />
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
            <RightColumn session={props.session} members={members} messages={messages} images={images} setRefresh={props.setRefresh}/>
        </div>
        )
        :
        (
            <Skeleton />
        )
};

export default ChatBoard;
