
function isValidEmail(email) {
    // Regular expression for validating an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const registrationModel = (userCred) => {

    if (userCred.hasOwnProperty('name') && (userCred.hasOwnProperty('email') && isValidEmail(userCred.email)) && userCred.hasOwnProperty('password')
        && userCred.hasOwnProperty('role')) {
        return {
            status: true,
            message: "User Validation successful"
        }
    } else {
        return {
            status: failed, 
            message: "User validation failed. Retry again!"
        }
    }

}

module.exports = registrationModel;