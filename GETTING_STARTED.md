

# Getting started

**Important!** For this project you will need to have a service account with Google. Both for contacting the Google Calendar API and for the email notifications steps.

Setting up the server will take you some time, so prepare yourself mentally now.


## Step A: Setting up a Google's service account

1. Log out of your existing Gmail account and create a new [Gmail](gmail.com) account for this project, for example *codaisseur-calendar@gmail.com*
2. Go to the [Google Cloud Platform](https://console.cloud.google.com)
3. ![Google cloud Platform](https://i.imgur.com/KBFwYeU.png "Google Cloud Platform")
4. Create a new project and give it a name, location is optional.
5. Click on enable API's and services on the left and search for calendar and click on Google Calendar API and press enable
6. ![Imgur](https://i.imgur.com/Dq57Epn.png)
7. Click on create credentials and "then help me choose" in the drop down menu
8. Which API are you using? Select Google Calendar API in the drop-down-menu
   Where will you be calling the API from?  select webserver.
   What data will you be accessing? Application Data
   Are you planning to use...Engine? Select No
   Click on 'What credentials do i need'
9. Create a service account
    Give your service account a name
    keytype = json
    Click continue and click create without role
10. You will download a json-file. Store this on your computer. You will need this later.
11. Go to calendar.google.com with your cool new gmail-account! 
12. In the left column, under my agendas, click the dots beside your name on the left side of the screen(dots appear when you hover the mouse/cursor on your name) and click settings and sharing.
13. Scroll down to share with specific people and click on "adding people". Insert the email address of your service account with rights "see all event details". Click send. If the account does not show while adding in the last process, because you can only add people from contacts. So, go to gmail, click on the dots(google apps) on the right hand side beside your name, and open contacts. There, add the service gmail account in your contacts. Once that is done, come back and repeat step 11.
If you forgot your service account email, which is not the same as the email your create yourself. go to IAM service          accounts at console.cloud.google.com.
13. Go to your Google calendar and create some test events.

- If you are going to use this gmail address to send verification emails, you also need to perform the following steps.
   (For now you will. Hopefully, you can figure out a better method to send your email.)

14. Click on your google profile icon in the top right, and click on Google-account.
15. Click on Security on the bar at the top of the page.
16. Scroll down to Access for less secure apps, and click Enable Access. Then enable the access.

## Step B: Setup Backend

1. Set up a database with docker at port 5432 with password secret:
   $ docker run -p 5432:5432 --name calendar-api -e POSTGRES_PASSWORD=secret -d postgres
2. Get a clone from the project:
    calendar-api-server (git clone git@github.com:Official-Codaisseur-Graduate/calendar-api-server.git)
3. enter the project with cd calendar-api-server
4. run npm i to install the node_modules
5. start with "node ." (or "nodemon", if you have that installed).
   You should see listening to :4000 and connected to database in your terminal
6. run http :4000 and you should see "message": "incorrect url or authorization token required"
7. Your backend is working!
