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

    const [showPaymentDialog, setShowPaymentDialog] = useState(false); // For showing payment dialog
    const [paymentMethod, setPaymentMethod] = useState('เงินสด'); // For storing selected payment method

    const [employee_id, setEmployee_id] = useState(null);

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Function to handle the customer selection from the dropdown
    const handleCustomerChange = (selectedOption) => {
        setSelectedCustomer(selectedOption);
    };

    const [order, setOrder] = useState(null);  // state สำหรับเก็บข้อมูลออเดอร์ล่าสุด
    const [totalPrice, setTotalPrice] = useState(0); // ใส่ค่ารวมของราคาที่จะต้องชำระ
    const [refresh, setRefresh] = useState(false); // ตัวแปรสำหรับ trigger การดึงข้อมูลใหม่

    // useEffect ดึงข้อมูลออเดอร์ล่าสุด
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

    const handlePaymentConfirm = async () => {
        if (!paymentMethod || !order?.order_id) {
            alert("กรุณาเลือกวิธีการชำระเงินและตรวจสอบรายการออเดอร์");
            return;
        }
    
        console.log(`ยืนยันการชำระเงินด้วยวิธี: ${paymentMethod}`);
    
        // เตรียมข้อมูลที่จะส่งไปยัง backend
        const paymentData = {
            payment_method: paymentMethod, // วิธีการชำระเงิน (Cash หรือ Bank Transfer)
            order_id: order.order_id,     // ID ของออเดอร์ที่ต้องการชำระเงิน
        };
    
        try {
            // เรียก API เพื่อส่งข้อมูลการชำระเงิน
            const response = await fetch('http://localhost:8000/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData), // ส่งข้อมูลในรูปแบบ JSON
            });
    
            if (response.ok) {
                const data = await response.json(); // อ่านผลลัพธ์ที่ได้จาก backend
                console.log("การชำระเงินสำเร็จ:", data);
    
                alert("การชำระเงินสำเร็จ!"); // แจ้งเตือนผู้ใช้
                setShowPaymentDialog(false); // ปิด dialog
            } else {
                const errorData = await response.json(); // อ่านข้อความ error ที่ backend ส่งมา
                console.error("Error confirming payment:", errorData);
                alert("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
            }
        } catch (error) {
            console.error("Error while confirming payment:", error);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
    };
    

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
                    label: customer.customer_name,  // Assuming customer_name is the name of the customer
                }));
                setCustomers(customerOptions);
                if (customerOptions.length > 0) {
                    setSelectedCustomer(customerOptions[0]);  // Set the default customer if needed
                }
            } catch (err) {
                console.error('Error fetching customer data:', err);
            }
        };

        fetchCustomers();
    }, []);
    // Fetch categories
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

    // Fetch products when a category is selected
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

    // Search functionality
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value === "") {
            setFilteredProducts(products); // Display all products if search query is empty
        } else {
            const filtered = products.filter(product =>
                product.product_name.toLowerCase().includes(event.target.value.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    // Add product to cart
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
        }, 10000);
    };

    // Remove product from cart
    const removeFromCart = (product_id) => {
        setCart((prevCart) => prevCart.filter(item => item.product_id !== product_id));
    };

    // Clear the entire cart
    const clearCart = () => {
        setCart([]);
    };

    // Calculate the total price of items in the cart
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            if (!isNaN(item.product_price) && !isNaN(item.quantity)) {
                return total + item.product_price * item.quantity;
            }
            return total;
        }, 0);
    };

    const getEmployeeId =async () => {
        try {
            const respoonse = await fetch(`http://localhost:8000/login/employee/${localStorage.getItem('token')}`);
            const data = await respoonse.json();
            setEmployee_id(data.employee_id);
            
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getEmployeeId();
    }, []);
    
    // Checkout functionality (basic)
    const handleCheckout = async () => {
        // Prepare the order data with employee_id, customer_id, order_date, and order_status
        const orderData = {
            order_date: new Date().toISOString(),  // Set the current date/time as the order date
            order_status: "กำลังดำเนินการ",      // Set order status as "Pending" or as needed

            employee_id: employee_id,                        // Hardcoded employee_id (can be dynamic)
            customer_id: selectedCustomer.value,   // Use the selected customer_id

            orderDetails: cart.map(item => ({
                quantity: item.quantity,
                orderde_discription: item.product_name,
                product_id: item.product_id
            })),
        };
        

        try {
            // Send the order data to the backend
            const response = await fetch('http://localhost:8000/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setShowPaymentDialog(true);  // Show the payment method dialog

                const responseData = await response.json();
                console.log('Order successfully created:', responseData);

                setCart([]); // Clear cart after checkout
                setRefresh((prev) => !prev); // Trigger refresh for latest data
            } else {
                const errorData = await response.json();
                console.error('Error placing order:', errorData);
            }
        } catch (error) {
            console.error('Error while checking out:', error);
        }
    };
    

    

    return (

        <div className="container mx-auto p-6 bg-gray-50 h-[800px] flex flex-col">
        <button >Testlog</button>
       
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Customer - Menu Coffee Shop</h1>

            {/* Category buttons */}
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

            {/* Search bar */}
            <div className="search mt-8 flex justify-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="ค้นหาชื่อเมนู"
                    className="w-1/3 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>

            {/* Display products */}
            <div className="products mt-8 gap-6 border border-gray-300 rounded-lg p-4 h-full overflow-y-auto">
                {filteredProducts.length === 0 ? (
                    <div className="text-center text-xl text-red-500 font-semibold">
                        ไม่มีสินค้าชื่อ {searchQuery}
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.slice(0, 9).map((product) => (
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

            {/* Cart button */}
            <button
                onClick={() => setShowCart(!showCart)}
                className="bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition duration-300 absolute top-4 right-4"
            >
                🛒
            </button>

            {/* Cart sidebar */}
            {cartUpdated && (
                <div
                    className={`cart p-4 border border-gray-300 rounded-lg shadow-lg absolute top-16 right-4 bg-white w-72 transition-transform duration-500 ${showCart ? 'transform translate-x-0' : 'transform translate-x-full'}`}
                >
                    <h2 className="text-xl font-semibold text-gray-700">ตะกร้าสินค้า</h2><br />
                    <h3>ชื่อลูกค้า</h3>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        value={selectedCustomer}  // Bind to selected customer state
                        onChange={handleCustomerChange}  // Update the state when the customer is selected
                        name="customer"

                        placeholder="กรุณาเลือกลูกค้า" // ข้อความเริ่มต้น
                        options={customers}  // Use the customer data here
                        isSearchable
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

            {/* Payment Method Modal */}
            {showPaymentDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-lg font-semibold text-center">เลือกวิธีการชำระเงิน</h2>
                        {order && (
                            <p>รายการออเดอร์: {order.order_id} รวม: {totalPrice} ฿ิ <br />
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
