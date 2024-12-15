
export const submitRegister = async(tel,password,employee_fname,employee_lname)=>{
    if(!tel || !password||!employee_fname||!employee_lname){
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return res.status(400).json({ message: 'Username and password are required' });
        
    }
    try{
        const response = await fetch('http://localhost:8000/login/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tel, password,employee_fname,employee_lname }),
          });
          const data = await response.json();
          if(response.status === 200){
              alert("สมัครสมาชิกสําเร็จ");
          }
          else{
              alert("สมัครสมาชิกไม่สําเร็จ มีเบอร์ลูกค้าซ้ำแล้ว กรุณาลองใหม่อีกครั้ง");
          }
          
        
          return data;
    }catch(error){
        console.log(error);
    }
}
