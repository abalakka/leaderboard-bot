# leaderboard-bot

## Helper slack bot for code challenge that is heroku ready.

Be sure to disable the web process that heroku creates by default

## Prerequisites

    NPM, Node, Yarn and Heroku CLI


## To run locally

    i. Set all the required env variables
    ii. npm i
    iii. yarn start



## Steps to deploy to heroku

    heroku login
    heroku create
    git push heroku master
    Set the required env variables in Heroku.
    heroku ps:scale worker=1

### To verify if instance is running
    heroku ps


### To check heroku logs
    heroku logs --tail