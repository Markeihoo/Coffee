import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './component/Menu';
import Mainmenu from './component/Mainmenu';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/Menu' element={<Menu />} />
        <Route path='/' element={<Mainmenu />} />
      </Routes>
    </Router>
  );
};

export default App;
