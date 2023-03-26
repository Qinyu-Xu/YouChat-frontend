import LoginBoard from '@/components/login_board';
import styles from '@/styles/login.module.css'

function Login() {

    return (
        <main className={styles.login}>
            <LoginBoard type={'login'}/>
        </main>
    );
};

export default Login;