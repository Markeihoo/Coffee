import React, { useState } from 'react';

// ข้อมูลสินค้าในแต่ละหมวดหมู่
const products = {
    hot: [
        { id: 1, name: 'กาแฟดำร้อน', price: 50 },
        { id: 2, name: 'ลาเต้ร้อน', price: 60 },
        { id: 3, name: 'คาปูชิโน่ร้อน', price: 65 },
    ],
    cold: [
        { id: 4, name: 'กาแฟเย็น', price: 60 },
        { id: 5, name: 'ลาเต้เย็น', price: 65 },
        { id: 6, name: 'คาปูชิโน่เย็น', price: 70 },
    ],
    blended: [
        { id: 7, name: 'กาแฟปั่น', price: 65 },
        { id: 8, name: 'ลาเต้ปั่น', price: 70 },
        { id: 9, name: 'คาปูชิโน่ปั่น', price: 75 },
    ]
};

const Customer = () => {
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('hot');
    const [showCart, setShowCart] = useState(false); // สถานะการแสดงตะกร้า
    
    const addToCart = (product) => {
        setCart((prevCart) => {
            return prevCart.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            ).concat(
                prevCart.some(item => item.id === product.id) 
                    ? [] 
                    : [{ ...product, quantity: 1 }]
            );
        });

        setShowCart(true); // เปิดแท็บตะกร้าทุกครั้งที่เพิ่มสินค้า
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="container relative">
            <h1 className="text-center text-2xl font-bold">Customer - Menu Coffee Shop</h1>
            
            {/* ปุ่มหมวดหมู่ */}
            <div className="categories mt-8 flex justify-center space-x-6">
                <button className="btn" onClick={() => setSelectedCategory('hot')}>ร้อน</button>
                <button className="btn" onClick={() => setSelectedCategory('cold')}>เย็น</button>
                <button className="btn" onClick={() => setSelectedCategory('blended')}>ปั่น</button>
            </div>

            {/* แสดงสินค้า */}
            <div className="products mt-8 flex justify-center space-x-6">
                <div className="category">
                    <h2 className="font-semibold">
                        {selectedCategory === 'hot' ? 'ร้อน' : selectedCategory === 'cold' ? 'เย็น' : 'ปั่น'}
                    </h2>
                    <ul>
                        {products[selectedCategory].map((product) => (
                            <li key={product.id} className="product">
                                <span>{product.name} - {product.price} ฿</span>
                                <button className="add-btn" onClick={() => addToCart(product)}>เพิ่มลงตะกร้า</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ปุ่มตะกร้าสินค้าทรงวงกลม */}
            <button
                onClick={() => setShowCart(!showCart)}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-4"
            >
                🛒
            </button>

            {/* ตะกร้าสินค้าจะเลื่อนจากขวา */}
            <div
                className={`cart p-4 border border-gray-300 rounded-lg shadow-lg absolute top-16 right-0 bg-white w-72 transition-transform duration-500 ${
                    showCart ? 'transform translate-x-0' : 'transform translate-x-full'
                }`}
            >
                <h2 className="text-xl font-semibold">ตะกร้าสินค้า</h2>
                <ul>
                    {cart.map((item) => (
                        <li key={item.id} className="cart-item flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <button onClick={() => removeFromCart(item.id)} className="remove-btn">ลบ</button>
                        </li>
                    ))}
                </ul>

                <div className="total-price mt-4">
                    <h3>รวม: {getTotalPrice()} ฿</h3>
                </div>
            </div>
        </div>
    );
};

export default Customer;
