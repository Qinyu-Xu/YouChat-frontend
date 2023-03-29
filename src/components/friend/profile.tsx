import styles from '@/styles/layout.module.css'
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
            <button onClick={() => { send(props.profile.id, "RequestTo"); }}>
                Request
            </button>
        );
    }
    else if (props.profile.group == "RequestFrom") {
        operation.push(
            <button onClick={() => { send(props.profile.id, "Default"); }}>
                Accept
            </button>
        );
        operation.push(<br/>);
        operation.push(
            <button onClick={() => { send(props.profile.id, "Stranger"); }}>
                Reject
            </button>
        );
    }
    else if (props.profile.group == "RequestTo") {

    }
    else {
        operation.push(
            <button onClick={() => { send(props.profile.id, "Stranger"); }}>
                Delete
            </button>
        );
        operation.push(<br/>);
        operation.push(
            <div>
                <input type="text"
                    onChange={(e) => { setGroup(e.target.value); }}
                    value={group}
                />
                <button onClick={() => { send(props.profile.id, group); }}>
                    Move
                </button>
            </div>
        )
    }

    return (
        <div className={styles.content}>
            nickname: {props.profile.nickname}<br/>
            username: {props.profile.username}<br/>
            email: {props.profile.email}<br/>
            group: {props.profile.group}<br/>
            {operation}
        </div>
    );
};

export default Profile;