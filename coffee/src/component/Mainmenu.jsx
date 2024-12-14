import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import Menu from './Menu'
import Welcome from './customer/Welcome.jsx'

// import History from './History'
// import Orders from './Orders'
// import RegisCustomer from './customer/RegisCustomer'
// import RegisEmployee from './RegisEmployee'
// import ShowCustomer from './customer/ShowCustomer'
// import Customer from './customer/Customer'

const Mainmenu = () => {
  // const [activeComponent, setActiveComponent] = useState('welcome');

  // const gotoCustomer = () => {
  //   setActiveComponent(prevstate => (prevstate === 'welcome' ? 'customer' : 'welcome'));
  // };

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