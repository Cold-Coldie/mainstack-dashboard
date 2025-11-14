import React, { useState } from "react";
import TransactionItem from "./TransactionItem";
import styles from "./TransactionList.module.css";
import { Icon } from "@iconify/react";
import Drawer from "../Drawer/Drawer";
import FilterPanel from "../FilterPanel/FilterPanel";
import { useTransactions } from "../../context/TransactionsContext";

const TransactionList = () => {
    const { transactions, isLoading } = useTransactions();

    const [showFilter, setShowFilter] = useState(false);

    const LoadingSkeleton = () => (
        <div className={styles.skeletonContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={styles.skeletonItem}>
                    <div className={styles.skeletonIcon}></div>
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonText}></div>
                        <div className={styles.skeletonSubtext}></div>
                    </div>
                    <div className={styles.skeletonAmount}></div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <Drawer show={showFilter} onClose={() => setShowFilter(false)}>
                <FilterPanel onClose={() => setShowFilter(false)} />
            </Drawer>

            <section className={styles.list}>
                <div className={styles.headerContainer}>
                    <div className={styles.header}>
                        <h3>{transactions.length} Transactions</h3>
                        <p>Your transactions for the last 7 days</p>
                    </div>

                    <div className={styles.actionContainer}>
                        <div className={styles.action} onClick={() => setShowFilter(true)}>
                            Filter{" "}
                            <Icon
                                icon="material-symbols:keyboard-arrow-down-rounded"
                                width="24"
                                height="24"
                            />
                        </div>

                        <div className={styles.action}>
                            Export list{" "}
                            <Icon icon="material-symbols:download" width="24" height="24" />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    transactions.map((tx, i) => <TransactionItem key={i} {...tx} />)
                )}
            </section>
        </>
    );
};

export default TransactionList;
