# greeting-sender
auto birthday greeting sender at 9 AM no matter where the user location is


## Solution
To automatically send special event greeting (currently birthday) to users, I use scheduler that checks every 15 minutes to make sure the application send the greeting at 09:00 am
on any timezone.
Before we can send Users their birthday greet we must create User first (explained at [setup](#Setup)), when Users input their location (latitude, longitude)
system will automatically detect timezone difference between User timezone and server timezone in minutes, the timezone difference data will be helpful to determine
whether it's 09:00 AM in user's location time or not.
The process is divided to several processes:
  1. get all active users that having birthday between three days ago and today (server time), and make sure that users we fetch didn't receive any special greeting from us in that year.
  2. then filtering users live in certain timezone that currently being at 09:00 AM
  3. after that send them birthday greet one by one
      - I tried to send greetings concurrently, but having some issue that will be ellaborated more on [Obstacle](#Obstacle) part
  4. send message based on the day it sent
      - if the message sent on the birthday date -> 'Happy Birthday Robert Megane'
      - if the message sent between 3 days and 1 day after birthday date -> 'Happy Belated Birthday Robert Megane'
  5. update database table to make sure same user don't get birthday message twice in a year from the application

## Obstacle
  As mentioned above, I tried to send birthday message to all users concurrently (divided data per chunk of 50) using axios.all,
  but having trouble to map success and failed responses from hookbin, so i can't update specific success data on the database.
  So i chose approach to send message one by one as long as i get proper response to update greeted user on the database, if You have another solutions please
  i would love to hear more about that.
  

## Setup
1. Run npm install on the directory create file .env with env details sent via email
2. Run Application by entering command “npm start” on terminal, then application will run on http://localhost:8000 or http://localhost:{port of your choice}

Routes:
1. Post User
route example (POST): http://localhost:8000/user

- Request Body:
   - first_name -> alphabet STRING from 1 to 100 characters
   - last_name -> alphabet STRING from 1 to 100 characters
   - birth_date -> DATE in YYYY-MM-DD format
   - location -> JSON that contains
      - latitude -> FLOAT range from -90 to 90
      - longitude -> FLOAT range from -180 to 180  
   - sample request:
   ``` 
   {
   "first_name":"Robert",
   "last_name":"Megane",
   "birth_date":"2001-04-17",
   "location":{
      "latitude":-37.840935,
      "longitude":144.946457
   } 
   }
   ```
   
  - sample success response:
      ``` 
      {
	"code": 200,
	"message": "success",
	"payload": {
		"unique_id": "faa72cc0-bdab-11ec-ba33-d32db72966b5",
		"status": "active",
		"id": 557,
		"first_name": "Robert",
		"last_name": "Megane",
		"location": {
			"latitude": -37.840935,
			"longitude": 144.946457
		},
		"timezone_diff": 180,
		"birth_date": "2001-04-17",
		"birthday_greet_year": [],
		"created_at": 1650130688,
		"updated_at": 1650130688
	} }

2. Delete User
  route example (DELETE): http://localhost:8000/user/{unique_id}
  
  - sample success response:
      ```
      {
	"code": 200,
	"message": "Delete Success",
	"payload": {} }
- sample error response (user doesn't exist or has removed):
    ``` 
    {
	"code": 404,
	"message": "User does not exist",
	"payload": {} }

3. Update User
  route example (PUT): http://localhost:8000/user/{unique_id}
  
  - sample payload:
      ```
      {
	"first_name": "Albanian",
	"last_name": "Man",
	"birth_date": "2004-01-01",
	"location": {
		"latitude": 41.327545,
		"longitude": 19.818699
	} }

- sample success response:
    ```
    {
	"code": 200,
	"message": "Delete Success",
	"payload": {} }

 - sample error response (user doesn't exist or has removed):
      ```
      {
	"code": 404,
	"message": "User does not exist",
	"payload": {} }
