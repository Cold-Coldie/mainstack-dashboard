import React, { useEffect } from "react";
import styles from "./Revenue.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import BalanceCard from "../../components/BalanceCard/BalanceCard";
import StatsPanel from "../../components/StatsPanel/StatsPanel";
import Chart from "../../components/Chart/Chart";
import TransactionList from "../../components/TransactionList/TransactionList";
import { useUser } from "../../context/UserContext";
import * as API from "../../config/Constants";
import { Http } from "../../lib/http";
import { useWallet } from "../../context/WalletContext";
import { useTransactions } from "../../context/TransactionsContext";

const Revenue = () => {
    const { updateUser, setIsLoading: setIsLoadingUser } = useUser();
    const { updateWallet, setIsLoading: setIsLoadingWallet } = useWallet();
    const { updateTransactions, setIsLoading: setIsLoadingTransactions } = useTransactions();

    useEffect(() => {
        const fetchUser = async () => {
            const url = `${API.BASE_URL}/user`;
            setIsLoadingUser(true);
            const { data } = await Http("GET", url);
            updateUser(data);
            setIsLoadingUser(false);
        };

        const fetchWallet = async () => {
            const url = `${API.BASE_URL}/wallet`;
            setIsLoadingWallet(true);
            const { data } = await Http("GET", url);
            updateWallet(data);
            setIsLoadingWallet(false);
        };

        const fetchTransactions = async () => {
            const url = `${API.BASE_URL}/transactions`;
            setIsLoadingTransactions(true);
            const { data } = await Http("GET", url);
            updateTransactions(data);
            setIsLoadingTransactions(false);
        };

        fetchUser();
        fetchWallet();
        fetchTransactions();
    }, [
        setIsLoadingTransactions,
        setIsLoadingUser,
        setIsLoadingWallet,
        updateTransactions,
        updateUser,
        updateWallet
    ]);

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>
                <Navbar />
                <div className={styles.content}>
                    <div className={styles.top}>
                        <div className={styles.left}>
                            <BalanceCard />
                            <Chart />
                        </div>
                        <StatsPanel />
                    </div>
                    <TransactionList />
                </div>
            </div>
        </div>
    );
};

export default Revenue;