import styles from '@/styles/layout.module.css'
import { request } from "@/utils/network";
import { group } from 'console';

interface ProfileProps {
    profile: any;
}

function Profile(props: ProfileProps) {
    const handleRequest = async (e) => {
        const Entity = {
            id: props.profile.id,
            group: "RequestTo",
        };

		console.log(e);
        try {
            const response = await request(
                "/people/profile" + e.target.id,
                "GET",
				JSON.stringify(Entity),
            ); 
        } catch(err) {
            console.log(err);
        }
    };

    const handleAccepet = async (e) => {
        const Entity = {
            id: props.profile.id,
            group: "Default",
        }

		console.log(e);
        try {
            const response = await request(
                "/people/profile" + e.target.id,
                "GET",
				JSON.stringify(Entity),
            ); 
        } catch(err) {
            console.log(err);
        }
    };

    const handleReject = async (e) => {

    };

    const handleDelete = async (e) => {

    };

    const operation: any[] = [];
    if (props.profile.group == "Stranger") {
        operation.push(
            <button onClick={handleRequest}>
                Request
            </button>
        );
    }
    else if (props.profile.group == "RequestFrom") {
    
    }
    else if (props.profile.group == "RequestTo") {

    }
    else {

    }
    return (
        <div className={styles.content}>
            nickname: {props.profile.nickname}<br/>
            username: {props.profile.username}<br/>
            email: {props.profile.email}<br/>
            group: {props.profile.group}<br/>
        </div>
    );
};

export default Profile;