# The Codaisseur Academy Calendar




## Getting started

Link to GETTING_STARTED.md

### Step D: configure backend-settings on your Frontend

1. Click admin-button and you are redirected to the admin-page
2. For the Set-up configuration open your json-file you stored earlier in a text-editor.
3. Copy client_email to the emailbox under set-up configuration.
4. Copy the (very long) private_key and paste it in the private_key box under set-up configuration.
   Be sure to copy everything between the quotation marks, including begin and end of private key and all \n entries.
5. Enter the password from the super-admin (secret) and click submit configuration
6. Open your console log, you should see message: "Google API configuration updated"
7. To do the setup for the calendar id, go to calendar.google.com Go to your calendar settings and copy the agenda id at the bottom of the page and paste it in the calendar id box in the admin page. 
8. Enter the password from the super-admin (secret) and click submit calendar ID. You should see in your console message: "Calendar ID updated"
9. Under setup mail verification, provide the email address and the password of the Gmail address that you created.
10. Enter the password from the super-admin (secret) and click submit mail verification.
11. Make sure that everything is stored in your database on the configuration table.
12. Test everything by registering a new account. You should receive a verification email. Be sure to check your spamfolder.
13. After creating a new account, log back into the Super-Admin, and in the Admin Panel, give the user a rank.
14. Log back into the newly created account. You should now be able to access the calendar and see your test events.

### Step E: Deploying the Backend to Heroku or other production environment

Note: We have not actually deployed to Heroku yet, but we have theorized what steps should be taken.

1. Create a new Heroku server for your Backend. Do NOT push your App to Heroku just yet!!
2. Create a database on your Heroku server: $ heroku addons:create heroku-postgresql:hobby-dev
3. Go to https://dashboard.heroku.com/apps and open the App you just created.
4. Go to Settings at the top, and then click on reveal Config Vars.
5. Add a config variable with key SUPERADMIN and value your own email address (this will be the super admin).
6. Add another config variable with key SAPASSWORD and value a password that you want to use for the admin.
7. After saving both config variables, you can git push your app to Heroku.
8. Change the Frontend so that it connects to Heroku instead of localhost:4000.
9. Follow the configuration steps listed in step D, except log in with the SUPERADMIN and SAPASSWORD values.
10. There should be no "your@email.com" account. You can make sure there is not in the Admin Tools.
   If a "your@email.com" address is created, change it's rank to 0 (unauthorized)!

## Ranks: Users are divided into 5 ranks

0. Unauthorized. All newly created accounts have this rank. They have no rights until a teacher or admin promotes them.
1. Student. These users can see the calendar and the calendar events.
2. Assistant. These users should be able to comment that they want to teach/assist an event (to be implemented).
3. Teacher. These users can promote and demote Unauthorized users(Students and Assistants), but not Teachers or Admins.
4. Admin. These users can promote and demote everyone, including fellow Admins, so beware!
   These users can also change the configuration settings through the Admin Panel.

## Super Admin

There is also a super admin. This email address and password are specified in process.env.SUPERADMIN and process.env.SAPASSWORD in auth/superAdmin.js. This super admin does two things:

1. Every time the Backend is started, it checks if a user exists with email process.env.SUPERADMIN. If no such user exists, a new user is created with email process.env.SUPERADMIN, password process.env.SAPASSWORD, and rank 4.
2. Every time someone logs in, if their email is identical to process.env.SUPERADMIN, and their rank is less than 4, their rank is increased to 4. This prevents others from taking their rank away.

**Note that if you change the process.env.SUPERADMIN and process.env.SAPASSWORD settings, this does not remove the admin accounts that are already created. You still need to demote those old admin accounts manually.**

## Libraries used in back-end

- Nodemailer: In this App, we are dealing with mail through google account. We have used nodemailer for sending the mail to mail-account. Go through for nodemailer in details https://nodemailer.com/about

## Below are the areas which you can start working on, once the app is running

1. When admin logs in initially, the router "/events/:year/:month/:day" in the file calendar/index.js should not be called. It should be called only once the calendar id is setup.

2. On the admin page, under the "Setup email verification" the password at the moment is the passowrd of the user's email id.

- We need the email id and the passowrd of the user to send the verification mail but it would be ridiculous to ask the user for their password as well.
- One way to get the password of the user is by adding a password textfield in the user signup and store the encrypted password(use bcrypt for encryption) in the configuration model in the backend with key as send_password.
- To send the verification mail, you will need to bcrypt the user's password.
- Start with removing the password field in the admin page under setup mail verification.

3. Remove the text under Setup Calendar in the container where it says "Copy paste the following calendar id".

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

### Special thanks to

- **[Thels](https://github.com/ThelsK)**
- **[Patty Ouwehand](https://github.com/pattyouwehand)**
- **[Gijs Maas](https://github.com/gijsmaas82)**
