import React, { createContext, useContext, useState } from "react";

export interface I_Transactions {
    amount: number;
    status: string;
    type: "deposit" | "withdrawal";
    date: string;
    metadata?: any
}

interface I_TransactionsContext {
    transactions: Array<I_Transactions>;
    updateTransactions: (transaction: Array<I_Transactions>) => void;
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const TransactionsContext = createContext<I_TransactionsContext | null>(null);

interface I_TransactionsProvider {
    children: React.ReactNode;
}

export const TransactionsProvider: React.FC<I_TransactionsProvider> = ({ children }) => {
    const [transactions, setTransactions] = useState<Array<I_Transactions>>([]);
    const [isLoading, setIsLoading] = useState(false)

    const updateTransactions = (newTransactionsData: Array<I_Transactions>) => {
        setTransactions([...newTransactionsData]);
    };

    return (
        <TransactionsContext.Provider value={{ transactions, updateTransactions, isLoading, setIsLoading }}>
            {children}
        </TransactionsContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionsContext);
    if (!context) {
        throw new Error("useTransactions must be used within a TransactionsProvider");
    }
    return context;
};
