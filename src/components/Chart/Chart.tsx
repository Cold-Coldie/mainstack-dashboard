import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./Chart.module.css";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import { useTransactions } from "../../context/TransactionsContext";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const Chart = () => {
    const { isLoading, transactions } = useTransactions();

    // Process transaction data for the chart
    const processChartData = () => {
        if (!transactions || transactions.length === 0) {
            return {
                labels: [],
                datasets: [
                    {
                        label: "Revenue",
                        data: [],
                        fill: false,
                        borderColor: "#FF5403",
                        tension: 0.4,
                    },
                ],
            };
        }

        // Filter only successful deposits and sort by date
        const deposits = transactions
            .filter(tx => tx.type === "deposit" && tx.status === "successful")
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Group by date and sum amounts
        const dailyRevenue: { [key: string]: number } = {};
        deposits.forEach(tx => {
            const date = tx.date;
            const amount = Number(tx.amount) || 0; // Ensure it's a number
            dailyRevenue[date] = (dailyRevenue[date] || 0) + amount;
        });

        // Convert to arrays for chart
        const labels = Object.keys(dailyRevenue).map(date =>
            new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            })
        );

        const data = Object.values(dailyRevenue);

        return {
            labels,
            datasets: [
                {
                    label: "Revenue",
                    data,
                    fill: false,
                    borderColor: "#FF5403",
                    tension: 0.4,
                    pointBackgroundColor: "#FF5403",
                    pointBorderColor: "#FFFFFF",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                },
            ],
        };
    };

    const data = processChartData();

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#FFFFFF',
                titleColor: '#000000',
                bodyColor: '#000000',
                borderColor: '#E5E5E5',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return `$${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                }
            },
            y: {
                display: false,
                grid: { display: false }
            },
        },
        maintainAspectRatio: false,
    };

    if (isLoading) {
        return (
            <div className={styles.chart}>
                <div className={styles.loading}>Loading chart data...</div>
            </div>
        );
    }

    return (
        <div className={styles.chart}>
            <Line data={data} options={options} />
        </div>
    );
}

export default Chart;