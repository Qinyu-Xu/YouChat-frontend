import styles from '@/styles/layout.module.css'

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar_item}>
                🏊
            </div>
            <div className={styles.sidebar_item}>
                💬
            </div>
            <div className={styles.sidebar_item}>
                👥
            </div>
            <div className={styles.sidebar_item}>
                ⚙️
            </div>
        </div>
    );
}

export default Sidebar;