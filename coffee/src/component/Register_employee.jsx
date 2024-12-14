import React from 'react'

const Register_employee = () => {
  return (
    <>
    <div className='container'>
    <h1>หน้าสมัครสมาชิกพนักงาน</h1>
    <div className='flex items-center'>
      <h1 className='w-1/5'>เบอร์โทร</h1>
      <input type='text' placeholder='เบอร์โทร' />
    </div>
    <div className='flex items-center'>
      <h1 className='w-1/5'>ชื่อจริง</h1>
      <input type='text' placeholder='ชื่อจริง' />
    </div>
    <div className='flex items-center'>
      <h1 className='w-1/5'>นามสกุล</h1>
      <input type='text' placeholder='นามสกุล' />
    </div>
    <div className='flex items-center'>
      <h1 className='w-1/5'>Password</h1>
      <input type='text' placeholder='password' />
    </div>
    
    </div>
    </>
  )
}

export default Register_employee