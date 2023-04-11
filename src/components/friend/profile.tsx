import styles from '@/styles/profile.module.css'
import { Button, Input } from "antd";
import { request } from "@/utils/network";
import { useState } from 'react';

interface ProfileProps {
    profile: any,
}

const send = async (id: number, group: string) => {
    console.log(id, group);
    try {
        const response = await request(
            "api/people/friends",
            "PUT",
            JSON.stringify({
                "id": id,
                "group": group,
            }),
        ); 
        console.log(response);
        location.reload();
    } catch(err) {
        console.log(err);
    }
}

function Profile(props: ProfileProps) {
    const operation: any[] = [];
    const [group, setGroup] = useState("");

    if (props.profile.group == "Stranger") {
        operation.push(
            <Button onClick={() => { send(props.profile.id, "RequestTo"); }}>
                Request
            </Button>
        );
    }
    else if (props.profile.group == "RequestFrom") {
        operation.push(
            <Button onClick={() => { send(props.profile.id, "Default"); }}>
                Accept
            </Button>
        );
        operation.push(<br/>);
        operation.push(
            <Button onClick={() => { send(props.profile.id, "Stranger"); }}>
                Reject
            </Button>
        );
    }
    else if (props.profile.group == "RequestTo") {

    }
    else {
        operation.push(
            <Button onClick={() => { send(props.profile.id, "Stranger"); }}>
                Delete
            </Button>
        );
        operation.push(<br/>);
        operation.push(
            <div style={{display: "flex"}}>
                <Input type="text"
                    onChange={(e) => { setGroup(e.target.value); }}
                    value={group}
                />
                <Button onClick={() => { send(props.profile.id, group); }}>
                    Move
                </Button>
            </div>
        )
    }

    return (
        <div className={styles.profile}>
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
    );
};

export default Profile;