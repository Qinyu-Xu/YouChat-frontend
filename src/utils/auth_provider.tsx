import {createContext, useState} from "react";

interface AuthContext {
    auth: any | null,
    setAuth: (any: any) => any | null;
}

const AuthContext = createContext<AuthContext>({
    auth: undefined, setAuth(any: any): any {}
});

export const AuthProvider = ({children}: {children: any}) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;