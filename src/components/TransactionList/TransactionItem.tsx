import React from "react";
import styles from "./TransactionList.module.css";
import { Icon } from "@iconify/react";
import { I_Transactions } from "../../context/TransactionsContext";

const TransactionItem = ({
    amount,
    date,
    type,
    status,
    metadata,
}: I_Transactions) => {
    const isDeposit = type === "deposit";
    const icon = isDeposit ? (
        <Icon icon="fluent:arrow-down-left-24-filled" width="11.5" height="11.5" />
    ) : (
        <Icon icon="fluent:arrow-up-right-24-filled" width="11.5" height="11.5" />
    );
    const color = status === "successful" ? "#0EA163" : "#A77A07";
    const backgroundColor = isDeposit ? "#E3FCF2" : "#F9E3E0";

    return (
        <div className={styles.item}>
            <div className={styles.left}>
                <span className={styles.icon} style={{ backgroundColor }}>
                    {icon}
                </span>
                <div>
                    <p className={styles.title}>
                        {isDeposit && metadata?.product_name
                            ? metadata?.product_name
                            : isDeposit
                                ? "Cash deposit"
                                : "Cash withdrawal"}
                    </p>
                    {isDeposit ? (
                        <p className={styles.name}>{metadata?.name}</p>
                    ) : (
                        <p className={styles.name} style={{ color }}>
                            {status}
                        </p>
                    )}
                </div>
            </div>
            <div className={styles.right}>
                <p className={styles.amount}>USD {amount.toLocaleString()}</p>
                <p className={styles.date}>
                    {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })}
                </p>
            </div>
        </div>
    );
};

export default TransactionItem;
