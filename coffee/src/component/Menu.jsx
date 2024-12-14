import React from 'react'
import { Link } from 'react-router-dom'
import { BiExit } from "react-icons/bi";
import { useEffect, useState } from 'react';
import './index.css'


const Menu = ({ ToggleOrder, ToggleRegister_customer, ToggleRegister_employee, ToggleHistory, ToggleCustomerList, ToggleCustomer }) => {




  return (
    <>
      <div className="container flex flex-col items-center justify-center w-[280px] h-screen mx-auto text-center">
        <img className='justify-center' src='https://png.pngtree.com/png-vector/20240426/ourmid/pngtree-coffee-cat-sticker-by-chidees-png-image_12315498.png' alt='' />
        <h1 className='welcome' > Menu Coffee shop</h1>


        <input type='submit' onClick={ToggleCustomer} value='สั่งรายการอาหาร' />

        <input type='submit' onClick={ToggleRegister_customer} value='สมัครสมาชิกลูกค้า' />

        <p style={{ color: 'gray', marginTop: '5px', marginBottom: '5px' }}>--จัดการระบบภายในร้าน--</p>

        <input type='submit' style={{ backgroundColor: '#3e71af' }} value='ออร์เดอร์ทั้งหมด'
          onClick={ToggleOrder}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />


        <input type='submit' style={{ backgroundColor: '#3e71af' }} value='แสดงรายชื่อลูกค้า'
          onClick={ToggleCustomerList}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />


        <input type='submit' style={{ backgroundColor: '#3e71af' }} value='สมัครสมาชิกพนักงาน'
          onClick={ToggleRegister_employee}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />


        <input type='submit' style={{ backgroundColor: '#3e71af' }} value='ประวัติการสั่งซื้อ'
          onClick={ToggleHistory}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />


        <input type='submit' style={{ backgroundColor: 'red' }} value='ออกจากระบบ'
          onClick={() => window.location.href = '/Login'}

          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'red'} />
      </div>

    </>)
}

export default Menu