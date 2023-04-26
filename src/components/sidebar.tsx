import styles from '@/styles/layout.module.css';
import {useRouter} from "next/router";

function Sidebar(props: any) {
    const router = useRouter();
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_logo}>
                🏊
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/chat')}>
                {
                    props.type !== "chat" ? 
                        <img src="ui/message.svg"/> 
                    : 
                        <img src="ui/message_rev.svg"/>
                }
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/friend')}>
                {
                    props.type !== "friend" ? 
                        <img src="ui/peoples.svg"/> 
                    : 
                        <img src="ui/peoples_rev.svg"/>
                }
            </div>
            <div className={styles.sidebar_item} onClick={()=>router.push('/settings')}>
                {
                    props.type !== "settings" ? 
                        <img src="ui/setting.svg"/> 
                    : 
                        <img src="ui/setting_rev.svg"/>
                }
            </div>
        </div>
    );
}

export default Sidebar;