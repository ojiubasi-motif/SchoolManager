import jwt from 'jsonwebtoken';

function verify(req, res, next){
    const authHeader = req.headers.token;
    if(authHeader){
        
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.PW_CRYPT, (err, user)=>{
            if(err) return res.status(403).json({msg:"login credentials not authentic",type:"UNAUTHORIZED",code:606});
            req.user = user
            next();//continue execution after verification
        })
    }else{ 
        return res.status(403).json({msg:"please login",type:"UNAUTHORIZED",code:606});
    }
} 
  
export default verify