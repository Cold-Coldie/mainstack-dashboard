import React, { useState } from "react";
import styles from "./Sidebar.module.css";

const SidebarIcons = [
    {
        icon: "/static/icons/sidebar-1.svg",
        tooltip: "Dashboard"
    },
    {
        icon: "/static/icons/sidebar-2.svg",
        tooltip: "Transactions"
    },
    {
        icon: "/static/icons/sidebar-3.svg",
        tooltip: "Analytics"
    },
    {
        icon: "/static/icons/sidebar-4.svg",
        tooltip: "Settings"
    },
];

const Sidebar = () => {
    const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.icons}>
                {SidebarIcons?.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={styles.iconContainer}
                            onMouseEnter={() => setActiveTooltip(index)}
                            onMouseLeave={() => setActiveTooltip(null)}
                        >
                            <img src={item.icon} alt="sidebar-icon" />
                            {activeTooltip === index && (
                                <div className={styles.tooltip}>
                                    {item.tooltip}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;