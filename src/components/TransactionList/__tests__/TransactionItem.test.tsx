import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionItem from '../TransactionItem';
import { I_Transactions } from '../../../context/TransactionsContext';

// Mock @iconify/react
jest.mock('@iconify/react', () => ({
    Icon: jest.fn(({ icon, width, height }) => (
        <span data-testid={`icon-${icon}`} data-width={width} data-height={height}>
            {icon}
        </span>
    )),
}));

// Mock CSS modules
jest.mock('./TransactionItem.module.css', () => ({
    item: 'item',
    left: 'left',
    right: 'right',
    icon: 'icon',
    title: 'title',
    name: 'name',
    amount: 'amount',
    date: 'date',
}));

describe('TransactionItem', () => {
    const defaultProps: I_Transactions = {
        amount: 500,
        date: '2022-03-03',
        type: 'deposit',
        status: 'successful',
        metadata: {
            name: 'John Doe',
            product_name: 'Rich Dad Poor Dad'
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders deposit transaction with product name', () => {
        render(<TransactionItem {...defaultProps} />);

        expect(screen.getByText('Rich Dad Poor Dad')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('USD 500')).toBeInTheDocument();
        expect(screen.getByText('Mar 03, 2022')).toBeInTheDocument();
    });

    test('renders deposit transaction with default title when no product name', () => {
        const propsWithoutProduct: I_Transactions = {
            ...defaultProps,
            metadata: {
                name: 'John Doe',
                // No product_name
            },
        };

        render(<TransactionItem {...propsWithoutProduct} />);

        expect(screen.getByText('Cash deposit')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('renders withdrawal transaction', () => {
        const withdrawalProps: I_Transactions = {
            ...defaultProps,
            type: 'withdrawal',
            status: 'successful',
            metadata: undefined, // Withdrawal might not have metadata
        };

        render(<TransactionItem {...withdrawalProps} />);

        expect(screen.getByText('Cash withdrawal')).toBeInTheDocument();
        expect(screen.getByText('successful')).toBeInTheDocument();
        expect(screen.getByText('USD 500')).toBeInTheDocument();
    });

    test('displays correct icon for deposit', () => {
        render(<TransactionItem {...defaultProps} />);

        const depositIcon = screen.getByTestId('icon-fluent:arrow-down-left-24-filled');
        expect(depositIcon).toBeInTheDocument();
        expect(depositIcon).toHaveAttribute('data-width', '11.5');
        expect(depositIcon).toHaveAttribute('data-height', '11.5');
    });

    test('displays correct icon for withdrawal', () => {
        const withdrawalProps: I_Transactions = {
            ...defaultProps,
            type: 'withdrawal',
        };

        render(<TransactionItem {...withdrawalProps} />);

        const withdrawalIcon = screen.getByTestId('icon-fluent:arrow-up-right-24-filled');
        expect(withdrawalIcon).toBeInTheDocument();
        expect(withdrawalIcon).toHaveAttribute('data-width', '11.5');
        expect(withdrawalIcon).toHaveAttribute('data-height', '11.5');
    });

    test('formats amount with commas for large numbers', () => {
        const largeAmountProps: I_Transactions = {
            ...defaultProps,
            amount: 1234567.89,
        };

        render(<TransactionItem {...largeAmountProps} />);

        expect(screen.getByText('USD 1,234,567.89')).toBeInTheDocument();
    });

    test('formats date correctly', () => {
        const differentDateProps: I_Transactions = {
            ...defaultProps,
            date: '2023-12-25',
        };

        render(<TransactionItem {...differentDateProps} />);

        expect(screen.getByText('Dec 25, 2023')).toBeInTheDocument();
    });

    test('handles different status colors for withdrawal', () => {
        const pendingWithdrawalProps: I_Transactions = {
            ...defaultProps,
            type: 'withdrawal',
            status: 'pending',
        };

        const failedWithdrawalProps: I_Transactions = {
            ...defaultProps,
            type: 'withdrawal',
            status: 'failed',
        };

        const { rerender } = render(<TransactionItem {...pendingWithdrawalProps} />);

        const statusElement = screen.getByText('pending');
        expect(statusElement).toHaveStyle({ color: '#A77A07' });

        rerender(<TransactionItem {...failedWithdrawalProps} />);
        expect(statusElement).toHaveStyle({ color: '#A77A07' }); // Both pending and failed use same color
    });

    test('applies correct background color for deposit icon', () => {
        render(<TransactionItem {...defaultProps} />);

        const iconContainer = screen.getByTestId('icon-fluent:arrow-down-left-24-filled').parentElement;
        expect(iconContainer).toHaveStyle({ backgroundColor: '#E3FCF2' });
    });

    test('applies correct background color for withdrawal icon', () => {
        const withdrawalProps: I_Transactions = {
            ...defaultProps,
            type: 'withdrawal',
        };

        render(<TransactionItem {...withdrawalProps} />);

        const iconContainer = screen.getByTestId('icon-fluent:arrow-up-right-24-filled').parentElement;
        expect(iconContainer).toHaveStyle({ backgroundColor: '#F9E3E0' });
    });

    test('handles deposit with no metadata', () => {
        const noMetadataProps: I_Transactions = {
            amount: 500,
            date: '2022-03-03',
            type: 'deposit',
            status: 'successful',
            // No metadata at all
        };

        render(<TransactionItem {...noMetadataProps} />);

        expect(screen.getByText('Cash deposit')).toBeInTheDocument();
        // Should not crash when metadata is undefined
        expect(screen.getByText('USD 500')).toBeInTheDocument();
    });

    test('handles withdrawal with metadata (edge case)', () => {
        const withdrawalWithMetadata: I_Transactions = {
            ...defaultProps,
            type: 'withdrawal',
            status: 'successful',
        };

        render(<TransactionItem {...withdrawalWithMetadata} />);

        // For withdrawal, metadata name should not be displayed, only status
        expect(screen.getByText('Cash withdrawal')).toBeInTheDocument();
        expect(screen.getByText('successful')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    test('handles zero amount', () => {
        const zeroAmountProps: I_Transactions = {
            ...defaultProps,
            amount: 0,
        };

        render(<TransactionItem {...zeroAmountProps} />);

        expect(screen.getByText('USD 0')).toBeInTheDocument();
    });

    test('handles negative amount (edge case)', () => {
        const negativeAmountProps: I_Transactions = {
            ...defaultProps,
            amount: -100,
        };

        render(<TransactionItem {...negativeAmountProps} />);

        expect(screen.getByText('USD -100')).toBeInTheDocument();
    });

    test('formats date for different locales correctly', () => {
        const dates = [
            { input: '2022-01-01', expected: 'Jan 01, 2022' },
            { input: '2022-12-31', expected: 'Dec 31, 2022' },
            { input: '2023-06-15', expected: 'Jun 15, 2023' },
        ];

        dates.forEach(({ input, expected }) => {
            const dateProps: I_Transactions = {
                ...defaultProps,
                date: input,
            };

            const { unmount } = render(<TransactionItem {...dateProps} />);
            expect(screen.getByText(expected)).toBeInTheDocument();
            unmount();
        });
    });

    test('handles different metadata structures', () => {
        const minimalMetadataProps: I_Transactions = {
            ...defaultProps,
            metadata: {
                name: 'Minimal User',
                // No other fields
            },
        };

        render(<TransactionItem {...minimalMetadataProps} />);

        expect(screen.getByText('Cash deposit')).toBeInTheDocument();
        expect(screen.getByText('Minimal User')).toBeInTheDocument();
    });
});

describe('TransactionItem Status Colors', () => {
    test('successful status has correct color for withdrawal', () => {
        const props: I_Transactions = {
            amount: 500,
            date: '2022-03-03',
            type: 'withdrawal',
            status: 'successful',
        };

        render(<TransactionItem {...props} />);

        const statusElement = screen.getByText('successful');
        expect(statusElement).toHaveStyle({ color: '#0EA163' });
    });

    test('pending status has correct color for withdrawal', () => {
        const props: I_Transactions = {
            amount: 500,
            date: '2022-03-03',
            type: 'withdrawal',
            status: 'pending',
        };

        render(<TransactionItem {...props} />);

        const statusElement = screen.getByText('pending');
        expect(statusElement).toHaveStyle({ color: '#A77A07' });
    });

    test('failed status has correct color for withdrawal', () => {
        const props: I_Transactions = {
            amount: 500,
            date: '2022-03-03',
            type: 'withdrawal',
            status: 'failed',
        };

        render(<TransactionItem {...props} />);

        const statusElement = screen.getByText('failed');
        expect(statusElement).toHaveStyle({ color: '#A77A07' });
    });
});