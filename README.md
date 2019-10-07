# calendar-api-server
The Server API to share calendar data with the public.

Step-by-step implementation of the calendar-app:

Important!!
For this project you will need to have a service-account with google. Both for contacting the calendar-api from google and for the emailverification steps for the users of the calendar-app!!

Step A: Set-up service account with google

1. Log out of your existing gmail-account. Go to gmail.com and create a new gmail-account for this project. 
2. Go to https://console.cloud.google.com
3. Go to API's and services => dashboard in the left-menu and accept the conditions
4. Create a new project and give it a projectname (you don't need to give it a location/organization)
5  Click on enable API's and services and search for calendar and click on Google Calendar API and press enable
6. Click on create credentials
7. Which API are you using? Select Google Calendar API in the drop-down-menu
   Where will you be calling the API from?  select webserver.
   What data will you be accessing? Application Data
   Are you planning to use...Engine? Select No
   Click on 'What credentials do i need'
8. Create a service account
    Give your service account a name
    keytype = json
    Click continue and click create without role
9. You will download a json-file. Store this on your computer. You will need this later.
10. Go to calendar.google.com with your cool new gmail-account! 
11. In the left column click the dots behind your name and click configuration and share.
12. Click 'add people' and insert the email adres of your service account and click send.
   If you forgot your service account email, which is not the same as the email your create yourself. go to IAM service          accounts at console.cloud.google.com.
13. Go to your Google calendar and create some test events.


Step B: Set up Backend 

1. Set up a database with docker at port 5432 with password secret
2. Get a clone from the project: 
    calendar-api-server (git clone git@github.com:Official-Codaisseur-Graduate/calendar-api-server.git)
3. enter the project with cd calendar-api-server
4. run npm i to install the node_modules
5. start with nodemon, you should see listening to :4000 and connected to database in your terminal
6. run http :4000 and you should see "message": "incorrect url or authorization token required"
7. Your backend is working!

Step C: Set up Frontend

1. Get a clone from the project:
  calendar-api-client (git clone git@github.com:Official-Codaisseur-Graduate/calendar-api-client.git)
2. Enter npm i to install node_modules
3. type npm start to start the app and you should see a login-screen
4. you should be able to log in with Email: "your@email.com" and password="secret"
5. After logging in you should see the calendar
6. If you check the reduxstore you should see a user in your state named super admin with rank 4 and a jwt-token.

Step D: configure backend-settings on your frontend

1. Be sure you are logged in as super-admin when proceeding with the configuration!!
2. Click admin-button and you are redirected to the admin-page
3. For the Set-up configuration open your json-file you stored earlier in a text-editor.
4. Copy client_email to the emailbox under set-up configuration.
5. Copy the (very long) private_key and paste it in the private_key box under set-up configuration.
6. Enter the password from the super-admin (secret) and click submit configuration
7. 

 
