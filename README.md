# Calendar-api-server
The Server API to share calendar data with the public.

Project team:

- Gijs Maas
- Patty Ouwehand
- Thels de Kwant

### Step-by-step implementation of the calendar-app:

### Important!!
For this project you will need to have a service-account with google. Both for contacting the calendar-api from google and for the emailverification steps for the users of the calendar-app!!

#### Step A: Set-up service account with google

1. Log out of your existing gmail-account. Go to gmail.com and create a new gmail-account for this project. 
2. Go to https://console.cloud.google.com
3. Go to API's and services => dashboard in the left-menu and accept the conditions.
4. Create a new project and give it a projectname (you don't need to give it a location/organization).
5  Click on enable API's and services on the left and search for calendar and click on Google Calendar API and press enable
6. Click on create credentials and "then help me choose" in the drop down menu
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
11. In the left column, under my agendas, click the dots beside your name on the left side of the screen(dots appear when you hover the mouse/cursor on your name) and click settings and sharing.
12. Scroll down to share with specific people and click on "adding people". Insert the email address of your service account with rights "see all event details". Click send. If the account does not show while adding in the last process, because you can only add people from contacts. So, go to gmail, click on the dots(google apps) on the right hand side beside your name, and open contacts. There, add the service gmail account in your contacts. Once that is done, come back and repeat step 11.
If you forgot your service account email, which is not the same as the email your create yourself. go to IAM service          accounts at console.cloud.google.com.
13. Go to your Google calendar and create some test events.

If you are going to use this gmail address to send verification emails, you also need to perform the following steps.
   (For now you will. Hopefully, you can figure out a better method to send your email.)

14. Click on your google profile icon in the top right, and click on Google-account.
15. Click on Security on the bar at the top of the page.
16. Scroll down to Access for less secure apps, and click Enable Access. Then enable the access.

#### Step B: Set up Backend 

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

#### Step C: Set up Frontend

1. Get a clone from the project:
  calendar-api-client (git clone git@github.com:Official-Codaisseur-Graduate/calendar-api-client.git)
2. Enter npm i to install node_modules
3. type npm start to start the app and you should see a login-screen
4. you should be able to log in with Email: "your@email.com" and password="secret"
5. After logging in you should see the calendar
6. If you check the reduxstore you should see a user in your state named super admin with rank 4 and a jwt-token.

#### Step D: configure backend-settings on your Frontend

1. Be sure you are logged in as super-admin when proceeding with the configuration!!
2. Click admin-button and you are redirected to the admin-page
3. For the Set-up configuration open your json-file you stored earlier in a text-editor.
4. Copy client_email to the emailbox under set-up configuration.
5. Copy the (very long) private_key and paste it in the private_key box under set-up configuration.
   Be sure to copy everything between the quotation marks, including begin and end of private key and all \n entries.
6. Enter the password from the super-admin (secret) and click submit configuration
7. Go one page back, and then click the admin-button again to refresh the page.
8. To do the initials setup for the calendar id, go to calendar.google.com with your newly created gmail account and click on setting of the account like you did for step A.12. Copy the agenda id at the bottom of the page and paste it in the calendar id box in the admin page. 
9. Enter the password from the super-admin (secret) and click submit calendar ID.
10. Under setup mail verification, provide the email address and the password of the Gmail address that you created.
11. Enter the password from the super-admin (secret) and click submit mail verification.
12. Make sure that everything is stored in your database on the configuration table.
13. Test everything by registering a new account. You should receive a verification email. Be sure to check your spamfolder.
14. After creating a new account, log back into the Super-Admin, and in the Admin Panel, give the user a rank.
15. Log back into the newly created account. You should now be able to access the calendar and see your test events.

#### Step E: Deploying the Backend to Heroku or other production environment.

Note: We have not actually deployed to Heroku yet, but we have theorized what steps should be taken.

1. Create a new Heroku server for your Backend. Do NOT push your App to Heroku just yet!!
2. Create a database on your Heroku server: $ heroku addons:create heroku-postgresql:hobby-dev
3. Go to https://dashboard.heroku.com/apps and open the App you just created.
4. Go to Settings at the top, and then click on reveal Config Vars.
5. Add a config variable with key SUPERADMIN and value your own email address (this will be the super admin).
6. Add another config variable with key SAPASSWORD and value a password that you want to use for the admin.
7. After saving both config variables, you can git push your app to Heroku.
8. Change the Frontend so that it connects to Heroku instead of localhost:4000.
8. Follow the configuration steps listed in step D, except log in with the SUPERADMIN and SAPASSWORD values.
9. There should be no "your@email.com" account. You can make sure there is not in the Admin Tools.
   If a "your@email.com" address is created, change it's rank to 0 (unauthorized)!

### Ranks: Users are divided into 5 ranks:

0. Unauthorized. All newly created accounts have this rank. They have no rights until a teacher or admin promotes them.
1. Student. These users can see the calendar and the calendar events.
2. Assistant. These users should be able to comment that they want to teach/assist an event (to be implemented).
3. Teacher. These users can promote and demote Unauthorized users(Students and Assistants), but not Teachers or Admins.
4. Admin. These users can promote and demote everyone, including fellow Admins, so beware!
   These users can also change the configuration settings through the Admin Panel.

### Super Admin

There is also a super admin. This email address and password are specified in process.env.SUPERADMIN and process.env.SAPASSWORD in auth/superAdmin.js. This super admin does two things:

1. Every time the Backend is started, it checks if a user exists with email process.env.SUPERADMIN. If no such user exists, a new user is created with email process.env.SUPERADMIN, password process.env.SAPASSWORD, and rank 4.
2. Every time someone logs in, if their email is identical to process.env.SUPERADMIN, and their rank is less than 4, their rank is increased to 4. This prevents others from taking their rank away.


## Libraries used in back-end
- Nodemailer: In this App, we are dealing with mail through google account. We have used nodemailer for sending the mail to mail-account. Go through for nodemailer in details https://nodemailer.com/about.


##### Note that if you change the process.env.SUPERADMIN and process.env.SAPASSWORD settings, this does not remove the admin accounts that are already created. You still need to demote those old admin accounts manually.

### Below are the areas which you can start working on, once the app is running:

1. When admin logs in initially, the router "/events/:year/:month/:day" in the file calendar/index.js should not be called. It should be called only once the calendar id is setup.

2. On the admin page, under the "Setup email verification" the password at the moment is the passowrd of the user's  email    id. 
- We need the email id and the passowrd of the user to send the verification mail but it would be ridiculous to ask the user for their password as well. 
- One way to get the password of the user is by adding a password textfield in the user signup and store the encrypted password(use bcrypt for encryption) in the configuration model in the backend with key as send_password.
- To send the verification mail, you will need to bcrypt the user's password.
- Start with removing the password field in the admin page under setup mail verification.

3 Remove the text under Setup Calendar in the container where it says "Copy paste the following calendar id".

### Future groups, you are of course welcome to come up with your own tweaks and features to implement, but here are a list of ideas/hints that we would have integrated, had we more time:

1. Setup proper routing on the Frontend:
- Only displaying the user email and rank to teachers and admins where they can change rank.
- Make a list of unauthorized users appear after logging in as a teacher(rank 3). At the moment teachers do not have a button to change the rank of the users. To do that, once the list of unauthorized users are shown, the teacher clicks on a user where he can change the rank. To implement rank, provide 2 buttons(rank 1 and 2). The teacher can decide the rank of the user. Store the rank of the corresponding user in the database. There is some grey area here, and you are free to take any approach suitable to you.

2. Setup proper .css styling on the Frontend.

3. In the backend, if the send email credentials are sent incorrectly, it should properly throw an error while trying to send an email, and return an Internal Server Error to the Frontend. Currently, the Frontend receives a message that the verification email has been sent. 

4. Implement "Change my email" functionality on Backend and Frontend, with email verification step.

5. Implement "Change my display name" functionality on Backend and Frontend.

6. Implement key checking for the google api’s

7. Implement notification emails

8. In the backend, move the baseUrl from a hardcoded string in the URL to a configuration option stored in the database. Add a "set frontend url" functionality on Backend and Frontend, similar to setting the Google API settings.

9. In the backend, when setting a new Google API email_client and private_key, test if these connect properly before updating the database.

10. In the backend, add an email notification for users whenever a teacher or admin changes their rank.

11. In the backend, add an email notification to a specific email address whenever a new account completes registration. This target email address should be configured and stored in the database, so there should be a "Set notification email" functionality on Backend and Frontend, similar to setting the Google API settings.

12. Integrate the project with the Codaisseur Readest App. Talk to Wouter de Vos for details.
