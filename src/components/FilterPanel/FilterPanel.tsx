import React, { useState } from "react";
import styles from "./FilterPanel.module.css";
import { Icon } from "@iconify/react";
import { useTransactions } from "../../context/TransactionsContext";

interface I_FilterPanel {
    onClose: () => void
}

interface FilterState {
    quickFilter: string;
    dateRange: { from: string; to: string };
    selectedTypes: string[];
    selectedStatuses: string[];
}

const FilterPanel: React.FC<I_FilterPanel> = ({ onClose }) => {
    const { transactions, updateTransactions, setIsLoading } = useTransactions();

    const [filters, setFilters] = useState<FilterState>({
        quickFilter: "",
        dateRange: { from: "", to: "" },
        selectedTypes: [],
        selectedStatuses: []
    });

    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const quickFilters = ["Today", "Last 7 days", "This month", "Last 3 months"];

    const transactionTypes = ["deposit", "withdrawal"];
    const statuses = ["successful", "pending", "failed"];

    // Update filter state
    const updateFilter = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleQuickFilter = (filter: string) => {
        updateFilter("quickFilter", filter);
    };

    const toggleType = (type: string) => {
        updateFilter("selectedTypes",
            filters.selectedTypes.includes(type)
                ? filters.selectedTypes.filter(t => t !== type)
                : [...filters.selectedTypes, type]
        );
    };

    const toggleStatus = (status: string) => {
        updateFilter("selectedStatuses",
            filters.selectedStatuses.includes(status)
                ? filters.selectedStatuses.filter(s => s !== status)
                : [...filters.selectedStatuses, status]
        );
    };

    const handleClear = () => {
        setFilters({
            quickFilter: "",
            dateRange: { from: "", to: "" },
            selectedTypes: [],
            selectedStatuses: []
        });
        // Reset to all transactions when cleared
        applyFilters({
            quickFilter: "",
            dateRange: { from: "", to: "" },
            selectedTypes: [],
            selectedStatuses: []
        });
    };

    const handleApply = () => {
        applyFilters(filters);
        onClose();
    };

    // Filtering logic
    const applyFilters = (filterState: FilterState) => {
        setIsLoading(true);

        // Little delay to see the loading state like a real API call again.
        setTimeout(() => {
            let filteredTransactions = [...transactions];

            // Apply quick filters (date range filters)
            if (filterState.quickFilter) {
                filteredTransactions = applyQuickFilter(filteredTransactions, filterState.quickFilter);
            }

            // Apply custom date range
            if (filterState.dateRange.from && filterState.dateRange.to) {
                filteredTransactions = applyDateRangeFilter(filteredTransactions, filterState.dateRange);
            }

            // Apply type filters
            if (filterState.selectedTypes.length > 0) {
                filteredTransactions = filteredTransactions.filter(transaction =>
                    filterState.selectedTypes.includes(transaction.type)
                );
            }

            // Apply status filters
            if (filterState.selectedStatuses.length > 0) {
                filteredTransactions = filteredTransactions.filter(transaction =>
                    filterState.selectedStatuses.includes(transaction.status)
                );
            }

            updateTransactions(filteredTransactions);
            setIsLoading(false);
        }, 500);
    };

    const applyQuickFilter = (transactions: any[], filter: string) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filter) {
            case "Today":
                return transactions.filter(transaction =>
                    new Date(transaction.date).toDateString() === today.toDateString()
                );

            case "Last 7 days":
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= sevenDaysAgo && transactionDate <= today;
                });

            case "This month":
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                return transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= firstDayOfMonth && transactionDate <= lastDayOfMonth;
                });

            case "Last 3 months":
                const threeMonthsAgo = new Date(today);
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                return transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= threeMonthsAgo && transactionDate <= today;
                });

            default:
                return transactions;
        }
    };

    const applyDateRangeFilter = (transactions: any[], dateRange: { from: string; to: string }) => {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= fromDate && transactionDate <= toDate;
        });
    };

    const getDisplayText = (items: string[], limit = 50) => {
        const text = items.join(", ");
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    // Calendar functions
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const formatDate = (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const parseDate = (dateString: string) => {
        if (!dateString) return new Date();
        const parts = dateString.split(' ');
        const months: { [key: string]: number } = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        return new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
    };

    const handleDateSelect = (day: number, isFrom: boolean) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const formattedDate = formatDate(newDate);

        if (isFrom) {
            updateFilter("dateRange", { ...filters.dateRange, from: formattedDate });
            setShowFromCalendar(false);
        } else {
            updateFilter("dateRange", { ...filters.dateRange, to: formattedDate });
            setShowToCalendar(false);
        }
    };

    const changeMonth = (direction: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction));
    };

    const renderCalendar = (isFrom: boolean) => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
        const days = [];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Get the currently selected date for highlighting
        const selectedDateString = isFrom ? filters.dateRange.from : filters.dateRange.to;
        const selectedDate = selectedDateString ? parseDate(selectedDateString) : null;

        // Add empty cells for days before the first day of month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = selectedDate &&
                dayDate.getDate() === selectedDate.getDate() &&
                dayDate.getMonth() === selectedDate.getMonth() &&
                dayDate.getFullYear() === selectedDate.getFullYear();

            days.push(
                <div
                    key={day}
                    className={`${styles.calendarDay} ${isSelected ? styles.selectedDay : ''}`}
                    onClick={() => handleDateSelect(day, isFrom)}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className={styles.calendar}>
                <div className={styles.calendarHeader}>
                    <button onClick={() => changeMonth(-1)} className={styles.calendarNavBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <span className={styles.calendarMonth}>
                        {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
                    </span>
                    <button onClick={() => changeMonth(1)} className={styles.calendarNavBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                <div className={styles.calendarWeekdays}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className={styles.weekday}>{day}</div>
                    ))}
                </div>

                <div className={styles.calendarGrid}>
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Filter</h2>
                <button onClick={onClose} className={styles.closeBtn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className={styles.quickFilters}>
                {quickFilters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => handleQuickFilter(filter)}
                        className={`${styles.quickFilterBtn} ${filters.quickFilter === filter ? styles.active : ''}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Date Range</label>
                <div className={styles.dateRow}>
                    <div className={styles.datePickerWrapper}>
                        <button
                            onClick={() => {
                                setShowFromCalendar(!showFromCalendar);
                                setShowToCalendar(false);
                            }}
                            className={`${styles.dateInput} ${showFromCalendar ? styles.activeInput : ''}`}
                        >
                            <span>{filters.dateRange.from || "Select date"}</span>
                            {showFromCalendar ? (
                                <Icon
                                    icon="material-symbols:keyboard-arrow-up-rounded"
                                    width="24"
                                    height="24"
                                />
                            ) : (
                                <Icon
                                    icon="material-symbols:keyboard-arrow-down-rounded"
                                    width="24"
                                    height="24"
                                />
                            )}
                        </button>

                        {showFromCalendar && renderCalendar(true)}
                    </div>

                    <div className={styles.datePickerWrapper}>
                        <button
                            onClick={() => {
                                setShowToCalendar(!showToCalendar);
                                setShowFromCalendar(false);
                            }}
                            className={`${styles.dateInput} ${showToCalendar ? styles.activeInput : ''}`}
                        >
                            <span>{filters.dateRange.to || "Select date"}</span>
                            {showToCalendar ? (
                                <Icon
                                    icon="material-symbols:keyboard-arrow-up-rounded"
                                    width="24"
                                    height="24"
                                />
                            ) : (
                                <Icon
                                    icon="material-symbols:keyboard-arrow-down-rounded"
                                    width="24"
                                    height="24"
                                />
                            )}
                        </button>

                        {showToCalendar && renderCalendar(false)}
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Transaction Type</label>
                <div className={styles.dropdownWrapper}>
                    <button
                        onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                        className={`${styles.selectButton} ${showTypeDropdown ? styles.activeInput : ''}`}
                    >
                        <span className={styles.selectText}>
                            {filters.selectedTypes.length > 0
                                ? getDisplayText(filters.selectedTypes.map(type =>
                                    type === 'deposit' ? 'Deposit' : 'Withdrawal'
                                ))
                                : "Select types"}
                        </span>
                        {showTypeDropdown ? (
                            <Icon
                                icon="material-symbols:keyboard-arrow-up-rounded"
                                width="24"
                                height="24"
                            />
                        ) : (
                            <Icon
                                icon="material-symbols:keyboard-arrow-down-rounded"
                                width="24"
                                height="24"
                            />
                        )}
                    </button>

                    {showTypeDropdown && (
                        <div className={styles.dropdown}>
                            {transactionTypes.map((type) => (
                                <label key={type} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={filters.selectedTypes.includes(type)}
                                        onChange={() => toggleType(type)}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkboxText}>
                                        {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Transaction Status</label>
                <div className={styles.dropdownWrapper}>
                    <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className={`${styles.selectButton} ${showStatusDropdown ? styles.activeInput : ''}`}
                    >
                        <span className={styles.selectText}>
                            {filters.selectedStatuses.length > 0
                                ? getDisplayText(filters.selectedStatuses.map(status =>
                                    status.charAt(0).toUpperCase() + status.slice(1)
                                ))
                                : "Select statuses"}
                        </span>
                        {showStatusDropdown ? (
                            <Icon
                                icon="material-symbols:keyboard-arrow-up-rounded"
                                width="24"
                                height="24"
                            />
                        ) : (
                            <Icon
                                icon="material-symbols:keyboard-arrow-down-rounded"
                                width="24"
                                height="24"
                            />
                        )}
                    </button>

                    {showStatusDropdown && (
                        <div className={styles.dropdown}>
                            {statuses.map((status) => (
                                <label key={status} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={filters.selectedStatuses.includes(status)}
                                        onChange={() => toggleStatus(status)}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkboxText}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.footer}>
                <button onClick={handleClear} className={styles.clearBtn}>
                    Clear
                </button>
                <button onClick={handleApply} className={styles.applyBtn}>
                    Apply
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;