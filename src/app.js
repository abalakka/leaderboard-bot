import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { getLeaderboard } from "./leaderboard";
const packageJson = require('../package.json');

const BOT_TEST_CHANNEL = process.env.BOT_TEST_CHANNEL;
const CODE_CHANNEL = process.env.CODE_CHANNEL;
const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;

const rtm = new RTMClient(SLACK_OAUTH_TOKEN);
const web = new WebClient(SLACK_OAUTH_TOKEN);


rtm.start()
    .catch(console.error);

rtm.on('ready', async () => {
    console.log(`Bot version ${packageJson.version} is online.`);
});


rtm.on('slack_event', async (eventType, event) => {    
    if(event && event.type === 'message'){
        if(event.text === '!hello') {
            respond(BOT_TEST_CHANNEL, `Hello  <@${event.user}>`);
        } 
        else if(event.text === '!ranks') {
            respond(BOT_TEST_CHANNEL, `Leaderboard requested by  <@${event.user}>`);
            let leaderboard = await postLeaderboard();
            respond(BOT_TEST_CHANNEL, leaderboard);
        }
        else if(event.text === '!announceQs') {
            respond(CODE_CHANNEL, 'New questions have just been added to the challenge! Happy solving :)');
        }
        else if(event.text === '!rules') {
            respond(BOT_TEST_CHANNEL, 'Rules: \n1.To win you must solve all the questions in the challenge.' + 
                                         '[You can only claim the prize after the questions for the final week have been published]\n' +
                                            '2.Minimum of 8 questions will be given every Sunday afternoon.\n3.No eliminations'); 
        }
    }
});

async function postLeaderboard() {
    let msg = 'Current leaderboard:\nRank\t\tName\t\tScore\n';
    getLeaderboard().then(resp => {
        resp.forEach(user => {
            msg += user.rank + '\t\t' + user.name + '\t\t' + user.score + '\n';
        });
        // respond(CODE_CHANNEL, msg);
    }).catch(error => {
        console.log(error);
    });
    return msg;
}

async function respond(channel, text) {
    sendMessage(channel, text);
}

async function sendMessage(channel, message) {
    await web.chat.postMessage({
        channel: channel,
        text: message
    });
}



