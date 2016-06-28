var express = require('express')
var bodeParser = require('body-parser')
var request = reqire('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

//Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

//Process application/json
app.use(bodyParser.json())

//Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

//for Facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

//Spin up the server
app.listen(app.get('port'), function () {
  console.log('running on port', app.get('port'))
})

//API End Point - added by Stefan
app.post('/webhook/', function(req, res) {
  messaging_events = req.body.entry[0].messaging
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]
    sender = event.sender.text
    if (event.message && event.messagee.text) {
      text = event.message.text
      if (text === 'Hola') {
        sendGenericMessage(sender)
        continue
      }
      sendTextMessage(sender, "Parrot:
       " + text.substring(0, 200))
    }
    if (event.postback) {
      text = JSON.stringify(event.postback)
      sentTextMessage(sender, "Postback received: " + text.sbstring(0, 200), token)
      continue
    }
  }
  res.sendStatus(200)
})
var token = "EAAYMofzzI48BANAkz2GeBJHePaxEhraPkjtewNjdZCdiDjGHgUPKZBu9KH5UkCKdrw9ZClvkzjT86V3hf8lfYP9PghLrNSgZBZAxkIaTvZAHo9phzWfHej2yOIRoJzSnVDvR2KvsoH3IhRIZCVyLi0dZAoZCfBEZCuILD71fbNJ8YYRAZDZD"

//function to echo back messages 

  function sendTextMessage(sender, text) {
    messageData = {
      text:text
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages'
      qs: {access_token:token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log("Error sending messages: ", error)
      } else if (response.body.error) {
        console.log('Error: ', response.body.error)
      }
    })
  }

  //Send a test message back as two cards.
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
                        "payload": "Life is quite meaningful.",
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