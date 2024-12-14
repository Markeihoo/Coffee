import React from 'react'

const Welcome = () => {
  return (
    <div className='container flex flex-col '>ยินดีต้อนรับสู่ร้านกาแฟ<br />
      <h1>Coffee Shop</h1>
      <img src="https://png.pngtree.com/png-vector/20240426/ourmid/pngtree-coffee-cat-sticker-by-chidees-png-image_12315498.png" alt="" />
      <p className='text-left items-start'>รายการสินค้ามีหลายรายการ หมวดหมู่มี 3 หมวด ได้แก่
        <ul className='list-inside'>
          <li>ร้อน &nbsp;&nbsp;<span style={{ color: 'gray' }}>เช่น คาปูชิโน่ร้อน ลาเต้ร้อน ช็อคโกแลตร้อน ฯ &nbsp;&nbsp;</span></li>
          <li>เย็น &nbsp;&nbsp;<span style={{ color: 'gray' }}>เช่น โกโก้เย็น ชาไทยเย็น ช็อคโกแลตเย็น ฯ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>
          <li>ปั่น  &nbsp;&nbsp;<span style={{ color: 'gray' }}>เช่น ชาเขียวปั่น โอริโอ้ปั่น ช็อคโกแลตปั่น ฯ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></li>
        </ul>
      </p>
    </div>
  )
}

export default Welcome