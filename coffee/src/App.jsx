import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './component/Menu';
import Mainmenu from './component/Mainmenu';
import Login from './component/Login';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/Menu' element={<Menu />} />
        <Route path='/' element={<Mainmenu />} />
        <Route path='/Login' element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
