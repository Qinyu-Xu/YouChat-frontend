import Column from '@/components/friend/column'
import Profile from '@/components/friend/profile'
import SideBar from '@/components/sidebar'
import { useState } from 'react';

export interface profile_type {
    id: number;
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
        <main>
            <SideBar/>
            <Column setProfile={setProfile}/>
            <Profile profile={profile}/>
        </main>
    );
}

export default Friend;