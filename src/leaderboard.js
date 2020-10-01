const https = require('https');

const options = {
    hostname: 'www.hackerrank.com',
    headers: {'Content-Type': 'application/json', 'User-Agent' : 'PostmanRuntime/7.26.2'},
    path: '/rest/contests/wissen-coding-challenge-2021/leaderboard?offset=0&limit=20',
    method: 'GET'
  }


export function getLeaderboard() {
    return new Promise((resolve, reject) => {
        let req = https.request(options, res => {
            let data = '';
        
            res.on('data', chunk => {
                data += chunk;
            });
        
            let ret = [];
            res.on('end', () => {
                let users = JSON.parse(data).models;
                users.forEach(user => {
                    ret.push({ rank: user.rank, name: user.hacker, score: user.score });
                });
                resolve(ret);
            });
        
            
        }).on('error', error => {
            reject(error);
        });

        req.end();
    });
}


