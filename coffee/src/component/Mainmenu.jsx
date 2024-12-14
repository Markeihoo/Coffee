import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import Menu from './Menu'
import Welcome from './customer/Customer.jsx'
const Mainmenu = () => {
  return (
    <>
    <div className='main-container' >
    <div className='sidebar'>
    <Menu />


    </div>

    <div className='content w'>
    <Welcome />

    </div>


    </div>
    
    </>
  )
}

export default Mainmenu