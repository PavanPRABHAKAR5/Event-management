

const eventValidator =(eventDetails)=>{
    if(eventDetails.hasOwnProperty("date") && eventDetails.hasOwnProperty('time') && eventDetails.hasOwnProperty('description') 
     && eventDetails.hasOwnProperty('guest'))
    {
        return {
            status : true,
            message: "Validation Successful"
        }
    }else{
        return {
            status : false,
            message : "Validation failed. Try again"
        }
    }
}



module.exports = eventValidator

