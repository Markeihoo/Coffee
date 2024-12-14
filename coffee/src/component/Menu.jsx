import React from 'react'
import { Link } from 'react-router-dom'
import { BiExit } from "react-icons/bi";
import { useEffect, useState } from 'react';
import './index.css'

const Menu = ({ gotoOrder, gotoRegisEmployee, gotoRegisCustomer, gotoShow, gotoHistory, gotoCustomer, gotoLogout }) => {
  return (
    <>
      <div className='container'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src='https://png.pngtree.com/png-vector/20240426/ourmid/pngtree-coffee-cat-sticker-by-chidees-png-image_12315498.png' alt='' />
          <h1 className='welcome' style={{ marginLeft: '10px' }}>Menu <br />Coffee shop</h1>
        </div>

        <input type='submit' onClick={gotoCustomer} value='สั่งรายการอาหาร' />

        <input type='submit' onClick={gotoRegisCustomer} value='สมัครสมาชิกลูกค้า' />

        <p style={{ color: 'gray', marginTop: '5px', marginBottom: '5px' }}>---------จัดการระบบภายในร้าน---------</p>

        <input type='submit' style={{ backgroundColor: '#3e71af' }} onClick={gotoOrder} value='ออร์เดอร์ทั้งหมด'
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />

        <input type='submit' style={{ backgroundColor: '#3e71af' }} onClick={gotoShow} value='แสดงรายชื่อลูกค้า'
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />

        <input type='submit' style={{ backgroundColor: '#3e71af' }} onClick={gotoRegisEmployee} value='สมัครสมาชิกพนักงาน'
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />

        <input type='submit' style={{ backgroundColor: '#3e71af' }} onClick={gotoHistory} value='ประวัติการสั่งซื้อ'
          onMouseEnter={(e) => e.target.style.backgroundColor = '#35628b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3e71af'} />

        <input type='submit' style={{ backgroundColor: 'red' }} onClick={gotoLogout} value='ออกจากระบบ'
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'red'} />
      </div>

    </>)
}

export default Menu