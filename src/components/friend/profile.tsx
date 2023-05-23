import styles from '@/styles/profile.module.css'
import {Avatar, Button, Input, Spin} from "antd";
import { request } from "@/utils/network";
import {useEffect, useState} from 'react';

interface ProfileProps {
    profile: any,
}

const send = async (id: number, group: string) => {
    try {
        const response = await request(
            "api/people/friends",
            "PUT",
            JSON.stringify({
                "id": id,
                "group": group,
            }),
        ); 
        location.reload();
    } catch(err) {
        console.log(err);
    }
}

function Profile(props: ProfileProps) {
    const operation: any[] = [];
    const [group, setGroup] = useState("");
    const [image, setImage] = useState<any>('/headshot/01.svg');
    const [iload, setIload] = useState(false);

    useEffect(() => {
        setIload(false);
        request("api/people/img/"+props.profile.id, "GET", "").then(res => {
            if(res.code === 0) {
                if(res.img !== '')
                    setImage(res.img);
                else
                    setImage('/headshot/01.svg');
                setIload(true);
            }
        })
    }, [props.profile.id]);

    if (props.profile.group == "Stranger") {
        operation.push(
            <Button id={"1"} onClick={() => { send(props.profile.id, "RequestTo"); }}>
                Request
            </Button>
        );
    }
    else if (props.profile.group == "RequestFrom") {
        operation.push(
            <Button id={"2"} onClick={() => { send(props.profile.id, "Default"); }}>
                Accept
            </Button>
        );
        operation.push(<br/>);
        operation.push(
            <Button id={"3"} onClick={() => { send(props.profile.id, "Stranger"); }}>
                Reject
            </Button>
        );
    }
    else if (props.profile.group == "RequestTo" || props.profile.group == "Myself") {

    }
    else {
        operation.push(
            <Button id={"4"} onClick={() => { send(props.profile.id, "Stranger"); }}>
                Delete
            </Button>
        );
        operation.push(<br/>);
        operation.push(
            <div id={"5"} style={{display: "flex"}}>
                <Input id={"6"} type="text"
                    onChange={(e) => { setGroup(e.target.value); }}
                    value={group}
                />
                <Button id={"7"} onClick={() => { send(props.profile.id, group); }}>
                    Move
                </Button>
            </div>
        )
    }

    return iload ? (
        <div className={styles.profile}>
            <Avatar size={300} src={image} />
            Nickname: {props.profile.nickname}
            <br/>
            Username: {props.profile.username}
            <br/>
            Email: {props.profile.email}
            <br/>
            Group: {props.profile.group}
            <br/>
            <br/>
            {operation}
        </div>
    )
        :
        <div className={styles.profile}>
            <Spin />
        </div>;
};

export default Profile;