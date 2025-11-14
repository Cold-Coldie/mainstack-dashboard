import React from 'react';
import { render, screen } from '@testing-library/react';
import Chart from '../Chart';

// Mock Chart.js and react-chartjs-2
jest.mock('react-chartjs-2', () => ({
    Line: jest.fn(() => null),
}));

// Mock Chart.js library
jest.mock('chart.js', () => ({
    Chart: {
        register: jest.fn(),
    },
    LineElement: jest.fn(),
    CategoryScale: jest.fn(),
    LinearScale: jest.fn(),
    PointElement: jest.fn(),
    Tooltip: jest.fn(),
}));

// Mock CSS modules
jest.mock('../Chart.module.css', () => ({
    chart: 'chart',
    loading: 'loading',
}));

// Mock TransactionsContext
jest.mock('../../../context/TransactionsContext', () => ({
    useTransactions: jest.fn(),
}));

import { useTransactions } from '../../../context/TransactionsContext';
import { Line } from 'react-chartjs-2';

const mockUseTransactions = useTransactions as jest.MockedFunction<typeof useTransactions>;
const MockLine = Line as jest.MockedFunction<typeof Line>;

describe('Chart', () => {
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
        },
        {
            amount: 300,
            status: 'pending',
            type: 'deposit',
            date: '2022-03-01'
        },
        {
            amount: 300,
            status: 'successful',
            type: 'withdrawal',
            date: '2022-03-01'
        },
        {
            amount: 200,
            status: 'failed',
            type: 'deposit',
            date: '2022-02-28'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        MockLine.mockClear();
    });

    const mockTransactionsContext = (transactions: any[] = [], isLoading: boolean = false) => {
        mockUseTransactions.mockReturnValue({
            transactions,
            isLoading,
            updateTransactions: jest.fn(),
            setIsLoading: jest.fn(),
        });
    };

    test('renders loading state when isLoading is true', () => {
        mockTransactionsContext([], true);

        render(<Chart />);

        expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
        expect(MockLine).not.toHaveBeenCalled();
    });

    test('processes and displays chart data with successful deposits only', () => {
        mockTransactionsContext(mockTransactions);

        render(<Chart />);

        expect(MockLine).toHaveBeenCalled();

        const callArgs = MockLine.mock.calls[0][0];
        const chartData = callArgs.data;

        // Should only include successful deposits
        expect(chartData.datasets[0].data).toHaveLength(2); // Only 2 successful deposits
        expect(chartData.labels).toHaveLength(2);

        // Check that the data is properly formatted
        expect(chartData.datasets[0].label).toBe('Revenue');
        expect(chartData.datasets[0].borderColor).toBe('#FF5403');
        expect(chartData.datasets[0].tension).toBe(0.4);
    });

    test('filters out non-deposit and non-successful transactions', () => {
        const mixedTransactions = [
            {
                amount: 500,
                status: 'successful',
                type: 'deposit',
                date: '2022-03-03'
            },
            {
                amount: 300,
                status: 'successful',
                type: 'withdrawal', // Should be filtered out
                date: '2022-03-02'
            },
            {
                amount: 200,
                status: 'pending', // Should be filtered out
                type: 'deposit',
                date: '2022-03-01'
            },
            {
                amount: 100,
                status: 'failed', // Should be filtered out
                type: 'deposit',
                date: '2022-02-28'
            }
        ];

        mockTransactionsContext(mixedTransactions);

        render(<Chart />);

        const callArgs = MockLine.mock.calls[0][0];
        const chartData = callArgs.data;

        // Should only have one data point (the successful deposit)
        expect(chartData.datasets[0].data).toEqual([500]);
        expect(chartData.labels).toHaveLength(1);
    });

    test('groups transactions by date and sums amounts', () => {
        const sameDateTransactions = [
            {
                amount: 500,
                status: 'successful',
                type: 'deposit',
                date: '2022-03-03'
            },
            {
                amount: 300,
                status: 'successful',
                type: 'deposit',
                date: '2022-03-03' // Same date
            },
            {
                amount: 200,
                status: 'successful',
                type: 'deposit',
                date: '2022-03-02'
            }
        ];

        mockTransactionsContext(sameDateTransactions);

        render(<Chart />);

        const callArgs = MockLine.mock.calls[0][0];
        const chartData = callArgs.data;

        // Should sum amounts for same date
        expect(chartData.datasets[0].data).toEqual([200, 800]); // 500 + 300 = 800 for 2022-03-03
        expect(chartData.labels).toHaveLength(2);
    });

    test('sorts transactions by date', () => {
        const unsortedTransactions = [
            {
                amount: 500,
                status: 'successful',
                type: 'deposit',
                date: '2022-03-03'
            },
            {
                amount: 200,
                status: 'successful',
                type: 'deposit',
                date: '2022-03-01'
            },
            {
                amount: 300,
                status: 'successful',
                type: 'deposit',
                date: '2022-03-02'
            }
        ];

        mockTransactionsContext(unsortedTransactions);

        render(<Chart />);

        const callArgs = MockLine.mock.calls[0][0];
        const chartData = callArgs.data;

        // Should be sorted by date
        expect(chartData.datasets[0].data).toEqual([200, 300, 500]);
    });

    test('passes correct chart options', () => {
        mockTransactionsContext(mockTransactions);

        render(<Chart />);

        const callArgs = MockLine.mock.calls[0][0];
        const options = callArgs.options;

        expect(options).toEqual(expect.objectContaining({
            responsive: true,
            maintainAspectRatio: false,
            plugins: expect.objectContaining({
                legend: { display: false },
                tooltip: expect.objectContaining({
                    backgroundColor: '#FFFFFF',
                    displayColors: false,
                })
            }),
            scales: expect.objectContaining({
                x: expect.objectContaining({
                    grid: { display: false }
                }),
                y: expect.objectContaining({
                    display: false,
                    grid: { display: false }
                })
            })
        }));
    });

    test('applies correct styling to chart dataset', () => {
        mockTransactionsContext(mockTransactions);

        render(<Chart />);

        const callArgs = MockLine.mock.calls[0][0];
        const chartData = callArgs.data;

        expect(chartData.datasets[0]).toEqual(expect.objectContaining({
            label: 'Revenue',
            fill: false,
            borderColor: '#FF5403',
            tension: 0.4,
            pointBackgroundColor: '#FF5403',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
        }));
    });
});