import React from 'react'
import { submitRegister } from './Register_cmm'
import { useState } from 'react';
const RegisCustomer = () => {
  const [customer_name, setCustomer_name] = useState('');
  const [customer_tel, setCustomer_tel] = useState('');

  const reset = () => {
    customer_name('');
    customer_tel('');
  }
  const handleLogin = async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า
    await submitRegister(customer_name, customer_tel); 

  };

  return (
    <div className='container'>
      <h1 className='text-2xl border border-black p-2 mb-4 bg-yellow-600 text-white'>สมัครสมาชิกลูกค้า</h1>
      <div className='flex items-center'>
        <p className='w-1/5'>ชื่อลูกค้า</p>

        <input type="text" placeholder='ชื่อลูกค้า' value={customer_name.trim()} onChange={(e) => setCustomer_name(e.target.value)} />
      </div>
      <div className='flex items-center'>
        <p className='w-1/5'>เบอร์โทร</p>
        <input type="text" placeholder='เบอร์โทร' value={customer_tel.trim()} onChange={(e) => setCustomer_tel(e.target.value)} />
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
          onAbort={reset}
        >
          Reset
        </button>
      </div>
    </div>
  )

}

export default RegisCustomer
