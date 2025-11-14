import React from "react";
import styles from "./BalanceCard.module.css";
import { useWallet } from "../../context/WalletContext";

const BalanceCard = () => {
    const { wallet, isLoading } = useWallet();

    return (
        <div className={styles.card}>
            <div>
                <p className={styles.label}>Available Balance</p>
                <h1 className={styles.amount}>
                    {isLoading ? "Loading..." : `USD ${wallet.balance.toLocaleString()}`}
                </h1>
            </div>
            <button
                className={isLoading ? styles.disabledButton : styles.button}
                disabled={isLoading}
            >
                Withdraw
            </button>
        </div>
    );
};

export default BalanceCard;
