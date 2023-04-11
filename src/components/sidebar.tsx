import styles from '@/styles/layout.module.css';
import {useRouter} from "next/router";

function Sidebar() {
    const router = useRouter();
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_logo}>
                🏊
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/chat')}>
                <img src="ui/message.svg"/>
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/friend')}>
                <img src="ui/peoples.svg"/>
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/settings')}>
                <img src="ui/setting.svg"/>
            </div>
        </div>
    );
}

export default Sidebar;