import {useEffect, useState} from "react";
import SingleMessage from "@/components/chat/single_message";
import styles from "@/styles/chat.module.css"
import { isBrowser } from "@/utils/store";
import { store } from "@/utils/store";
import Linkify from "react-linkify";
import type { MenuProps } from 'antd';
import {Avatar, Dropdown, Skeleton} from 'antd';
import {MenuShow} from "@/components/chat/right_column/right_column";
import {request} from "@/utils/network";
import RightColumn from "@/components/chat/right_column/right_column";
import {DEFAULT_SVG, readSvgAsBase64} from "@/utils/utilities";

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
    const [count, setCount] = useState(0);
    const [images, setImages] = useState<Map<number,string>>(new Map());
    const [iload, setIload] = useState(false);
    const [mload, setMload] = useState(false);
    const D = DEFAULT_SVG;

    useEffect(() => {
        request(
            "/api/session/chatroom?id="+props.session.sessionId,
            "GET",
            ""
        ).then((res: any) => {
            setCount(0);
            setMembers(res.members);
        });
        }, [props.session.sessionId]
    );

    useEffect(() => {
        for (let i = 0; i < members.length; ++i) {
            request("api/people/img/" + members[i].id, "GET", "").then((r: any) => {
                const newMap: any = new Map(images);
                if (r.img === "") newMap.set(members[i].id, D);
                else newMap.set(members[i].id, r.img);
                setImages(newMap);
            }).then(() => setCount(count => count + 1));
        }
    }, [members]);

    useEffect(() => {
        if(count === members.length && count !== 0) {
            setMessages(messages => [...messages]);
            setIload(true);
        }
    }, [count]);

    useEffect(() => {
        const getPull = () => {
            const socket: any = store.getState().webSocket;
            socket.send(JSON.stringify({
                    type: "pull",
                    id: store.getState().userId,
                    sessionId: props.session.sessionId,
                    messageScale: 30
                })
            );
        };
        const handleSend = (res: any) => {
            res = eval("(" + res.data + ")");
            if (res.type === 'send' && res.sessionId === props.session.sessionId) {
                getPull();
            }
        };
        const handlePull = (res: any) => {
            res = eval("(" + res.data + ")")
            if ( res.type === 'pull' ) {
                setMessages(res.messages);
                setMessages((messages) => messages.reverse());
                setMload(true);
            }
        };
        const socket: any = store.getState().webSocket;
        if(isBrowser && socket != null && socket.readyState === 1) {
            socket.addEventListener("message", handleSend);
            socket.addEventListener("message", handlePull);
            getPull();
        }
        return () => {
            socket.removeEventListener('message', handleSend);
            socket.removeEventListener('message', handlePull);
        };
    }, [props.session.sessionId, store.getState().webSocket]);

    useEffect(() => {
        document
        ?.getElementById('THEEND')
        ?.scrollIntoView()
    }, [messages]);

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

            <div className={styles.display_board} >
                {messages.map((message: any, index: any) =>
                    message.senderId === store.getState().userId ? (
                        <div className={styles.message} key={index+1}>
                            <div className={styles.headshot_right}>
                                <Avatar src={images.get(message.senderId)} />
                            </div>
                            <Dropdown menu={{ items: right_items }} placement="topLeft" trigger={['contextMenu']}>
                                <div className={styles.message_right}>
                                    <Linkify>{message.message}</Linkify>
                                </div>
                            </Dropdown>
                        </div>
                    ) : (
                        <div className={styles.message} key={index+1}>
                            <div className={styles.headshot_left}>
                                <Avatar src={images.get(message.senderId)} />
                            </div>
                            <Dropdown menu={{ items: left_items }} placement="topLeft"  trigger={['contextMenu']}>
                                <div className={styles.message_left}>
                                    <Linkify>{message.message}</Linkify>
                                </div>
                            </Dropdown>
                        </div>
                ))}
                <div id="THEEND"/>
            </div>
            <SingleMessage sessionId={props.session.sessionId} setMessages={setMessages}/>
            <RightColumn session={props.session} members={members}/>
        </div>
        )
        :
        (
            <Skeleton />
        )
};

export default ChatBoard;
