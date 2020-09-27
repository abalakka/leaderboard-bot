# leaderboard-bot

## Helper slack bot for code challenge that is heroku ready.

Be sure to disable the web process that heroku creates by default

Note: Set the 3 env variables required in app.js


## Steps to deploy to heroku

    heroku login
    heroku create
    git push heroku master
    heroku ps:scale worker=1

### To verify if instance is running
    heroku ps


### To check heroku logs
    heroku logs --tail