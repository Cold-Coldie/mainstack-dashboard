import React, { useState } from "react";
import styles from "./AppMenu.module.css";
import { Icon } from "@iconify/react";

const NavLinks = [
    {
        icon: "/static/icons/sidebar-1.svg",
        title: "Link in Bio",
        description: "Manage your Link in Bio",
    },
    {
        icon: "/static/icons/sidebar-2.svg",
        title: "Store",
        description: "Manage your Store activities",
    },
    {
        icon: "/static/icons/sidebar-3.svg",
        title: "Media Kit",
        description: "Manage your Media Kit",
    },
    {
        icon: "/static/icons/sidebar-4.svg",
        title: "Invoicing",
        description: "Manage your Invoices",
    },
    {
        icon: "/static/icons/sidebar-3.svg",
        title: "Bookings",
        description: "Manage your Bookings",
    },
];

const AppMenu = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className={styles.menu}>
            <ul className={styles.list}>
                {NavLinks?.map((item, index) => {
                    return (
                        <li
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <img src={item.icon} alt="app-menu-icon" />
                            <div className={styles.textContainer}>
                                <span className={styles.title}>{item.title}</span>
                                <span className={styles.description}>{item.description}</span>
                            </div>
                            {hoveredIndex === index && (
                                <Icon icon="mdi:chevron-right" className={styles.chevron} />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AppMenu;