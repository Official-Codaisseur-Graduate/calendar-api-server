

# Getting started

**Important!** For this project you will need to have a service account with Google. Both for contacting the Google Calendar API and for the email notifications steps.

Setting up the server will take you some time, so prepare yourself mentally now.


## Step A: Setting up a Google's service account

1. Log out of your existing Gmail account and create a new [Gmail](gmail.com) account for this project, for example *codaisseur-calendar@gmail.com*
   
2. Go to the [Google Cloud Platform](https://console.cloud.google.com)

3. Accept the Terms and go to APIs & Services 
   
   ![Google cloud Platform](https://i.imgur.com/KBFwYeU.png "Google Cloud Platform")

4. Create a new project and give it a name, location is optional

5. Click on __ENABLE APIS AND SERVICES__, search for Calendar and enable the __Google Calendar API__

6. ![Imgur](https://i.imgur.com/Dq57Epn.png)

7. Click on __Create credentials__ and then select __"Help me choose"__ in the drop down menu
   - __Which API are you using?__ Select *Google Calendar API*
   - __Where will you be calling the API from?__  Select *Web server (e.g. node.js, Tomcat)*
   - __What data will you be accessing?_ Select *Application Data*
   - __Are you planning to use this API with App Engine or Compute Engine?__ Select *No, I'm not using them*
   - Click on __"What credentials do i need?"__
  
8. Now create a service account
    - Give your service account a name, for example *codaisseur-calendar*
    - __Key type__ Select *JSON*
    - Continue and create without role
9.  Your service account and key were created, you have now automatically downloaded a json file, for example *My Project 46545-ee94a5ed37e1.json*. 
    - __Save it! You will need this information later in the setting up of the backend__
10. Now go to [Google Calendar](http://calendar.google.com/) with your newly created Gmail account
11. In the left column, under __My calendars__, click the dots beside your name on the left side and choose __Settings and sharing__
    - ![Google Calendar Sharing settings ](https://i.imgur.com/rYPcvEm.png)
12. Scroll down to __"Share with specific people"__ and click on __"Add people"__. Insert the email address of your service account, (e.g. *this-is-a-name@concise-booking-261511.iam.gserviceaccount.com*) with the rights to __"See all event details"__. Click send. If the account does not show while adding in the last process, because you can only add people from contacts. 
    - If you forgot your service account email go to IAM service accounts at [Google Cloud Platform](https://console.cloud.google.com)

13. Go back to your Google Calendar and create some test events




**Important!** If you are going to use this Gmail account to send emails to the users, you need to perform the following steps:
1.  Click on your Google profile icon in the top right, and click on Google Account.
2.  Click on __Security__ on the bar at the top of the page.
3.  Scroll down to __Access for less secure apps__, and click __Enable Access__. 

--------

## Step B: Setup Backend

1. Set up a __Postgres database__ with docker at port 5432 with password *secret*:

    ```$ docker run -p 5432:5432 --name calendar-api -e POSTGRES_PASSWORD=secret -d postgres```
2. Clone the project
3. 
    ```$ git clone git clone git@github.com:Official-Codaisseur-Graduate/calendar-api-server.git```
4. Run `npm install` from the project folder
   
5. Start the server with `node .` or `npx nodemon`, if you have nodemon installed
6. You should see `listening to :4000`  and `Connected to database` in your terminal
7. run `http :4000` and you should see `{message": "incorrect url or authorization token required"}`
   
8. Your server is running!

-----

## Step C: Configuration of the Google Calendar API in your app

### Go to the [calendar-api-client](https://github.com/Official-Codaisseur-Graduate/calendar-api-client) repository and set up the front end.

1. Login in with __your@email.com__ and password: __secret__ and then go to Admin Panel

  ![Admin panel](https://i.imgur.com/0QoXxsl.png) 

2. __Open the .json you downloaded earlier__
   
3. The Google Calendar API configuration: 
   - You will find the client mail and the private key in the .json
  
    ![Google Calendar API](https://i.imgur.com/SC583Mw.png)

4. The Google Calendar ID configuration:
   
    ![Calendar ID](https://i.imgur.com/q99UsWs.png)

5. The Mail verification configuration:

    ![Mail verification](https://i.imgur.com/yFpoYW7.png)


__If all went well, you have now successfully setup your backend! IF you now go to Codaisseur Academy (the homepage) you should see the test events you created in Step A.__




## Setup of the frontend
 
 1. Clone the `calendar-api-client` repository: 
 2. 
    ```$ git clone git clone git@github.com:Official-Codaisseur-Graduate/calendar-api-client.git```

1. Run `npm install` from the project folder
   
2. Start the client with `npm run start`

3. The client should now automatically load in your browser.
   
3. Your client is running!

-----