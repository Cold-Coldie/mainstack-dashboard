import React from 'react';
import { render, screen } from '@testing-library/react';
import BalanceCard from '../BalanceCard';

// Mock CSS modules
jest.mock('../BalanceCard.module.css', () => ({
    card: 'card',
    label: 'label',
    amount: 'amount',
    button: 'button',
    disabledButton: 'disabledButton',
}));

// Mock WalletContext
jest.mock('../../../context/WalletContext', () => ({
    useWallet: jest.fn(),
}));

// Import after mocking
import { useWallet } from '../../../context/WalletContext';

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('BalanceCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders available balance label', () => {
        mockUseWallet.mockReturnValue({
            wallet: { balance: 120000.50 } as any,
            isLoading: false,
            updateWallet: jest.fn(),
        } as any);

        render(<BalanceCard />);
        expect(screen.getByText('Available Balance')).toBeInTheDocument();
    });

    test('displays formatted balance when not loading', () => {
        mockUseWallet.mockReturnValue({
            wallet: { balance: 120000.50 } as any,
            isLoading: false,
            updateWallet: jest.fn(),
        } as any);

        render(<BalanceCard />);
        expect(screen.getByText('USD 120,000.5')).toBeInTheDocument();
    });

    test('displays loading state when isLoading is true', () => {
        mockUseWallet.mockReturnValue({
            wallet: { balance: 0 } as any,
            isLoading: true,
            updateWallet: jest.fn(),
        } as any);

        render(<BalanceCard />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('withdraw button is enabled when not loading', () => {
        mockUseWallet.mockReturnValue({
            wallet: { balance: 1000 } as any,
            isLoading: false,
            updateWallet: jest.fn(),
        } as any);

        render(<BalanceCard />);
        const withdrawButton = screen.getByRole('button', { name: /withdraw/i });
        expect(withdrawButton).toBeEnabled();
    });

    test('withdraw button is disabled when loading', () => {
        mockUseWallet.mockReturnValue({
            wallet: { balance: 1000 } as any,
            isLoading: true,
            updateWallet: jest.fn(),
        } as any);

        render(<BalanceCard />);
        const withdrawButton = screen.getByRole('button', { name: /withdraw/i });
        expect(withdrawButton).toBeDisabled();
    });
});