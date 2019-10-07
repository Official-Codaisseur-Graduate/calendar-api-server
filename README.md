# calendar-api-server
The Server API to share calendar data with the public.

Step-by-step implementation of the calendar-app:

Important!!
For this project you will need to have a service-account with google. Both for contacting the calendar-api from google and for the emailverification steps for the users of the calendar-app!!

Step A: Set-up service account with google

1. Log out of your existing gmail-account. Go to gmail.com and create a new gmail-account for this project. 
2. Go to https://console.cloud.google.com and accept the conditions to proceed.
3. Go to API's and services => dashboard in the left-menu
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
10. Add some calendar-events in your calendar at calendar.google.com with your cool new gmail-account! For testing purposes         ofcourse


Step B: Set up Backend 

1. Set up a database with docker at port 5432 with password secret
2. Get a clone or download both projects: calendar-api-server (backend) and calendar-api-client (frontend)
