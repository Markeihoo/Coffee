import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog'; 

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);  

  // ดึงข้อมูลลูกค้าทั้งหมด
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8000/customer/get');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);
 // ฟังก์ชันเมื่อเลือกลูกค้าที่ต้องการ
  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
  };

  // ฟังก์ชันกรองข้อมูลลูกค้าตามคำค้นหา
  const filterCustomers = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = customers.filter((customer) => {
      return (
        customer.customer_id.toString().includes(lowercasedQuery) ||
        customer.customer_name.toLowerCase().includes(lowercasedQuery) ||
        customer.customer_tel.includes(lowercasedQuery)
      );
    });
    setFilteredCustomers(filtered);
  };

  // ฟังก์ชันค้นหาผ่านปุ่มหรือเมื่อกด Enter
  const handleSearch = (event) => {
    event.preventDefault();
    filterCustomers(searchQuery);
  };

  // ฟังก์ชันเมื่อกดปุ่ม "บันทึก"
  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedCustomer) return; 

    const { customer_id, customer_name, customer_tel } = selectedCustomer;

    if (!customer_name || !customer_tel) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`http://localhost:8000/customer/update/${customer_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Customer_name: customer_name,
          Customer_tel: customer_tel,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // อัปเดตข้อมูลลูกค้าใน state หลังจากบันทึกสำเร็จ
        const updatedCustomers = customers.map((customer) =>
          customer.customer_id === customer_id ? data : customer
        );
        setCustomers(updatedCustomers);
        setFilteredCustomers(updatedCustomers);
        setSelectedCustomer(null); 
        alert("ข้อมูลลูกค้าถูกอัปเดตเรียบร้อยแล้ว");
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-center text-xl">กำลังโหลด...</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">ข้อมูลลูกค้า</h2>
          <p className="text-lg mb-4">จำนวนลูกค้าทั้งหมด <span className="text-blue-500">{customers.length}</span> คน</p>

          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="ค้นหาข้อมูลด้วย ID, ชื่อ, เบอร์โทร"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e);
                }
              }}
              className="px-3 py-1 border border-gray-300 rounded-md w-1/4"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              ค้นหา
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="px-6 py-3 border-b">ID</th>
                  <th className="px-6 py-3 border-b">ชื่อ</th>
                  <th className="px-6 py-3 border-b">เบอร์โทร</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.customer_id}
                    onClick={() => handleRowClick(customer)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 border-b">{customer.customer_id}</td>
                    <td className="px-6 py-3 border-b">{customer.customer_name}</td>
                    <td className="px-6 py-3 border-b">{customer.customer_tel}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>



          {/* Dialog แก้ไขข้อมูลลูกค้า */}
          <Dialog.Root open={selectedCustomer !== null} onOpenChange={(open) => { if (!open) setSelectedCustomer(null); }}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              <Dialog.Content className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-96 bg-white p-6 rounded-md shadow-lg">
                <Dialog.Close className="absolute top-2 right-2 text-2xl">×</Dialog.Close>
                <h2 className="text-xl mb-4">แก้ไขข้อมูลลูกค้า</h2>

                {selectedCustomer ? (
                  <form className="space-y-4" onSubmit={handleSave}>
                    <div>
                      <label className="block text-sm font-medium">ID</label>
                      <input
                        type="text"
                        disabled
                        value={selectedCustomer.customer_id}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">ชื่อ</label>
                      <input
                        type="text"
                        value={selectedCustomer.customer_name}
                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customer_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">เบอร์โทร</label>
                      <input
                        type="text"
                        value={selectedCustomer.customer_tel}
                        length={10}
                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customer_tel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
                        onClick={() => setSelectedCustomer(null)}
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        disabled={isSaving}
                      >
                        {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>กรุณาเลือกลูกค้าเพื่อแก้ไขข้อมูล</p>
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      )}
    </div>
  );
};

export default CustomerList;
