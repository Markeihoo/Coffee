import React from 'react';

const Welcome = () => {
  return (
    // bg-gradient-to-r from-green-200 to-blue-200
    <div className="min-h-screen  flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">ยินดีต้อนรับสู่ร้านกาแฟ</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Coffee Shop</h2>
      
      <img 
        src="https://png.pngtree.com/png-vector/20240426/ourmid/pngtree-coffee-cat-sticker-by-chidees-png-image_12315498.png" 
        alt="Coffee Cat" 
        className="w-48 h-48 mb-6" 
      />

      <p className="text-lg text-gray-600 mb-6">รายการสินค้ามีหลายรายการ หมวดหมู่มี 3 หมวด ได้แก่</p>
      
      <ul className="list-inside space-y-4 text-left max-w-lg mx-auto">
        <li className="flex items-center">
          <span className="font-bold text-green-600 mr-2">ร้อน</span>
          <span className="text-gray-500">เช่น คาปูชิโน่ร้อน, ลาเต้ร้อน, ช็อคโกแลตร้อน ฯลฯ</span>
        </li>
        <li className="flex items-center">
          <span className="font-bold text-blue-600 mr-2">เย็น</span>
          <span className="text-gray-500">เช่น โกโก้เย็น, ชาไทยเย็น, ช็อคโกแลตเย็น ฯลฯ</span>
        </li>
        <li className="flex items-center">
          <span className="font-bold text-pink-600 mr-2">ปั่น</span>
          <span className="text-gray-500">เช่น ชาเขียวปั่น, โอริโอ้ปั่น, ช็อคโกแลตปั่น ฯลฯ</span>
        </li>
      </ul>

      <p className="mt-6 text-lg text-gray-600">มาร่วมสัมผัสประสบการณ์กาแฟสุดพิเศษกับเราที่ Coffee Shop!</p>
    </div>
  );
}

export default Welcome;
