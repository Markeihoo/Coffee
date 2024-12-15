
export const submitRegister = async(customer_name,customer_tel)=>{
    if(!customer_name || !customer_tel){
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return res.status(400).json({ message: 'Username and password are required' });
        
    }
    try{
        const response = await fetch('http://localhost:8000/register_cm/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customer_name,customer_tel }),
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
