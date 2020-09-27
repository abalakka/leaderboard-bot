import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { getLeaderboard } from "./leaderboard";

const BOT_TEST_CHANNEL = process.env.BOT_TEST_CHANNEL;
const CODE_CHANNEL = process.env.CODE_CHANNEL;
const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;

console.log(SLACK_OAUTH_TOKEN);
console.log(BOT_TEST_CHANNEL);

const rtm = new RTMClient(SLACK_OAUTH_TOKEN);
const web = new WebClient(SLACK_OAUTH_TOKEN);


rtm.start()
    .catch(console.error);

rtm.on('ready', async () => {
    console.log("Bot started");
    sendMessage(BOT_TEST_CHANNEL, 'Bot online');
});


rtm.on('slack_event', async (eventType, event) => {    
    if(event && event.type === 'message'){
        if(event.text === '!hello') {
            respond(BOT_TEST_CHANNEL, `Hello  <@${event.user}>`);
        } 
        else if(event.text === '!ranks') {
            respond(BOT_TEST_CHANNEL, `Leaderboard requested by  <@${event.user}>`);
            let msg = 'Todays leaderboard:\nRank\t\tName\n';
            getLeaderboard().then(resp => {
                resp.forEach(user => {
                    msg += user.rank + '\t\t' + user.name  + '\n';
                });
                respond(BOT_TEST_CHANNEL, msg);
            }).catch(error => {
                console.log(error);
            });
        }
        else if(event.text === '!announceQs') {
            respond(CODE_CHANNEL, 'New questions have just been added to the challenge! Happy solving :)');
        }
    }
});

async function respond(channel, text) {
    sendMessage(channel, text);
}

async function sendMessage(channel, message) {
    await web.chat.postMessage({
        channel: channel,
        text: message
    });
}



