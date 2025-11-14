import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Dropdown.module.css";

interface DropdownProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    triggerRef: React.RefObject<HTMLElement>;
}

const Dropdown: React.FC<DropdownProps> = ({
    show,
    onClose,
    children,
    position = "bottom-right",
    triggerRef
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Calculate position based on trigger element
    useEffect(() => {
        if (show && triggerRef.current && dropdownRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const dropdownRect = dropdownRef.current.getBoundingClientRect();

            let top = 0;
            let left = 0;

            switch (position) {
                case "bottom-right":
                    top = triggerRect.bottom + window.scrollY;
                    left = triggerRect.right + window.scrollX - dropdownRect.width;
                    break;
                case "bottom-left":
                    top = triggerRect.bottom + window.scrollY;
                    left = triggerRect.left + window.scrollX;
                    break;
                case "top-right":
                    top = triggerRect.top + window.scrollY - dropdownRect.height;
                    left = triggerRect.right + window.scrollX - dropdownRect.width;
                    break;
                case "top-left":
                    top = triggerRect.top + window.scrollY - dropdownRect.height;
                    left = triggerRect.left + window.scrollX;
                    break;
            }

            // Ensure dropdown stays within viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (left + dropdownRect.width > viewportWidth) {
                left = viewportWidth - dropdownRect.width - 10;
            }
            if (left < 0) {
                left = 10;
            }
            if (top + dropdownRect.height > viewportHeight + window.scrollY) {
                top = triggerRect.top + window.scrollY - dropdownRect.height;
            }
            if (top < window.scrollY) {
                top = triggerRect.bottom + window.scrollY;
            }

            setDropdownStyle({
                position: 'absolute',
                top: `${top + 10}px`,
                left: `${left}px`
            });
        }
    }, [show, position, triggerRef]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                onClose?.();
            }
        }

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose, triggerRef]);

    // Block scrolling when dropdown is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            };
        }
    }, [show]);

    if (!show) return null;

    return ReactDOM.createPortal(
        <div
            className={`${styles.dropdown} ${styles[position]}`}
            ref={dropdownRef}
            style={dropdownStyle}
        >
            {children}
        </div>,
        document.body
    );
}

export default Dropdown;