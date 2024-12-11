import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import Menu from './Menu'
import Customer from './customer.jsx'
const Mainmenu = () => {
  return (
    <>
    <div className='main-container'>
    <div className='sidebar'>
    <Menu />


    </div>

    <div className='content'>
    <Customer />

    </div>


    </div>
    
    </>
  )
}

export default Mainmenu