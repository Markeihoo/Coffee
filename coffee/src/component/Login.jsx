import React, { useState } from 'react';
//import './Login.css';
import { useNavigate } from 'react-router-dom';
//import { submitLogin } from './Login.js';

const Login = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า
    await submitLogin(username, password); // เรียกใช้งานฟังก์ชันล็อกอิน
  };

  return (
    <>
      <div className='container'>
        <div>
          <img
            className='mx-auto'
            src='https://media.istockphoto.com/id/1267682418/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/%E0%B9%82%E0%B8%A5%E0%B9%82%E0%B8%81%E0%B9%89%E0%B8%81%E0%B8%B2%E0%B9%81%E0%B8%9F%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%80%E0%B8%A7%E0%B8%81%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%82%E0%B8%AD%E0%B8%87-%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%80%E0%B8%A7%E0%B8%81%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%82%E0%B8%A5%E0%B9%82%E0%B8%81%E0%B9%89%E0%B8%81%E0%B8%B2%E0%B9%81%E0%B8%9F%E0%B8%A7%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%88%E0%B8%A2%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%A2%E0%B8%B8%E0%B8%84%E0%B8%AA%E0%B9%8D%E0%B8%B2%E0%B8%AB%E0%B8%A3.jpg?s=612x612&w=0&k=20&c=2383fPi2S4am0opFnlBF0eS4lDaUqG-_wB09-FHb9BM='
            alt='Logo'
          />
        </div>

        <h1>Coffe Shop</h1>
        

        {/* ใช้ form เพื่อรองรับการกด Enter */}
        <form onSubmit={handleLogin}>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type='submit' value='Login' />
        </form>
      </div>
    </>
  );
};

export default Login;
