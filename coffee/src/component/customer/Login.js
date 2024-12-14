export const submitLogin = async(employee_id,password)=>{
    if(!employee_id || !password){
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try{
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employee_id, password }),
          });
          const data = await response.json();
          return data;
    }catch(error){
        console.log(error);
    }
}