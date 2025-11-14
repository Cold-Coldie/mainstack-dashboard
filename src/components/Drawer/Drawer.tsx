import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Drawer.module.css";

interface DrawerProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: string;
}

const Drawer: React.FC<DrawerProps> = ({ show, onClose, children, width = "420px" }) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        if (show) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose]);

    // Close on ESC key
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (show) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [show, onClose]);

    // Lock scroll when open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [show]);

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.drawer} ref={drawerRef} style={{ width }}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default Drawer;
