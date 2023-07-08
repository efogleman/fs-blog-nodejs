# NodeJS/Express Back End - Full Stack Blog Site

## Project - Compare React to Angular
This is the NodeJS/Express back end of a full stack blog site, which I built to compare to a similar Angular app. All of it was hand coded by me, while following a LinkedIn Learning course, instructed by Shaun Wassell. The site was deployed as a Google Cloud App, using Firebase for Email/PW Authentication, and utilizes an Atlas (AWS) hosted MongoDB instance.

## Technology Overview
* Front End
  * React 18.2.0
    * `npx create-react-app appname -use-npm`
    * `npm install react-router-dom`
  * Firebase 9.22.2 - Authentication (Email/PW)
    * `npm install @angular/fire firebase`
  * Axios 1.0.4 - Async to call APIs
    * `npm install axios`
* Back End
  * NodeJS
    * `npm init -y`
  * Express - API server
    * `npm install express`
  * Firebase 9.23.0 - Authentication (Google Auth)
    * `npm install firebase-admin`
  * nodemon - Hot Deploy
    * `npm install --save-dev nodemon`
  * DotEnv - Environment Variables Support
    * `npm install dotenv`
  * MongoDB
    * `npm install mongodb`
* Database
  * MongoDB - Started with a local instance, then moved to Atlas (AWS)

## Initial Data
This project uses a combination of static JSON article data (`article-content.js`) for the name/title/content and Mongo Data for the upvotes/comments. The data is joined on the article name. In the future, I may move all the data to Mongo and add pages to manage the blog articles.
```json
db.articles.insertMany([
    {
	name: 'learn-react',
	upvotes: 0,
	comments: [],
	}, {
	name: 'learn-node',
	upvotes: 0,
	comments: [],
	}, {
	name: 'mongodb',
	upvotes: 0,
	comments: [],
	}
])

 ```

## Resources
* LinkedIn Learning Instructor - Shaun Wassell
  * https://www.linkedin.com/learning/instructors/shaun-wassell
* LinkedIn Learning Course - React: Creating and Hosting a Full-Stack Site
  * https://www.linkedin.com/learning/react-creating-and-hosting-a-full-stack-site-15153869
    * Great Course and Teaching


