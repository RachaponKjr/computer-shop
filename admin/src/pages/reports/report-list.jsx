import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { Line } from 'react-chartjs-2'; // นำเข้า Line chart
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ลงทะเบียนคอมโพเนนต์ต่างๆ ที่จะใช้ใน Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function ReportList() {
    const currentYear = new Date().getFullYear();
    const [reportType, setReportType] = useState('2');
    const [selectedDateStart, setSelectedDateStart] = useState('');
    const [selectedDateEnd, setSelectedDateEnd] = useState('');
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [reportData, setReportData] = useState(null);
    const [chartData, setChartData] = useState(null); // เก็บข้อมูลกราฟ

    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
        setSelectedDateStart('');
        setSelectedDateEnd('');
        setSelectedYear(currentYear);
        setSelectedMonth('');
        setReportData(null);
        setChartData(null);
    };

    const fetchReportData = async () => {
        try {
            let url = `${backendUrl}/api/sales-history`;

            if (reportType === '1') {
                if (selectedDateStart && selectedDateEnd) {
                    url += `?startDate=${selectedDateStart}&endDate=${selectedDateEnd}`;
                }
            } else if (reportType === '2') {
                if (selectedYear && selectedMonth) {
                    url += `?year=${selectedYear}&month=${selectedMonth}`;
                }
            } else if (reportType === '3') {
                if (selectedYear) {
                    url += `?year=${selectedYear}`;
                }
            }

            const response = await axios.get(url);
            setReportData(response.data);

            const chartLabels = response.data.sale.map(item => item.date);
            const chartValues = response.data.sale.map(item => item.total);

            setChartData({
                labels: chartLabels,
                datasets: [
                    {
                        label: 'ยอดขาย',
                        data: chartValues,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    // ใช้ useEffect เพื่อดึงข้อมูลทุกครั้งที่ค่าต่างๆ เปลี่ยนแปลง
    useEffect(() => {
        if (reportType && (selectedDateStart || selectedDateEnd || selectedYear || selectedMonth)) {
            fetchReportData();
        }
    }, [reportType, selectedDateStart, selectedDateEnd, selectedYear, selectedMonth]);

    return (
        <div className="space-y-4">
            <h4 className="text-2xl font-bold">รายงานการขาย</h4>
            <form>
                <div className="flex flex-col lg:flex-row gap-2 h-max">
                    {/* เลือกประเภทของรายงาน */}
                    <div className="flex gap-2 flex-col items-start h-max">
                        <span className="text-sm text-gray-500">เลือกรูปแบบรายงาน</span>
                        <select
                            defaultValue={reportType}
                            className="border border-gray-300 rounded-md p-2 h-[2.5rem] w-full md:w-auto"
                            value={reportType}
                            onChange={handleReportTypeChange}
                        >
                            <option value="">กรุณาเลือก</option>
                            <option value="2">รายงานการขายรายเดือน</option>
                            <option value="3">รายงานการขายรายปี</option>
                        </select>
                    </div>

                    {reportType === '2' && (
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="flex gap-2 flex-col items-start h-max">
                                <span className="text-sm text-gray-500">เลือกปี</span>
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded-md p-2 h-[2.5rem] w-full lg:w-auto"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    placeholder="พิมพ์ปี"
                                />
                            </div>
                            <div className="flex gap-2 flex-col items-start h-max">
                                <span className="text-sm text-gray-500">เลือกเดือน</span>
                                <select
                                    className="border border-gray-300 rounded-md p-2 h-[2.5rem] w-full lg:w-auto"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value="">กรุณาเลือกเดือน</option>
                                    {["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"].map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {reportType === '3' && (
                        <div className="flex gap-2 flex-col items-start h-max">
                            <span className="text-sm text-gray-500">เลือกปี</span>
                            <input
                                type="number"
                                className="border border-gray-300 rounded-md p-2 h-[2.5rem] w-full lg:w-auto "
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                placeholder="พิมพ์ปี"
                            />
                        </div>
                    )}
                </div>
            </form>

            {/* แสดงกราฟ */}
            {chartData && (
                <div className='flex flex-col lg:flex-row gap-4 w-full'>
                    <div className="mt-4 w-full lg:max-w-[50rem]">
                        <Line data={chartData} options={{ responsive: true }} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className=' w-full lg:w-[15rem]  aspect-video border border-gray-300 rounded-md flex flex-col items-center justify-evenly'>
                            <span className='text-2xl text-gray-500'>ยอดขายรวมทั้งหมด</span>
                            <span className='text-2xl font-bold'>{reportData.sumTotal} บาท</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportList;
