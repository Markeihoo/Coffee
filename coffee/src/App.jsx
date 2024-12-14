import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './component/Menu';
import Mainmenu from './component/Mainmenu';
import Login from './component/Login';
import Customer from './component/customer/Customer';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/Menu' element={<Menu />} />
        <Route path='/Mainmenu' element={<Mainmenu />} />
        <Route path='/Login' element={<Login />} />

        <Route path='/customer' element={<Customer />} />
      </Routes>
    </Router>
  );
};

export default App;
