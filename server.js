const express = require('express');
const app = express();
const fetch = require('node-fetch');
const telegramBot = require('node-telegram-bot-api');
const http = require('request');
const token = '513820071:AAEaqzx-H_dwH-OTVJppz4XMS16nSrRtmKE';

// definding bot with API TOKEN
const almadih = new telegramBot(token, {
    polling: true
});

// youtube download api endpoint
const APIUrl = 'https://baixaryoutube.net/@api/json/videos/';

// to get video download info
async function getVidInfo(vid) {
    let res = await fetch(APIUrl + vid);
    let data = await res.json();
    return data;
};

// to get MP3 for the video 
async function getMp3(vid){
    let res = await fetch('https://baixaryoutube.net/@api/json/mp3/'+vid);
    let data = await res.json();
    return data;
}


//listening for incoming messages
almadih.on('message', (msg) => {
   
    //getting the chat id to use it for replay
    const chatId = msg.chat.id;
    
    //checking if the link is valid
    let vid = msg.text.toLowerCase().search('youtube');
    
    //getting the youtube video id to use to fetch its info
    let tt = msg.text.substring(msg.text.length - 11, msg.text.length);
    
    //sending welcome message if the user is new
    if (msg.text === '/start') {
        almadih.sendMessage(chatId, 'Welcome please send youtube URL to download the video and MP3');
        
        //if the link is valid
    } else if (vid != -1) {
        let title;
        let vidData = 'Error';
        getVidInfo(tt).then(data => {
            vidData = '';
            title = data.vidTitle;
            vidData = `${title} \n`;
            for (var key in data.vidInfo) {
                vidData += `Qualtiy : <b>${data.vidInfo[key].quality}</b>  Size : <b>${data.vidInfo[key].rSize}</b>  <a href="${data.vidInfo[key].directurl}">Link</a> \n`;
            }
            
            getMp3(tt).then(d =>{
                
                let mp3 = `Quality : <b>MP3</b>  Size : <b>${d.vidInfo[0].mp3size}</b>  <a href="http:${d.vidInfo[0].dloadUrl}">Link</a> \n`;
                
                vidData += mp3;
                 almadih.sendMessage(chatId, vidData, {parse_mode: 'HTML'});
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
        
        //if the link not valid
    } else {
        almadih.sendMessage(chatId, 'please send a valid url');
    }
});


// server listener
const listener = app.listen(3000, () => {
    console.log(`Your app is listening on port ${listener.address().port}`)
});




/// polling errors handling

almadih.on('polling_error', (error) => {
    console.log(error); // => 'EFATAL'
});

