import React, { useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { Icon } from "@iconify/react";
import Dropdown from "../Dropdown/Dropdown";
import ProfileMenu from "./ProfileMenu/ProfileMenu";
import AppMenu from "./AppMenu/AppMenu";
import { useUser } from "../../context/UserContext";
import { GetInitials } from "../../utils/GetInitals";

const NavLinks = [
    {
        icon: "material-symbols:home-outline-rounded",
        title: "Home",
        active: false,
    },
    {
        icon: "material-symbols:analytics-outline-rounded",
        title: "Analytics",
        active: false,
    },
    {
        icon: "vaadin:cash",
        title: "Revenue",
        active: true,
    },
    {
        icon: "mdi:users-outline",
        title: "CRM",
        active: false,
    },
    {
        icon: "fluent:apps-16-regular",
        title: "App",
        active: false,
    },
];

const Navbar = () => {
    const { user, isLoading } = useUser();

    const [showMenu, setShowMenu] = useState(false);
    const [navLinks, setNavLinks] = useState(NavLinks);
    const [showApps, setShowApps] = useState(false);

    const profileMenuRef = useRef<any>(null);
    const linkRef = useRef<any>(null);

    const handleToggleApp = () => {
        setShowApps((s) => !s);
        setNavLinks((s) =>
            s.map((item) => {
                if (item.title === "App") {
                    return { ...item, active: !item.active };
                }
                return item;
            })
        );
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.left}>
                <img src={"/static/icons/mainstack-logo.svg"} alt="mainstack logo" />
            </div>

            <ul className={styles.navItems}>
                {navLinks?.map((item, index) => {
                    if (index === 4) return null;
                    return (
                        <li
                            key={index}
                            className={item.active ? styles.active : ""}
                            onClick={() => { }}
                            ref={linkRef}
                        >
                            <Icon icon={item.icon} width="20" height="20" />
                            {item.title}
                        </li>
                    );
                })}

                <li
                    className={navLinks[4].active ? styles.active : ""}
                    onClick={() => {
                        handleToggleApp();
                    }}
                    ref={linkRef}
                >
                    <Icon icon={navLinks[4].icon} width="20" height="20" />
                    {navLinks[4].title}

                    {navLinks[4].active && (
                        <span>
                            Link in Bio{" "}
                            <Icon
                                icon="material-symbols:keyboard-arrow-down-rounded"
                                width="24"
                                height="24"
                            />
                        </span>
                    )}
                </li>
            </ul>

            <Dropdown
                show={showApps}
                onClose={() => handleToggleApp()}
                position="bottom-left"
                triggerRef={linkRef}
            >
                <AppMenu />
            </Dropdown>

            <div className={styles.right}>
                <ul className={styles.navItemsRight}>
                    <li>
                        <Icon icon="mdi:bell-outline" width="20" height="20" />
                    </li>
                    <li>
                        <Icon
                            icon="material-symbols:comment-outline"
                            width="20"
                            height="20"
                        />
                    </li>
                </ul>

                {isLoading ? (
                    <div className={styles.profile}>
                        <Icon icon="svg-spinners:180-ring" width="24" height="24" />
                    </div>
                ) : (
                    <div
                        className={styles.profile}
                        onClick={() => {
                            setShowMenu((s) => !s);
                        }}
                        ref={profileMenuRef}
                    >
                        <div className={styles.avatar}>
                            {GetInitials(`${user.first_name} ${user.last_name}`)}
                        </div>
                        <Icon icon="material-symbols:menu" width="24" height="24" />
                    </div>
                )}

                <Dropdown
                    show={showMenu}
                    onClose={() => setShowMenu((s) => !s)}
                    position="bottom-right"
                    triggerRef={profileMenuRef}
                >
                    <ProfileMenu />
                </Dropdown>
            </div>
        </nav>
    );
};

export default Navbar;
