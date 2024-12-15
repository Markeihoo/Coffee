import React, { useState, useEffect } from 'react';

const Customer = () => {
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // สำหรับค้นหาชื่อเมนู
    const [filteredProducts, setFilteredProducts] = useState([]); // สำหรับแสดงผลลัพธ์การค้นหาสินค้า
    const [showCart, setShowCart] = useState(false);
    const [cartUpdated, setCartUpdated] = useState(false);

    // ดึงข้อมูลหมวดหมู่จาก API
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
                    setSelectedCategory(data[0].category_id);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // ดึงข้อมูลสินค้าเมื่อเลือกหมวดหมู่
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
                    setFilteredProducts(data); // กำหนดสินค้าทั้งหมดให้เป็นตัวกรองเริ่มต้น
                } catch (err) {
                    console.error("Error fetching products:", err);
                }
            };
            fetchProducts();
        }
    }, [selectedCategory]);

    // ฟังก์ชันค้นหาสินค้าตามชื่อ
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value === "") {
            setFilteredProducts(products); // หากไม่มีการค้นหาแสดงสินค้าทั้งหมด
        } else {
            const filtered = products.filter(product =>
                product.product_name.toLowerCase().includes(event.target.value.toLowerCase()),
            );
            setFilteredProducts(filtered); // แสดงเฉพาะสินค้าที่ตรงกับคำค้นหา
        }
    };

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

    const removeFromCart = (product_id) => {
        setCart((prevCart) => prevCart.filter(item => item.product_id !== product_id));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            if (!isNaN(item.product_price) && !isNaN(item.quantity)) {
                return total + item.product_price * item.quantity;
            }
            return total;
        }, 0);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50  flex flex-col ">
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Customer - Menu Coffee Shop</h1>

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

            {/* ช่องค้นหาสินค้า */}
            <div className="search mt-8 flex justify-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="ค้นหาชื่อเมนู"
                    className="w-1/3 p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>
            <div className="products mt-8 gap-6 border border-gray-300 rounded-lg p-4 h-full overflow-y-auto">
                <div className="category">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center text-xl text-red-500 font-semibold">
                            ไม่มีสินค้าชื่อ {searchQuery}
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {/* ใช้ .slice() เพื่อแสดงสินค้าแค่ 9 รายการ */}
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
                {/* หากมีสินค้ามากกว่า 9 รายการ ให้แสดงข้อความให้เลื่อน */}
                {filteredProducts.length > 9 && (
                    <div >
                        
                    </div>
                )}
            </div>



            {/* ปุ่มตะกร้าสินค้าทรงวงกลม */}
            <button
        onClick={() => setShowCart(!showCart)}
        className="bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition duration-300 absolute top-4 right-4"
    >
        🛒
    </button>

            {/* ตะกร้าสินค้าจะเลื่อนจากขวา */}
            {cartUpdated && (
                <div
                className={`cart p-4 border border-gray-300 rounded-lg shadow-lg absolute top-16 right-4 bg-white w-72 transition-transform duration-500 ${showCart ? 'transform translate-x-0' : 'transform translate-x-full'}`}
            >
                <h2 className="text-xl font-semibold text-gray-700">ตะกร้าสินค้า</h2>
                <ul className="space-y-4 mt-4">
                    {cart.map((item) => (
                        <li key={item.product_id} className="cart-item flex justify-between items-center">
                            <span>{item.product_name} (x{item.quantity})</span>
                            <button onClick={() => removeFromCart(item.product_id)} className="remove-btn text-red-500 hover:text-red-700">
                                ลบ
                            </button>
                        </li>
                    ))}
                </ul>
    
                <div className="total-price mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">รวม: {getTotalPrice()} ฿</h3>
                </div>
    
                <button
                    onClick={() => setShowCart(false)}
                    className="close-btn absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
    
                <button
                    // onClick={handleCheckout}
                    className="checkout-btn bg-blue-500 text-white hover:bg-blue-600 mt-4 p-2 rounded-md transition duration-150"
                >
                    สั่งซื้อ
                </button>
            </div>
            )}
        </div>
    );
};

export default Customer;
