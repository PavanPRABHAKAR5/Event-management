const fs = require('fs');
const express = require('express');
const route = express.Router();
const { randomBytes } = require('crypto');

route.use(express.json());
route.use(express.urlencoded({ extended: true }));

const tokenVerify = require('../middleware/verifyJWT')
const events = require('../data/eventList.json')
const User = require('../data/userList.json')
const eventValidation = require('../Models/eventManagement')

route.get('/', tokenVerify, async (req, res) => {
    if (req.user) {
        if(req.user.role == 'organizer'){
            res.status(200).json(events.Events)
        }else{
            res.status(401).json({
                message: "Not Authorised"
            })
        }
    } else {
        res.status(401).json({
            message: req.message
        })
    }
})


route.post('/', tokenVerify, async (req, res) => {
    try {
        if (req.user) {
            if (req.user.role == 'organizer') {
                let eventData = req.body;
                // console.log(eventData)
                let eventlist = events;

                if (eventValidation(eventData).status === true) {
                    eventData.id = randomBytes(4).toString('hex')
                    eventlist.Events.push(eventData)
                    fs.writeFile('./data/eventList.json', JSON.stringify(eventlist), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                        if (err) {
                            return res.status(500).json({
                                Status: "Failed",
                                message: err.message
                            })
                        } else {
                            res.status(200).json(eventData)
                        }
                    })
                } else {
                    res.status(400).json({
                        status: "Failed",
                        message: eventValidation(eventData).message,

                    })
                }

            } else {
                res.status(401).json({
                    message: "Not Authorised"
                })
            }
        } else {
            res.status(401).json({
                message: req.message
            })
        }

    } catch (err) {
        res.status(401).json({
            Status: "Failed",
            message: err.message
        })
    }
})


route.put('/:id', tokenVerify, async (req, res) => {
    try {
        if (req.user) {
            if (req.user.role == 'organizer') {
                let id = req.params.id;
                let editData = req.body;
                let evenList = events;

                let editEvent = evenList.Events.findIndex((event) => event.id == id);

                if (editEvent == -1) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "id is invalid"
                    })
                }

                if (eventValidation(editData).status == true) {

                    evenList.Events[editEvent].date = editData.data;
                    evenList.Events[editEvent].time = editData.time;
                    evenList.Events[editEvent].description = editData.description;
                    evenList.Events[editEvent].guest = editData.guest;

                    fs.writeFile('./data/eventList.json', JSON.stringify(evenList), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                        if (err) {
                            return res.status(500).json({
                                Status: "Failed",
                                message: err.message
                            })
                        } else {
                            res.status(200).json(evenList.Events[editEvent])
                        }
                    })

                } else {
                    res.status(400).json({
                        status: "Failed",
                        message: eventValidation(editData).message,

                    })
                }
            } else {
                res.status(401).json({
                    message: "Not Authorised"
                })
            }
        } else {
            res.status(401).json({
                message: req.message
            })
        }

    } catch (err) {
        return res.status(400).json({
            Status: "Failed",
            message: err.message
        })
    }
})

route.delete('/:id', tokenVerify, async (req, res) => {
    try {
        if (req.user) {
            if (req.user.role == 'organizer') {
                let id = req.params.id;
                let eventsList = events;
                let deletEvent = eventsList.Events.findIndex((event) => event.id == id);
                console.log(eventsList.Events[id])
                console.log(deletEvent)
                if (deletEvent == -1) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "id is invalid"
                    })
                }

                eventsList.Events.splice(deletEvent, 1);

                fs.writeFile('./data/eventList.json', JSON.stringify(eventsList), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                    if (err) {
                        return res.status(500).json({
                            Status: "Failed",
                            message: err.message
                        })
                    } else {
                        res.status(200).json({
                            status: "successful",
                            message: "Deleted Successfully"
                        })
                    }
                })

            } else {
                res.status(401).json({
                    message: "Not Authorised"
                })
            }
        } else {
            res.status(401).json({
                message: req.message
            })
        }
    } catch (err) {
        res.status(400).json({
            Status: "Failed",
            message: err.message
        })
    }
})

route.post('/:id/register', tokenVerify, async (req,res)=>{
    if(req.user){
        if(req.user.role == 'attendee'){
            let id = req.params.id;
            let evenList = events;
            let userList = User;
            let confirmBody = req.body

            let isValidEvent =  evenList.Events.findIndex((event)=> event.id == id);
            let userId = userList.Users.findIndex((user)=> user.name == req.user.name)
            console.log(userId)
            if(isValidEvent == -1){
                return res.status(404).json({
                    status: "Failed",
                    message: "id is invalid"
                })
            }

            if(confirmBody.hasOwnProperty('confirm')){
                if(confirmBody.confirm == 'Yes'){

                    if(!evenList.Events[isValidEvent].participant){
                        evenList.Events[isValidEvent].participant = []
                        evenList.Events[isValidEvent].participant.push(req.user.name)
                    }else{
                        evenList.Events[isValidEvent].participant.push(req.user.name)
                    }
                    if(!userList.Users[userId].registeredEvent){
                        userList.Users[userId].registeredEvent = []
                        userList.Users[userId].registeredEvent.push(evenList.Events[isValidEvent].description)
                    }else{
                        userList.Users[userId].registeredEvent.push(evenList.Events[isValidEvent].description)
                    }

                    fs.writeFile('./data/eventList.json', JSON.stringify(evenList), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                        if (err) {
                            return res.status(500).json({
                                Status: "Failed",
                                message: err.message
                            })
                        } else {
                            fs.writeFile('./data/userList.json', JSON.stringify(userList), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                                if (err) {
                                    return res.status(500).json({
                                        Status: "Failed",
                                        message: err.message
                                    })
                                } else {
                                    res.status(200).json(evenList.Events[isValidEvent].participant)
                                }
                            })
                        }
                    })



                }else{
                    res.status(400).json({
                        status:"Failed",
                        message:"Confirm the registration of the event by 'Yes' format"
                    })
                }

            }else{
                res.status(400).json({
                    status:"Failed",
                    message:"Validation failed"
                })
            }
        }else{
            res.status(401).json({
                message: "Not Authorised"
            })
        }
    }else{
        res.status(401).json({
            message: req.message
        })
    }
})


module.exports = route;