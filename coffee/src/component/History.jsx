import React, { useEffect, useState } from 'react';

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true); // เพิ่มสถานะ loading

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await fetch('http://localhost:8000/payment/get');
                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลการชำระเงิน');
                }
                const data = await response.json();
                console.log('Fetched Data:', data); // ตรวจสอบข้อมูลจาก API
                setPaymentHistory(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false); // ปิดสถานะ loading
            }
        };

        fetchPaymentHistory();
    }, []);

    // ฟังก์ชันแปลงวันที่ให้สามารถแสดงได้อย่างถูกต้อง
    const formatDate = (dateString) => {
        if (!dateString) return 'ไม่พบวันที่'; // จัดการกรณีที่ไม่มีค่า
        const date = new Date(dateString);
        return date.toString() === 'Invalid Date' ? 'ไม่พบวันที่' : date.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 ">
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">ประวัติการชำระเงิน</h1>
            <h3 className='mt-[-20px] mb-5'>การชำระเงินทั้งหมด <span className="text-blue-600">{paymentHistory.length}</span> รายการ</h3>
            {loading ? (
                <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
            ) : paymentHistory.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border border-gray-300">หมายเลขการชำระเงิน</th>
                            <th className="px-4 py-2 border border-gray-300">วันที่ชำระเงิน</th>
                            <th className="px-4 py-2 border border-gray-300">วิธีการชำระเงิน</th>
                            <th className="px-4 py-2 border border-gray-300">ชื่อลูกค้า</th>
                            <th className="px-4 py-2 border border-gray-300">เบอร์โทรลูกค้า</th>
                            <th className="px-4 py-2 border border-gray-300">จำนวนเงินทั้งหมด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment,index) => (
                            <tr key={payment.payment_id}>
                                <td className="px-4 py-2 border border-gray-300 w-1">{index + 1}</td>
                                <td className="px-4 py-2 border border-gray-300 w-2">{formatDate(payment.payment_date)}</td>
                                <td className="px-4 py-2 border border-gray-300">{payment.payment_method}</td>
                                <td className="px-4 py-2 border border-gray-300">{payment.customer_name}</td>
                                <td className="px-4 py-2 border border-gray-300">{payment.customer_tel}</td>
                                <td className="px-4 py-2 border border-gray-300">{parseFloat(payment.total_amount).toFixed(2)} ฿</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">ไม่มีข้อมูลการชำระเงิน</p>
            )}
        </div>
    );
};

export default PaymentHistory;
