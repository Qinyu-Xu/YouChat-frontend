import FriendSearch from '@/components/friend/search'
import FriendList from '@/components/friend/list'
import FriendProfile from '@/components/friend/profile'
import styles from '@/styles/layout.module.css'

function Friend() {
    return (
        <main>
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
            <div className={styles.column}>
                <div className={styles.column_item}>
                    search bar
                </div>
                <div className={styles.column_item}>
                    item 1
                </div>
                <div className={styles.column_item}>
                    item 2
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
                <div className={styles.column_item}>
                    item 3
                </div>
            </div>
            <div className={styles.content}>
                {/* <FriendSearch/>
                <FriendList/>
                <FriendProfile/> */}
            </div>
        </main>
    );
}

export default Friend;