const fs = require('fs');
const express = require('express');
const routes = express.Router();

const registerUser = require('../Controllers/register');
const loginUser = require('../Controllers/login')
const events = require('../Controllers/eventManagement')



routes.use('/register', registerUser);
routes.use('/login', loginUser);
routes.use('/events', events)



module.exports = routes;