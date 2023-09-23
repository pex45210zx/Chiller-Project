import React from 'react';
import { Line } from 'react-chartjs-2';

function LineChart({ chartData }) {
    return (
        <div>
            <h2>Chiller Data</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time', // Set 'type' to 'time' for the x-axis
                            time: {
                                unit: 'day', // Customize the time unit as needed
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Temperature (°C)', // Customize the y-axis label
                            },
                        },
                    },
                }}
            />
        </div>
    );
}

export default LineChart;
