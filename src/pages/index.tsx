import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

function Index() {

    const router = useRouter();
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        if(cookies.token !== undefined) {
            router.push('chat');
        } else {
            router.push('login');
        }
    },[])

    return (
        <div>
            Loading...
        </div>
    );
}

export default Index;