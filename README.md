# leaderboard-bot

## Helper slack bot for code challenge that is heroku ready.

Be sure to disable the web process that heroku creates by default

Note: Be sure to create your own src/secrets.js for credential management.


## To deploy to heroku

    heroku login
    heroku create
    git push heroku master

### To check heroku logs
    heroku logs --tail