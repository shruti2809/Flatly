'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender)
                continue
            }
            else if (text === 'Cartoons') {
                sendCartoonMessage(sender)
                continue
            }
            else if (text === 'hi'|| text === 'Hi' || text === 'Hello') {
                sendReplyToHiMessage(sender)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

const token = "EAAYMofzzI48BANAkz2GeBJHePaxEhraPkjtewNjdZCdiDjGHgUPKZBu9KH5UkCKdrw9ZClvkzjT86V3hf8lfYP9PghLrNSgZBZAxkIaTvZAHo9phzWfHej2yOIRoJzSnVDvR2KvsoH3IhRIZCVyLi0dZAoZCfBEZCuILD71fbNJ8YYRAZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "First element",
                    "image_url": "http://i280.photobucket.com/albums/kk176/shruti28009/d2_zps5k4xcryx.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "Messenger URL"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "second element",
                    "image_url": "http://i280.photobucket.com/albums/kk176/shruti28009/d1_zps2gztnqo1.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "Messenger URL"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendCartoonMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "First element",
                    "image_url": "http://i280.photobucket.com/albums/kk176/shruti28009/c1_zpsmpvokudw.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://garfield.com/",
                        "title": "Garfield's website URL"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "second element",
                    "image_url": "http://i280.photobucket.com/albums/kk176/shruti28009/c2_zpskdjdv5yx.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/TomandJerry/",
                        "title": "Jerry's fb page URL"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
// Reply to "hi" or "Hi" or "Hello"
function sendReplyToHiMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Hi there! I am flatshare Bot. Can you tell me what are you looking for?",
                    //"subtitle": "",
                  //"image_url": "http://i280.photobucket.com/albums/kk176/shruti28009/c1_zpsmpvokudw.jpg",
                    "buttons": [{
                        "type": "postback",
                        //"url": "https://garfield.com/",
                        "title": "1. Room in a flat",
                        "payload": "Payload for first element in a generic bubble",
                    }, {
                      {
                          "type": "postback",
                          //"url": "https://garfield.com/",
                          "title": "2. Flatmate",
                          "payload": "Payload for second element in a generic bubble",
                      }
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
