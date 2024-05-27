const loginModel =(userCredlogin)=>{
    if(userCredlogin.hasOwnProperty("email") && userCredloginlogin.hasOwnProperty("password")){
        return {
            status: true,
            message:"Login successful"
        }
    }else{
        return {
            status:false,
            message:"User validation failed, retry again"
        }
    }
}

module.exports = loginModel