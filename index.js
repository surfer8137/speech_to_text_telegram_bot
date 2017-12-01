const Telegraf = require('telegraf')
const GET      = require('get-json')
const config   = require('./lib/config.js')
const http     = require('http');
const fs       = require('fs');
const request  = require('request');

const VOICE_EVENT         = 'voice'
const config_data         = config.data()
const BOT_TOKEN           = config_data['TELEGRAM_BOT_TOKEN']
const WATSON_USERNAME     = config_data['WATSON_USER']
const WATSON_PASSWORD     = config_data['WATSON_PASSWORD']

const BASE_URL_AUDIO_PATH = 'https://api.telegram.org/bot' + BOT_TOKEN + '/getFile?file_id='
const BASE_URL_AUDIO_FILE = 'http://api.telegram.org/file/bot' + BOT_TOKEN + '/'
const bot                 = new Telegraf(BOT_TOKEN)

var watson         = require('watson-developer-cloud/')
var speech_to_text = new watson.SpeechToTextV1({
  username: WATSON_USERNAME,
  password: WATSON_PASSWORD
  })

bot.on(VOICE_EVENT, (context) => {
  var file_id = context.message.voice.file_id


  GET(BASE_URL_AUDIO_PATH + file_id, function(error, response){
    var file_path = response.result.file_path
    var local_file_path = file_id

    request
      .get(BASE_URL_AUDIO_FILE + file_path)
      .on('error', function(err) {
        // handle error
      })
      .on('end', function(){
          var params = {
            audio: fs.createReadStream(file_id + '.ogg'),
            content_type: 'audio/ogg;codecs=opus',
            model: 'es-ES_BroadbandModel'
          }

          //Reply with text from the voice
          speech_to_text.recognize(params, function(err, res) {
          if (err)
            console.log(err)
          else
            context.reply(res.results[0].alternatives[0].transcript)
          })

          //Removing audio file created
          fs.unlink(local_file_path, function(error){
          })
    })
      .pipe(fs.createWriteStream(file_id + '.ogg'))


  })
})

bot.startPolling()
