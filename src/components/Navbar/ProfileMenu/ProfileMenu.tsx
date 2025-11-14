import React from "react";
import styles from "./ProfileMenu.module.css";
import { Icon } from "@iconify/react";
import { useUser } from "../../../context/UserContext";
import { GetInitials } from "../../../utils/GetInitals";

const NavLinks = [
    { icon: "mdi-light:settings", title: "Settings" },
    {
        icon: "material-symbols-light:receipt-long-outline",
        title: "Purchase History",
    },
    {
        icon: "material-symbols-light:featured-seasonal-and-gifts-rounded",
        title: "Refer and Earn",
    },
    { icon: "fluent:apps-48-regular", title: "Integrations" },
    { icon: "material-symbols-light:bug-report-outline", title: "Report Bug" },
    {
        icon: "material-symbols-light:switch-account-outline-rounded",
        title: "Switch Account",
    },
    { icon: "material-symbols-light:logout-rounded", title: "Sign Out" },
];

const ProfileMenu = () => {
    const { user } = useUser();

    return (
        <div className={styles.menu}>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    {GetInitials(`${user.first_name} ${user.last_name}`)}
                </div>
                <div>
                    <h4>{`${user.first_name} ${user.last_name}`}</h4>
                    <p>{`${user.email}`}</p>
                </div>
            </div>

            <ul className={styles.list}>
                {NavLinks?.map((item, index) => {
                    return (
                        <li>
                            <Icon icon={item.icon} width="20" height="20" /> {item.title}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ProfileMenu;
