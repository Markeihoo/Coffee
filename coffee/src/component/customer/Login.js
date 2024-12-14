import {useNavigate} from 'react-router-dom';

export const submitLogin = async(tel,password)=>{
    if(!tel || !password){
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try{
        const response = await fetch('http://localhost:8000/login/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tel, password }),
          });
          const data = await response.json();
          console.log(data);
          if(data.message === "เข้าสู่ระบบสําเร็จ"){
            window.location.href = '/Mainmenu';
            localStorage.setItem('token',data.token);
          }
          return data;
    }catch(error){
        console.log(error);
    }
}