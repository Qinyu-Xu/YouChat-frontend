import Column from '@/components/friend/column'
import Profile from '@/components/friend/profile'
import SideBar from '@/components/sidebar'
import { useState } from 'react';

interface profile_type {
    id: number;
    nickname: string;
    username: string;
    email: string;
    group: string;
}

function Friend() {
    const [profile, setProfile] = useState<number>(-1);

    return (
        <main>
            <SideBar/>
            <Column setProfile={setProfile}/>
            <Profile profile={profile}/>
        </main>
    );
}

export default Friend;