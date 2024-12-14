import React from 'react'

import './index.css'
import Menu from './Menu'



import Welcome from './customer/Welcome.jsx'
import { useState } from 'react'
import Orders from './customer/Customer.jsx'
import Register_employee from './Register_employee'
import Register_customer from './customer/regisCustomer'
import History from './History'
import CustomerList from './CustomerList.jsx'
import Customer from './Customer.jsx'
const Mainmenu = () => {


  const [activeComponent, setActiveComponent] = useState('welcome');
  const ToggleOrders = () => {
    setActiveComponent(prevstate=>(prevstate ==='Orders'? 'welcome':'Orders'));
  }
  const ToggleRegister_employee = () => {
    setActiveComponent(prevstate=>(prevstate ==='Register_employee'? 'welcome':'Register_employee'));
  }
  const ToggleRegister_customer = () => {
    setActiveComponent(prevstate=>(prevstate ==='Register_customer'? 'welcome':'Register_customer'));
  }
  const ToggleHistory = () => {
    setActiveComponent(prevstate=>(prevstate ==='History'? 'welcome':'History'));
  }
  const ToggleCustomerList = () => {
    setActiveComponent(prevstate=>(prevstate ==='CustomerList'? 'welcome':'CustomerList'));
  }
  const ToggleCustomer = () => {
    setActiveComponent(prevstate=>(prevstate ==='Customer'? 'welcome':'Customer'));
  }


  return (
    <>
    <div className='main-container' >
    <div className='sidebar'>
    <Menu ToggleOrder={ToggleOrders} 
    ToggleRegister_employee={ToggleRegister_employee}
    ToggleRegister_customer={ToggleRegister_customer}
    ToggleHistory={ToggleHistory}
    ToggleCustomerList={ToggleCustomerList}
    ToggleCustomer={ToggleCustomer}
     />


    </div>

    <div className='content w-60'>
    {activeComponent === 'Orders' && <Orders />}
    {activeComponent === 'welcome' && <Welcome />}
    {activeComponent === 'Register_employee' && <Register_employee />}
    {activeComponent === 'Register_customer' && <Register_customer />}
    {activeComponent === 'History' && <History />}
    {activeComponent === 'CustomerList' && <CustomerList />}
    {activeComponent === 'Customer' && <Customer />}
    </div>


    </div>
    
    </>
  )
}

export default Mainmenu