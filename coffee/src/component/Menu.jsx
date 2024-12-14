import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
const Menu = () => {
  return (
    <>
    <div className='container'>
        <h1 className='welcome'>Menu Coffee</h1>
    <input type='submit'  value='สั่งรายการอาหาร' />
    <input type='submit' value='ออร์เดอร์ทั้งหมด' />
    <input type='submit' value='แสดงรายชื่อลูกค้า' />
    <input type='submit' value='สมัครสมาชิกพนักงาน' />
    <input type='submit' value='ประวัติการสั่งซื้อ' />
    <input type='submit' value='ประวัติการสั่งซื้อ' />
    <input type='submit' style={{backgroundColor:'red'}} value='ออกจากระบบ' />


    </div>
    
  </>)
}

export default Menu