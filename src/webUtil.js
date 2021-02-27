const https = require('https');
const nodemailer = require('nodemailer');

const codeChallengeOptions = {
    hostname: process.env.CODE,
    headers: {'Content-Type': 'application/json', 'User-Agent' : 'PostmanRuntime/7.26.2'},
    path: '/rest/contests/wissen-coding-challenge-2021/leaderboard?offset=0&limit=25',
    method: 'GET'
}


const coursePricesOptions = {
    hostname: process.env.COURSE,
    headers: {'Content-Type': 'application/json', 'User-Agent' : 'PostmanRuntime/7.26.2','Cookie': process.env.COOKIE }, // 
    path: '/api-2.0/pricing/?course_ids=1692036,756150&fields[pricing_result]=price,discount_price',
    method: 'GET'
}

export function getLeaderboard() {
    return new Promise((resolve, reject) => {
        let req = https.request(codeChallengeOptions, res => {
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


export function getCoursePrices() {
    return new Promise((resolve, reject) => {
        let req = https.request(coursePricesOptions, res => {
            let data = '';
        
            res.on('data', chunk => {
                data += chunk;
            });
        
            let ret = [];
            res.on('end', () => {
                let courseDetails = JSON.parse(data).courses;
                let javaMasterclass = courseDetails['1692036'];
                let angularMasterclass = courseDetails['756150'];
                ret.push({name: 'Java masterclass', price: javaMasterclass.price.amount, discountedPrice: getDiscountedPrice(javaMasterclass.discount_price)});
                ret.push({name: 'Angular masterclass', price: angularMasterclass.price.amount, discountedPrice: getDiscountedPrice(angularMasterclass.discount_price)});
                resolve(ret);
            });   
        }).on('error', error => {
            reject(error);
        });

        req.end();
    });
}

function getDiscountedPrice(discountedPrice) {
    if(discountedPrice == null)
        return -1;
    else
        return discountedPrice.amount;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_SECRET
    }
  });

const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    text: 'Auto generated email'
  };

export async function sendMail() {
    const prices = await getCoursePrices();
    let isDiscounted = false;
    prices.forEach(course => {
        if(course.discountedPrice != '-1')
            isDiscounted = true;
    })
    
    mailOptions.subject = isDiscounted ? "Possible discount detected on courses" : "No discount detected on courses";
    
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
