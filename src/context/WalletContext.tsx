import React, { createContext, useContext, useState } from "react";

interface I_Wallet {
    balance: number;
    total_payout: number;
    total_revenue: number;
    pending_payout: number;
    ledger_balance: number;
}

interface I_WalletContext {
    wallet: I_Wallet;
    updateWallet: (wallet: I_Wallet) => void;
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const WalletContext = createContext<I_WalletContext | null>(null);

interface I_WalletProvider {
    children: React.ReactNode;
}

export const WalletProvider: React.FC<I_WalletProvider> = ({ children }) => {
    const [wallet, setWallet] = useState({
        balance: 0.00,
        total_payout: 0.00,
        total_revenue: 0.00,
        pending_payout: 0.00,
        ledger_balance: 0.00,
    });
    const [isLoading, setIsLoading] = useState(false)

    const updateWallet = (newWalletData: I_Wallet) => {
        setWallet((prevWallet) => ({ ...prevWallet, ...newWalletData }));
    };

    return (
        <WalletContext.Provider value={{ wallet, updateWallet, isLoading, setIsLoading }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
