import LoginBoard from '@/components/login_board';
import styles from '@/styles/login.module.css'

function Index() {

    return (
        <main className={styles.login}>
            <LoginBoard type={'login'}/>
        </main>
    );
};

export default Index;