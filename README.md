# Run Tracker App

## LINK TO THE APP:
[https://pure-peak-20096.herokuapp.com/](https://pure-peak-20096.herokuapp.com/)

## SUMMARY
This app is intended for athletes that wish to log their running activities and share them with other users on the platform. The design is inspired by glitch.com

## WHAT THE USER CAN DO:

* register
* login (credentials: email, password)
* see his previous posts (my runs page)
* see all posts from other users on the platform (home page)
* see posts only from a specific user
* create a new post (run)
* update an existing post
* delete a post
* change his avatar
* change his full name
* change his display name
* delete his account

## BUILT WITH:

**SERVER**: NODE.JS (RESTful API on EXPRESS.JS)

**DATABASE**: MONGODB

**ORM LAYER**: MONGOOSE

**TESTING**: MOCHA, CHAI

**CONTINUOS INTEGRATION**: TRAVISCI

**CLIENT SIDE**: HTML5, CSS3, ES6 JAVASCRIPT (MVC architecure)

**AUTOMATION**: WEBPACK

## DESIGN PARADIGMS

* mobile-first
* RWD
* a11y
* SEO
* cross-browser compatibility

## SCREENSHOTS (DESKTOP)

Home feed (logged out):

![Image showing the app home feed logged out](app/public/dist/img/homeFeed1.png "Home feed logged out")

Registration form:

![Image showing the registration form](app/public/dist/img/registerForm.png "Registration form")

Home Feed (logged in):

![Image showing the app home feed logged in](app/public/dist/img/homeFeed2.png "Home feed logged in")

My Runs Page:

![Image showing the My Runs Page](app/public/dist/img/MyRuns.png "My Runs")

My Profile Page:

![Image showing the My Profile Page](app/public/dist/img/myProfileEdit.png "My Profile")

Choose Avatar Menu:

![Image showing the Avatar select dropdown menu](app/public/dist/img/chooseAvatar.png "Choose Avatar")


Add New Run form:

![Image showing the add new run form](app/public/dist/img/addNewRunForm.png "Add New Run form")

Edit Run form:

![Image showing the Edit Run form](app/public/dist/img/editRun.png "Edit Run form")

## WHAT IS PLANNED FOR FUTURE DEVELOPMENT:
* login with google or facebook using the OAUTH protocol
* enable users to upvote/downvote posts
* enable users to analyze their running progress on a weekly/monthly basis (implement graphs with D3.js library)
* enable sharing posts to other social networks
* enable importing running activity from third-party API's (like Strava)
* implement cookie-based (session) authorization
* create a real-time app using the WebSocket protocol
