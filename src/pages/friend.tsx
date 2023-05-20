import Column from '@/components/friend/column'
import Profile from '@/components/friend/profile'
import Sidebar from '@/components/sidebar'
import styles from '@/styles/layout.module.css'
import { useState } from 'react';
import {ReceiverBoard} from "@/components/chat/single_message/video_chat";

export interface profile_type {
    id?: number;
    nickname: string;
    username: string;
    email: string;
    group: string;
};

function Friend() {
    const [profile, setProfile] = useState<profile_type>({
        id: 0,
        nickname: "None",
        username: "None",
        email: "None",
        group: "None",
    });

    return (
        <div className={styles.container}>
            <Sidebar type={"friend"}/>
            <Column setProfile={setProfile}/>
            <div className={styles.content}>
                {
                    profile.id === undefined || profile.id === 0
                        ?
                        <div>

                        </div>
                        :
                        <Profile profile={profile}/>
                }
            </div>
            <ReceiverBoard />
        </div>
    );
}

export default Friend;