import React, { useState } from 'react';
import {submitRegister} from './customer/Register_cm.js'
const Register_employee = () => {
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [employeeFname, setEmployeeFname] = useState('');
  const [employeeLname, setEmployeeLname] = useState('');

  const handleReset = () => {
    setTel('');
    setPassword('');
    setEmployeeFname('');
    setEmployeeLname('');
  };

  const handleLogin = async (event) => {
      event.preventDefault(); // ป้องกันการรีเฟรชหน้า
      await submitRegister(tel,password,employeeFname,employeeLname); // เรียกใช้งานฟังก์ชันล็อกอิน
      
    };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">หน้าสมัครสมาชิกพนักงาน</h1>

        <div className="mb-4 flex items-center">
          <label className="w-1/5 font-medium">เบอร์โทร</label>
          <input
            type="text"
            value={tel.trim()}
            placeholder="เบอร์โทร"
            onChange={(e) => setTel(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="w-1/5 font-medium">ชื่อจริง</label>
          <input
            type="text"
            placeholder="ชื่อจริง"
            value={employeeFname.trim()}
            onChange={(e) => setEmployeeFname(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="w-1/5 font-medium">นามสกุล</label>
          <input
            type="text"
            placeholder="นามสกุล"
            value={employeeLname.trim()}
            onChange={(e) => setEmployeeLname(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="w-1/5 font-medium">Password</label>
          <input
            type="password"
            placeholder="password"
            value={password.trim()}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogin}
          >
            สมัครสมาชิก
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default Register_employee;
