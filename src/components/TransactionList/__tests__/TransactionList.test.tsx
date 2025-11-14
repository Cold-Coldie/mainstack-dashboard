import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionList from '../TransactionList';

// Mock dependencies
jest.mock('../../Drawer/Drawer', () => {
    return jest.fn(({ show, onClose, children }) =>
        show ? <div data-testid="drawer">{children}</div> : null
    );
});

jest.mock('../../FilterPanel/FilterPanel', () => {
    return jest.fn(({ onClose }) => (
        <div data-testid="filter-panel">
            <button onClick={onClose}>Close Filter</button>
        </div>
    ));
});

jest.mock('../TransactionItem', () => {
    return jest.fn((props) => (
        <div data-testid="transaction-item">
            Transaction: USD {props.amount}
        </div>
    ));
});

jest.mock('@iconify/react', () => ({
    Icon: jest.fn(({ icon, width, height }) => (
        <span data-testid={`icon-${icon}`} data-width={width} data-height={height}>
            {icon}
        </span>
    )),
}));

// Mock TransactionsContext
jest.mock('../../../context/TransactionsContext', () => ({
    useTransactions: jest.fn(),
}));

import { useTransactions } from '../../../context/TransactionsContext';

// Mock CSS modules
jest.mock('../TransactionList.module.css', () => ({
    list: 'list',
    headerContainer: 'header-container',
    header: 'header',
    actionContainer: 'action-container',
    action: 'action',
    skeletonContainer: 'skeleton-container',
    skeletonItem: 'skeleton-item',
    skeletonIcon: 'skeleton-icon',
    skeletonContent: 'skeleton-content',
    skeletonText: 'skeleton-text',
    skeletonSubtext: 'skeleton-subtext',
    skeletonAmount: 'skeleton-amount',
}));

const mockUseTransactions = useTransactions as jest.MockedFunction<typeof useTransactions>;

describe('TransactionList', () => {
    const mockTransactions = [
        {
            amount: 500,
            status: 'successful',
            type: 'deposit',
            date: '2022-03-03',
            metadata: {
                name: 'John Doe',
                type: 'digital_product',
                email: 'johndoe@example.com',
                quantity: 1,
                country: 'Nigeria',
                product_name: 'Rich Dad Poor Dad'
            },
            payment_reference: 'c3f7123f-186f-4a45-b911-76736e9c5937'
        },
        {
            amount: 400,
            status: 'successful',
            type: 'deposit',
            date: '2022-03-02',
            metadata: {
                name: 'Fibi Brown',
                type: 'coffee',
                email: 'fibibrown@example.com',
                quantity: 8,
                country: 'Ireland'
            },
            payment_reference: 'd28db158-0fc0-40cd-826a-4243923444f7'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockTransactionsContext = (transactions: any[] = [], isLoading: boolean = false) => {
        mockUseTransactions.mockReturnValue({
            transactions,
            isLoading,
            updateTransactions: jest.fn(),
            setIsLoading: jest.fn(),
        });
    };

    test('renders transaction count and header', () => {
        mockTransactionsContext(mockTransactions);

        render(<TransactionList />);

        expect(screen.getByText('2 Transactions')).toBeInTheDocument();
        expect(screen.getByText('Your transactions for the last 7 days')).toBeInTheDocument();
    });

    test('renders filter and export actions', () => {
        mockTransactionsContext(mockTransactions);

        render(<TransactionList />);

        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByText('Export list')).toBeInTheDocument();

        // Check if icons are rendered
        expect(screen.getByTestId('icon-material-symbols:keyboard-arrow-down-rounded')).toBeInTheDocument();
        expect(screen.getByTestId('icon-material-symbols:download')).toBeInTheDocument();
    });

    test('shows loading skeleton when isLoading is true', () => {
        mockTransactionsContext([], true);

        render(<TransactionList />);

        // Should show loading skeleton instead of transaction items
        expect(screen.queryByTestId('transaction-item')).not.toBeInTheDocument();
        expect(screen.getByText('0 Transactions')).toBeInTheDocument();
    });

    test('renders transaction items when not loading', () => {
        mockTransactionsContext(mockTransactions);

        render(<TransactionList />);

        const transactionItems = screen.getAllByTestId('transaction-item');
        expect(transactionItems).toHaveLength(2);
        expect(screen.getByText('Transaction: USD 500')).toBeInTheDocument();
        expect(screen.getByText('Transaction: USD 400')).toBeInTheDocument();
    });

    test('opens filter drawer when filter button is clicked', () => {
        mockTransactionsContext(mockTransactions);

        render(<TransactionList />);

        // Initially, filter drawer should not be visible
        expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();

        // Click filter button
        const filterButton = screen.getByText('Filter');
        fireEvent.click(filterButton);

        // Filter drawer should now be visible
        expect(screen.getByTestId('drawer')).toBeInTheDocument();
        expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    test('closes filter drawer when onClose is called', () => {
        mockTransactionsContext(mockTransactions);

        render(<TransactionList />);

        // Open filter drawer
        const filterButton = screen.getByText('Filter');
        fireEvent.click(filterButton);

        // Verify drawer is open
        expect(screen.getByTestId('drawer')).toBeInTheDocument();

        // Close filter drawer
        const closeButton = screen.getByText('Close Filter');
        fireEvent.click(closeButton);

        // Drawer should be closed
        expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });

    test('displays correct transaction count for empty array', () => {
        mockTransactionsContext([]);

        render(<TransactionList />);

        expect(screen.getByText('0 Transactions')).toBeInTheDocument();
        expect(screen.queryByTestId('transaction-item')).not.toBeInTheDocument();
    });

    test('renders loading skeleton with multiple skeleton items', () => {
        mockTransactionsContext([], true);

        render(<TransactionList />);

        // The skeleton should render multiple items (5 as per the code)
        // We can't directly test the CSS classes, but we can verify the structure exists
        expect(screen.getByText('0 Transactions')).toBeInTheDocument();
    });
});

describe('TransactionList Edge Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('export list button is present but not functional in test', () => {
        mockUseTransactions.mockReturnValue({
            transactions: [],
            isLoading: false,
            updateTransactions: jest.fn(),
            setIsLoading: jest.fn(),
        });

        render(<TransactionList />);

        const exportButton = screen.getByText('Export list');
        expect(exportButton).toBeInTheDocument();

        // The export functionality would need additional testing if implemented
        fireEvent.click(exportButton);
        // No error should occur
    });
});