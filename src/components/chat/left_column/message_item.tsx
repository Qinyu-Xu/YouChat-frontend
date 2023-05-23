import styles from "@/styles/chat.module.css";
import { request } from "@/utils/network";
import {Avatar, Badge} from "antd";
import {store} from "@/utils/store";
import {useEffect, useRef, useState} from "react";
import moment from "moment";

const scaleImage = (image: any, width: any, height: any) => {
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // 在画布上绘制图像并进行缩放
    ctx.drawImage(image, 0, 0, width, height);

    return canvas;
};

const CombinedImage = (props: any) => {
    const images = props.image;
    const canvasRef = useRef<any>();
    const gridSize = 2;

    const remToPx = (rem: any) => {
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return rem * fontSize;
    };

    const sz = remToPx(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        images.slice(0, 4).forEach((image: any, index: number) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const scaledImage = scaleImage(img,2 * sz, sz);
                context.drawImage(scaledImage, 2*sz* Number(index%2!==1), sz * Number(index <= 1));
            };
        });
    }, [images]);

    return (
        <div>
            <canvas className={styles.message_item_left} ref={canvasRef}  />
        </div>
    );
};

const MessageItem = (props: any) => {
    const [image, setImage] = useState<any>("");
    const [canv, setCanv] = useState<any>([]);

    useEffect(() => {
        if( props.session.sessionType === 1 ) {
            request(
                "api/session/chatroom?id=" + props.session.sessionId,
                "GET",
                "").then((res: any) => {
                    const id = (res.members.filter((member: any) =>
                            member.id !== store.getState().userId)
                    )[0].id;
                    if(!store.getState().imgMap.hasOwnProperty(id)) {
                        request("api/people/img/" + id, "GET", "").then((r: any) => {
                            store.dispatch({type: "addImage", data: {key: id, value: r.img}});
                            setImage(r.img);
                        });
                    } else {
                        setImage(store.getState().imgMap[id]);
                    }
                }
            )
        } else {
            setCanv([]);
            request(
                "api/session/chatroom?id=" + props.session.sessionId,
                "GET",
                "").then((res: any) => {
                    let i = 0;
                    for(; i < 4 && i < res.members.length; ++i) {
                        const resId = res.members[i].id;
                        if(!store.getState().imgMap.hasOwnProperty(res.members[i].id)) {
                            request("api/people/img/" + res.members[i].id, "GET", "").then((r: any) => {
                                store.dispatch({type: "addImage", data: {key: r.user_id, value: r.img}});
                                setCanv((images: any) => [...images, r.img]);
                            });
                        } else {
                            setCanv((images: any) => [...images, store.getState().imgMap[resId]]);
                        }
                    }
                    while(i < 4) {
                        i++;
                        setCanv((images: any) => [...images, ""]);
                    }

                })
            }
    }, []);

    return (
        <div className={
            props.session.isTop ?
                styles.message_item_istop
            :
                styles.message_item}>
            <Badge count={props.session.isMute || props.session.isSecret ? 0 : props.session.unread} overflowCount={99}>
                { props.session.sessionType === 1 ?
                    <Avatar className={styles.message_item_left} src={image}/>
                    : canv === undefined
                        ? <Avatar className={styles.message_item_left} src={"headshot/00.svg"} />
                        : <CombinedImage image={canv} />
                }
            </Badge>
            <div className={styles.message_item_mid}>
                <div className={styles.message_item_title}>
                    {props.session.sessionName}
                </div>
                <div className={styles.message_item_content}>
                    { !props.session.isSecret ?
                        (props.session.lastSender ? props.session.lastSender : (props.session.lastSender == "" ? "" : "用户"))
                        +
                        (props.session.lastSender == "" || props.session.isSecret ? "" : ":")
                        + (
                        props.session.type == "audio" ?
                        "[语音]"
                        : ( props.session.type == "photo" ?
                        "[图片]"
                        :
                        props.session.message ))
                        : "[私密群聊！]"
                    }

                </div>
            </div>
            <div className={styles.message_item_right}>
                <div className={styles.message_item_mute}>
                    {
                        props.session.isMute
                        ?
                            <img src={"ui/close-remind.svg"}/>
                        :
                            <div/>
                    } 
                </div>
                <div className={styles.message_item_time}>
                    {
                        moment(props.session.timestamp).year() < 2000 ? "" :
                        moment().year() != moment(props.session.timestamp).year() 
                        ?
                            moment(props.session.timestamp).format("YYYY/MM/DD")
                        : (
                            (moment().month() != moment(props.session.timestamp).month()) || (moment().date() != moment(props.session.timestamp).date()) 
                            ?
                                moment(props.session.timestamp).format("MM/DD")
                            : 
                                moment(props.session.timestamp).format("HH:mm")    
                        )
                    }
                </div>        
            </div>
        </div>
    )
};

export default MessageItem;