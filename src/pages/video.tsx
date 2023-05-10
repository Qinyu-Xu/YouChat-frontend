import Sidebar from '@/components/sidebar';
import styles from '@/styles/layout.module.css';
import { useState } from 'react';
import VideoChat from '@/components/videochat/videochat';

function Chat() {
  const [profile, setProfile] = useState({
    id: 0,
    nickname: 'None',
    username: 'None',
    email: 'None',
    group: 'None',
  });

  return (
    <div className={styles.container}>
      <Sidebar type={'chat'} />
      <div className={styles.content}>
        <VideoChat />
      </div>
      <div className={styles.profile}>
        {profile.id === 0 ? (
          <div>No profile selected</div>
        ) : (
          <Profile profile={profile} />
        )}
      </div>
    </div>
  );
}

export default Chat;
