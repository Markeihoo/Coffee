import React, { useEffect, useState } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState({}); // เก็บสถานะชั่วคราวที่เลือกไว้

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8000/orders/get');
                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลออเดอร์');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, order_status) => {
        try {
            const response = await fetch(`http://localhost:8000/orders/update/${orderId}`, {
                method: 'PATCH', // ใช้ PATCH แทน PUT
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_status }), // ส่ง status ใน request body
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถอัปเดตสถานะออเดอร์');
            }

            const updatedOrder = await response.json(); // สมมุติว่า response ส่งกลับมาเป็นข้อมูลที่อัปเดตแล้ว
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.order_id === updatedOrder.order_id ? updatedOrder : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleStatusChange = (orderId, newStatusValue) => {
        // เก็บสถานะที่เลือกไว้ใน state ใหม่
        setNewStatus((prevStatus) => ({
            ...prevStatus,
            [orderId]: newStatusValue,
        }));
    };

    const handleSave = (orderId) => {
        const status = newStatus[orderId]; // ดึงสถานะที่เลือกมาใช้
        if (status) {
            updateOrderStatus(orderId, status); // เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะ
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">รายการออเดอร์</h1>
            {loading ? (
                <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
            ) : orders.length === 0 ? (
                <p className="text-center text-gray-600">ไม่มีข้อมูลรายการออเดอร์ตอนนี้</p> // แสดงข้อความเมื่อไม่มีข้อมูล
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders
                        .filter((order) => order.order_status == 'กำลังดำเนินการ') // กรองออกจากการแสดงผล
                        .map((order) => (
                            <div
                                key={order.order_id}
                                className="bg-white shadow-md rounded-lg p-6 border border-gray-300"
                            >
                                <h2 className="text-lg font-bold text-gray-700 mb-2">
                                    หมายเลขออเดอร์: {order.order_id}
                                </h2>
                                <p className="text-gray-600">วันที่สั่งซื้อ: {new Date(order.order_date).toLocaleString('th-TH')}</p>
                                <p className="text-gray-600">สถานะ: <span className="text-red-600">{order.order_status}</span></p>

                                <div className="mt-4">
                                    <label className="block text-gray-600 mb-2">เปลี่ยนสถานะออเดอร์:</label>
                                    <select
                                        className="block w-full p-2 border border-gray-300 rounded-md"
                                        value={newStatus[order.order_id] || order.order_status}
                                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                    >
                                        <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                                        <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                                        <option value="ยกเลิก">ยกเลิก</option>
                                    </select>
                                </div>

                                <button
                                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                    onClick={() => handleSave(order.order_id)} // เมื่อกดบันทึก, จะเรียกใช้ handleSave
                                >
                                    บันทึกข้อมูล
                                </button>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
