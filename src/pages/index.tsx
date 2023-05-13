import { useRouter } from "next/router";
import { useEffect } from "react";

function Index() {

    const router = useRouter();

    useEffect(() => {
        router.push('login');
    },[])

    return (
        <div>
            Loading...
        </div>
    );
}

export default Index;