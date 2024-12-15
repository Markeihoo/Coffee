// import React, { useEffect, useState } from 'react';

// const PaymentHistory = () => {
//     const [paymentHistory, setPaymentHistory] = useState([]);
//     const [loading, setLoading] = useState(true); // เพิ่มสถานะ loading

//     useEffect(() => {
//         const fetchPaymentHistory = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/payment/get');
//                 if (!response.ok) {
//                     throw new Error('ไม่สามารถดึงข้อมูลการชำระเงิน');
//                 }
//                 const data = await response.json();
//                 console.log('Fetched Data:', data); // ตรวจสอบข้อมูลจาก API
//                 setPaymentHistory(data);
//             } catch (error) {
//                 console.error('Error:', error);
//             } finally {
//                 setLoading(false); // ปิดสถานะ loading
//             }
//         };

//         fetchPaymentHistory();
//     }, []);

//     // ฟังก์ชันแปลงวันที่ให้สามารถแสดงได้อย่างถูกต้อง
//     const formatDate = (dateString) => {
//         if (!dateString) return 'ไม่พบวันที่'; // จัดการกรณีที่ไม่มีค่า
//         const date = new Date(dateString);
//         return date.toString() === 'Invalid Date' ? 'ไม่พบวันที่' : date.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
//     };

//     return (
//         <div className="container mx-auto p-6 bg-gray-50 ">
//             <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">ประวัติการชำระเงิน</h1>
//             <h3 className='mt-[-20px] mb-5'>การชำระเงินทั้งหมด <span className="text-blue-600">{paymentHistory.length}</span> รายการ</h3>
//             {loading ? (
//                 <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
//             ) : paymentHistory.length > 0 ? (
//                 <table className="table-auto w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="px-4 py-2 border border-gray-300">หมายเลขการชำระเงิน</th>
//                             <th className="px-4 py-2 border border-gray-300">วันที่ชำระเงิน</th>
//                             <th className="px-4 py-2 border border-gray-300">วิธีการชำระเงิน</th>
//                             <th className="px-4 py-2 border border-gray-300">ชื่อลูกค้า</th>
//                             <th className="px-4 py-2 border border-gray-300">เบอร์โทรลูกค้า</th>
//                             <th className="px-4 py-2 border border-gray-300">จำนวนเงินทั้งหมด</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {paymentHistory.map((payment,index) => (
//                             <tr key={payment.payment_id}>
//                                 <td className="px-4 py-2 border border-gray-300 w-1">{index + 1}</td>
//                                 <td className="px-4 py-2 border border-gray-300 w-2">{formatDate(payment.payment_date)}</td>
//                                 <td className="px-4 py-2 border border-gray-300">{payment.payment_method}</td>
//                                 <td className="px-4 py-2 border border-gray-300">{payment.customer_name}</td>
//                                 <td className="px-4 py-2 border border-gray-300">{payment.customer_tel}</td>
//                                 <td className="px-4 py-2 border border-gray-300">{parseFloat(payment.total_amount).toFixed(2)} ฿</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p className="text-center text-gray-600">ไม่มีข้อมูลการชำระเงิน</p>
//             )}
//         </div>
//     );
// };

// export default PaymentHistory;
import React, { useEffect, useState } from 'react';

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await fetch('http://localhost:8000/payment/get');
                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลการชำระเงิน');
                }
                const data = await response.json();
                console.log('Fetched Data:', data);
                setPaymentHistory(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'ไม่พบวันที่';
        const date = new Date(dateString);
        return date.toString() === 'Invalid Date' ? 'ไม่พบวันที่' : date.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
    const displayedPayments = paymentHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container mx-auto p-6 bg-gray-50">
    <h1 className="text-center text-3xl font-bold text-gray-800 mb-4">ประวัติการชำระเงิน</h1>
    <h3 className="mt-[-10px] mb-4">การชำระเงินทั้งหมด <span className="text-blue-600">{paymentHistory.length}</span> รายการ</h3>
    <div className="flex justify-between items-center mb-4">
        <div>
            <label htmlFor="itemsPerPage" className="mr-2">แสดง:</label>
            <select
                id="itemsPerPage"
                className="border px-2 py-1"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
            </select>
            <span className="ml-2">รายการต่อหน้า</span>
        </div>
        <div>
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border bg-gray-200 text-gray-700 disabled:opacity-50"
            >
                ก่อนหน้า
            </button>
            <span className="mx-2">{currentPage} / {totalPages}</span>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border bg-gray-200 text-gray-700 disabled:opacity-50"
            >
                ถัดไป
            </button>
        </div>
    </div>
    {loading ? (
        <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
    ) : paymentHistory.length > 0 ? (
        <div className="overflow-y-auto max-h-[500px] border border-gray-300 rounded">
            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border border-gray-300">ลำดับ</th>
                        <th className="px-4 py-2 border border-gray-300">วันที่ชำระเงิน</th>
                        <th className="px-4 py-2 border border-gray-300">วิธีการชำระเงิน</th>
                        <th className="px-4 py-2 border border-gray-300">ชื่อลูกค้า</th>
                        <th className="px-4 py-2 border border-gray-300">เบอร์โทรลูกค้า</th>
                        <th className="px-4 py-2 border border-gray-300">จำนวนเงินทั้งหมด</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedPayments.map((payment, index) => (
                        <tr key={payment.payment_id}>
                            <td className="px-4 py-2 border border-gray-300 w-1">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td className="px-4 py-2 border border-gray-300 w-2">{formatDate(payment.payment_date)}</td>
                            <td className="px-4 py-2 border border-gray-300">{payment.payment_method}</td>
                            <td className="px-4 py-2 border border-gray-300">{payment.customer_name}</td>
                            <td className="px-4 py-2 border border-gray-300">{payment.customer_tel}</td>
                            <td className="px-4 py-2 border border-gray-300">{parseFloat(payment.total_amount).toFixed(2)} ฿</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <p className="text-center text-gray-600">ไม่มีข้อมูลการชำระเงิน</p>
    )}
</div>

    );
};

export default PaymentHistory;
