import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import { getLeaderboard } from "./leaderboard";
const packageJson = require('../package.json');

const BOT_TEST_CHANNEL = process.env.BOT_TEST_CHANNEL;
const CODE_CHANNEL = process.env.CODE_CHANNEL;
const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;
const GENERAL_CHANNEL = process.env.GENERAL_CHANNEL;

const rtm = new RTMClient(SLACK_OAUTH_TOKEN);
const web = new WebClient(SLACK_OAUTH_TOKEN);


rtm.start()
    .catch(console.error);

rtm.on('ready', async () => {
    console.log(`Bot version ${packageJson.version} is online.`);
});


rtm.on('slack_event', async (eventType, event) => {    
    if(event && event.type === 'message'){
        if(event.text === '!ranks') {
            respond(BOT_TEST_CHANNEL, `Leaderboard requested by  <@${event.user}>`);
            const leaderboard = await currentLeaderboard();
            respond(CODE_CHANNEL, leaderboard);
        }
        else if(event.text === '!announceQs') {
            respond(CODE_CHANNEL, 'New questions have just been added to the challenge! Happy solving :)');
        }
        else if(event.text === '!rules') {
            respond(CODE_CHANNEL, 'Rules: \n1.To win you must solve all the questions in the challenge.' + 
                                         '[You can only claim the prize after the questions for the final week have been published]\n' +
                                            '2.Minimum of 8 questions will be given every Sunday afternoon.\n3.No eliminations'); 
        } else if(event.text === '!general') {
            respond(BOT_TEST_CHANNEL, `Weekly announcement requested by  <@${event.user}>`);
            postGeneral();
        }
    }
});

async function currentLeaderboard() {
    return new Promise((resolve, reject) => {
        let msg = 'Current leaderboard:\n*Rank\t\tName\t\tScore*\n';
        getLeaderboard().then(resp => {
                resp.forEach(user => {
                    msg += user.rank + '\t\t' + user.name + '\t\t' + user.score + '\n';
                });
                resolve(msg);
        }).catch(error => {
            console.log(error);
            reject(error);
        });
    })
}

async function postGeneral() {
    let msg = await currentLeaderboard();
    msg += '\n\nJoin us at <#C01BH46BPMF> for regular updates and for more info';
    respond(GENERAL_CHANNEL, msg);
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



