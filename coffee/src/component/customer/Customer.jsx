import React, { useState, useEffect } from 'react';
import Select from 'react-select';


const Customer = () => {
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [cartUpdated, setCartUpdated] = useState(false);

    const [showPaymentDialog, setShowPaymentDialog] = useState(false); 
    const [paymentMethod, setPaymentMethod] = useState('เงินสด'); 

    const [employee_id, setEmployee_id] = useState(null);

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [orderdeDiscription, setOrderdeDiscription] = useState('');


    //ดรอปดาวชื่อลูกค้า
    const handleCustomerChange = (selectedOption) => {
        setSelectedCustomer(selectedOption);
    };

    const [order, setOrder] = useState(null);  // state สำหรับเก็บข้อมูลออเดอร์ล่าสุด
    const [refresh, setRefresh] = useState(false); // ตัวแปรสำหรับ trigger การดึงข้อมูลใหม่

    //ดึงข้อมูลออเดอร์ล่าสุด
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch('http://localhost:8000/orders/get/latest');
                if (!response.ok) {
                    throw new Error('Failed to fetch order data');
                }
                const data = await response.json();
                setOrder(data); // อัปเดตข้อมูลออเดอร์
            } catch (err) {
                console.error('Error fetching order data:', err);
            }
        };

        fetchOrder();
    }, [refresh]); // โหลดใหม่ทุกครั้งที่ refresh เปลี่ยนค่า

    //ยืนยันการชำระเงิน ส่งข้อมูลวิธีการชำระเงินของลูกค้า
    const handlePaymentConfirm = async () => {
        if (!paymentMethod || !order?.order_id) {
            alert("กรุณาเลือกวิธีการชำระเงินและตรวจสอบรายการออเดอร์");
            return;
        }

        console.log(`ยืนยันการชำระเงินด้วยวิธี: ${paymentMethod}`);

        // เตรียมข้อมูลที่จะส่งไปยัง backend
        const paymentData = {
            payment_method: paymentMethod, 
            order_id: order.order_id,   
        };

        try {
            // เรียก API เพื่อส่งข้อมูลการชำระเงิน
            const response = await fetch('http://localhost:8000/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData), 
            });

            if (response.ok) {
                const data = await response.json(); // อ่านผลลัพธ์ที่ได้จาก backend
                console.log("การชำระเงินสำเร็จ:", data);

                alert("การชำระเงินสำเร็จ!"); 
                setShowPaymentDialog(false); 
            } else {
                const errorData = await response.json(); 
                console.error("Error confirming payment:", errorData);
                alert("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
            }
        } catch (error) {
            console.error("Error while confirming payment:", error);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
    };

    //ดึงข้อมูลลูกค้าทั้งหมดจะเอาไว้ในดรอปดาว
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:8000/customer/get');
                if (!response.ok) {
                    throw new Error('Failed to fetch customer data');
                }
                const data = await response.json();
                const customerOptions = data.map(customer => ({
                    value: customer.customer_id,
                    label: customer.customer_name,  
                }));
                setCustomers(customerOptions);
                if (customerOptions.length > 0) {
                    setSelectedCustomer(customerOptions[0]);  
                }
            } catch (err) {
                console.error('Error fetching customer data:', err);
            }
        };

        fetchCustomers();
    }, []);

    //ดึงข้อมูลประเภทสินค้าทั้งหมด
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/category/get');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0].category_id); // Select the first category by default
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    //ดึงข้อมูลสินค้าตามประเภทที่เลือก
    useEffect(() => {
        if (selectedCategory) {
            const fetchProducts = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/product/get/${selectedCategory}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch products');
                    }
                    const data = await response.json();
                    setProducts(data);
                    setFilteredProducts(data); // Set the full product list for filtering
                } catch (err) {
                    console.error("Error fetching products:", err);
                }
            };
            fetchProducts();
        }
    }, [selectedCategory]);

    //ฟังก์ชันค้นหา เวลากดปุ่มค้นหาจะแสดงข้อมูลที่ตรงกับคําค้นหา
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value === "") {
            setFilteredProducts(products); 
        } else {
            const filtered = products.filter(product =>
                product.product_name.toLowerCase().includes(event.target.value.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    //ฟังก์ชันเพิ่มสินค้าลงในตะกร้า แสดงตะกร้า และเคลียร์ตะกร้า
    const addToCart = (product) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map(item =>
                item.product_id === product.product_id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ).concat(
                prevCart.some(item => item.product_id === product.product_id)
                    ? []
                    : [{ ...product, quantity: 1 }]
            );
            return updatedCart;
        });

        setCartUpdated(true);
        setShowCart(true);
        setTimeout(() => {
            setShowCart(false);
        }, 20000);
    };

    //ลบสินค้าออกจากตะกร้า
    const removeFromCart = (product_id) => {
        setCart((prevCart) => prevCart.filter(item => item.product_id !== product_id));
    };

    //เคลียร์ตะกร้าให้ว่าง
    const clearCart = () => {
        setCart([]);
    };

    //คํานวณราคารวมโดยการคูณราคาและจํานวน 
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            if (!isNaN(item.product_price) && !isNaN(item.quantity)) {
                return total + item.product_price * item.quantity;
            }
            return total;
        }, 0);
    };

    //ดึงข้อมูลพนักงานของพนักงานที่ล็อคอิน
    const getEmployeeId = async () => {
        try {
            const respoonse = await fetch(`http://localhost:8000/login/employee/${localStorage.getItem('token')}`);
            const data = await respoonse.json();
            setEmployee_id(data.employee_id);

        } catch (error) {
            console.log(error);
        }
    }

    //ดึงข้อมูลพนักงานเมื่อเปิดหน้าเว็บเลย
    useEffect(() => {
        getEmployeeId();
    }, []);

    //ฟังก์ชันสําหรับการสั่งซื้อสินค้า
    const handleCheckout = async () => {
        const orderData = {
            order_date: new Date().toISOString(),  
            order_status: "กำลังดำเนินการ",     
            employee_id: employee_id,             
            customer_id: selectedCustomer.value,  
            orderDetails: cart.map(item => ({
                quantity: item.quantity,
                orderde_discription: orderdeDiscription[item.product_id] === "" ? null : orderdeDiscription[item.product_id] || null, 
                product_id: item.product_id,
            })),
        };

        try {
            const response = await fetch('http://localhost:8000/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setShowPaymentDialog(true);  

                const responseData = await response.json();
                console.log('Order successfully created:', responseData);
                setOrderdeDiscription({});  
                setCart([]); 
                setRefresh((prev) => !prev); 
            } else {
                const errorData = await response.json();
                console.error('Error placing order:', errorData);
            }
        } catch (error) {
            console.error('Error while checking out:', error);
        }
    };


    //ฟังก์ชันสําหรับการแก้ไขคําอธิบายของสินค้าแต่ละรายการ
    const handleDescriptionChange = (productId, value) => {
        setOrderdeDiscription((prev) => ({
            ...prev,
            [productId]: value,
        }));
    };



    return (
        <div className="container mx-auto p-6 bg-gray-50 h-[800px] flex flex-col">
            <h1 className="text-center text-3xl font-bold text-gray-800 ">Customer - Menu Coffee Shop</h1>






            {/* ปุ่มหมวดหมู่ */}
            <div className="categories mt-8 flex justify-center space-x-6">
                {categories.map((category) => (
                    <button
                        key={category.category_id}
                        className="btn bg-yellow-500 text-white hover:bg-yellow-600 p-4 rounded-lg shadow-lg transition duration-200"
                        onClick={() => setSelectedCategory(category.category_id)}
                    >
                        {category.category_name}
                    </button>
                ))}
            </div>





            {/* ค้นหา */}
            <div className="search mt-8 flex justify-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="ค้นหาชื่อเมนู"
                    className="w-1/3 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>






            {/*แสดงสินค้าในหมวดหมู่ที่เลือก */}
            <div className="products mt-8 gap-6 border border-gray-300 rounded-lg p-4 h-full overflow-y-auto">
                {filteredProducts.length === 0 ? (
                    <div className="text-center text-xl text-red-500 font-semibold">
                        ไม่มีสินค้าชื่อ {searchQuery}
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.slice(0, 1000).map((product) => (
                            <li key={product.product_id} className="product flex flex-col items-center p-3 border border-gray-200 rounded-lg shadow-sm w-full">
                                <span className="text-lg font-semibold">
                                    {product.product_name}
                                    <span className="text-sm">
                                        <br />
                                        ราคา <span className="text-red-500">{product.product_price} </span> ฿
                                    </span>
                                </span>
                                <button className="add-btn bg-green-500 text-white hover:bg-green-600 mt-2 p-1 rounded-md transition duration-150"
                                    onClick={() => addToCart(product)}>
                                    เพิ่มลงตะกร้า
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>






            {/* ปุ่มตะกร้า */}
            <button
                onClick={() => setShowCart(!showCart)}
                className="bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition duration-300 absolute top-4 right-4"
            >
                🛒
            </button>






            {/* ตะกร้า */}
            {cartUpdated && (
                <div
                    className={`cart p-4 border border-gray-300 rounded-lg shadow-lg absolute top-16 right-4 bg-white w-72 transition-transform duration-500 ${showCart ? 'transform translate-x-0' : 'transform translate-x-full'}`}
                >
                    <h2 className="text-xl font-semibold text-gray-700">ตะกร้าสินค้า</h2><br />
                    <h3 className="text-lg font-semibold text-gray-700 bg-orange-300">ชื่อลูกค้า <span className="text-red-500">*</span></h3>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        value={selectedCustomer}  
                        onChange={handleCustomerChange}  
                        name="customer"
                        placeholder="กรุณาเลือกลูกค้า" 
                        options={customers} 

                    />
                    <ul className="space-y-4 mt-6">
                        {cart.map((item) => (
                            <li key={item.product_id} className="cart-item bg-white p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-semibold text-gray-700">{item.product_name} (x{item.quantity})</span>
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        value={orderdeDiscription[item.product_id] || ""} 
                                        onChange={(e) =>
                                            handleDescriptionChange(item.product_id, e.target.value) 
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={`เพิ่มรายละเอียด ${item.product_name}`}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => removeFromCart(item.product_id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
                                    >
                                        ลบรายการ
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="total-price mt-4">
                        <h3 className="text-lg font-semibold text-gray-800">รวม: {getTotalPrice()} ฿</h3>
                    </div>

                    <button
                        onClick={clearCart}
                        className="clear-cart bg-gray-300 text-black hover:bg-gray-400 mt-2 p-2 rounded-md transition duration-150"
                    >
                        ล้างตะกร้า
                    </button>

                    <button
                        onClick={handleCheckout}
                        className="checkout-btn bg-blue-500 text-white hover:bg-blue-600 mt-4 p-2 rounded-md transition duration-150"
                    >
                        สั่งซื้อและชําระเงิน
                    </button>
                </div>
            )}






            {/* ไดอะล็อกวิธีการชำระเงิน */}
            {showPaymentDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-lg font-semibold text-center">เลือกวิธีการชำระเงิน</h2>
                        {order && (
                            <p>รายการออเดอร์ที่: {order.order_id} <br />
                                รวม: <span className='text-red-500'>{order.total_price}</span> ฿ิ <br />
                                ชื่อลูกค้า: {order.customer_name}</p>
                        )}
                        <div className="mt-4 w-full h-full flex flex-col justify-center items-center text-center">
                            <button
                                onClick={() => setPaymentMethod('เงินสด')}
                                className={`block w-full text-center p-2 mt-2 rounded-md ${paymentMethod === 'เงินสด' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                            >
                                เงินสด
                            </button>
                            <button
                                onClick={() => setPaymentMethod('เงินโอน')}
                                className={`block w-full text-center p-2 mt-2 rounded-md ${paymentMethod === 'เงินโอน' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                            >
                                เงินโอน
                            </button>
                            <button
                                onClick={() => setPaymentMethod('เครดิต')}
                                className={`block w-full text-center p-2 mt-2 rounded-md ${paymentMethod === 'เครดิต' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                            >
                                เครดิต
                            </button>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handlePaymentConfirm}
                                className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md"
                            >
                                ยืนยันการชำระเงิน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customer;
