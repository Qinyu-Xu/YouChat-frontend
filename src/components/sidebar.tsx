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
                💬
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/friend')}>
                👥
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/settings')}>
                ⚙️
            </div>
        </div>
    );
}

export default Sidebar;