import React, { createContext, useContext, useState } from "react";

interface I_User {
    first_name: string;
    last_name: string;
    email: string;
}

interface I_UserContext {
    user: I_User;
    updateUser: (user: I_User) => void;
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const UserContext = createContext<I_UserContext | null>(null);

interface I_UserProvider {
    children: React.ReactNode;
}

export const UserProvider: React.FC<I_UserProvider> = ({ children }) => {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false)

    const updateUser = (newUserData: I_User) => {
        setUser((prevUser) => ({ ...prevUser, ...newUserData }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser, isLoading, setIsLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
