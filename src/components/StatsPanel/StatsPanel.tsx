import React from "react";
import styles from "./StatsPanel.module.css";
import { Icon } from "@iconify/react";
import { useWallet } from "../../context/WalletContext";

const StatsPanel = () => {
    const { wallet, isLoading } = useWallet();

    return (
        <>
            {isLoading ? (
                <div className={styles.panelLoading}>
                    <Icon icon="svg-spinners:180-ring" width="34" height="34" />
                </div>
            ) : (
                <div className={styles.panel}>
                    <div className={styles.stat}>
                        <div className={styles.labelGroup}>
                            <span>Ledger Balance</span>
                            <div className={styles.icon}>
                                <Icon
                                    icon="material-symbols:info-outline-rounded"
                                    width="20"
                                    height="20"
                                />
                            </div>
                        </div>
                        <h3>USD {wallet.ledger_balance.toLocaleString()}</h3>
                    </div>

                    <div className={styles.stat}>
                        <div className={styles.labelGroup}>
                            <span>Total Payout</span>
                            <div className={styles.icon}>
                                <Icon
                                    icon="material-symbols:info-outline-rounded"
                                    width="20"
                                    height="20"
                                />
                            </div>
                        </div>
                        <h3>USD {wallet.total_payout.toLocaleString()}</h3>
                    </div>

                    <div className={styles.stat}>
                        <div className={styles.labelGroup}>
                            <span>Total Revenue</span>
                            <div className={styles.icon}>
                                <Icon
                                    icon="material-symbols:info-outline-rounded"
                                    width="20"
                                    height="20"
                                />
                            </div>
                        </div>
                        <h3>USD {wallet.total_revenue.toLocaleString()}</h3>
                    </div>

                    <div className={styles.stat}>
                        <div className={styles.labelGroup}>
                            <span>Pending Payout</span>
                            <div className={styles.icon}>
                                <Icon
                                    icon="material-symbols:info-outline-rounded"
                                    width="20"
                                    height="20"
                                />
                            </div>
                        </div>
                        <h3>USD {wallet.pending_payout.toLocaleString()}</h3>
                    </div>
                </div>
            )}
        </>
    );
};

export default StatsPanel;
