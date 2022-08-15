# A+ Ascenda Hotel Booking Web App

![Screenshot from 2022-08-13 01-39-38](https://user-images.githubusercontent.com/11241733/184531792-60043299-2f72-4f4d-80ae-1bfc58fae95f.png)

## Backend virtualenv install setup (Ubuntu 20.04)

```shell
sudo apt-get install python3.10
# required to build virtualenv
sudo apt-get install python3.10-distutils python3.10-dev
# required to setup python3.10 venv
sudo apt-get install python3.10-venv
# reqiored by django to access mysql database
sudo apt-get install libmysqlclient-dev

# install pip for python3.10
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10
python3.10 -m pip install virtualenv

# go to project folder 
python3.10 -m pip venv venv 
source venv/bin/activate
(venv)$ python -m pip install -r requirements.txt
```

# DB Install Instructions
## Fresh DB Install Instructions:
1) Install MySql and Workbench (Products: MySQL Server, MySQL Workbench)  
	and Setup Root password (any password you like)  
	Install Link: https://dev.mysql.com/downloads/windows/installer/8.0.html  
	Video Tutorial: https://www.youtube.com/watch?v=u96rVINbAUI
		
2) In MySQL Workbench, Create a new Connection (any connection name)  
	using the root user account with the rest of the default settings
	
3) Open the connection and then under the query tab,  
	paste the following 4 lines  
	& execute (press the lighting icon) to create an empty DB & mysql user account:  

```sql
CREATE DATABASE hotel_booking;  
CREATE USER 'esc_server'@'localhost' IDENTIFIED BY 'AS12qw34!@';
GRANT ALL PRIVILEGES ON *.* TO 'esc_server'@'localhost';  
FLUSH PRIVILEGES;
```
	
4) Open your terminal and cd to your git project folder.  
	Activate Python Virtual Environment: `<virtual_environment_name>\scripts\activate`  
	Run `pip install -r requirements.txt` if you have not already,  
	which ensures that mysqlclient is installed as a python package

5) cd to "hotel_booking_django" and run `python manage.py migrate`

DONE.

Before running the backend, make sure that you provide the environment secret key, email + field hash keys and DB user password in the `.env` config file that should be located in `hotel_booking_django/.env`. For an example of how the backend .env config file should look like do refer to [hotel_booking_django/.env.example](https://github.com/milselarch/hotel-booking/blob/master/hotel_booking_django/.env.example)  

To run the backend code, go to "hotel_booking_django" and run `python manage.py runserver`  
(requires db install instructions and `python manage.py migrate` to have been run already, and for backend .env config file to be setup)  

## Elaboration on django backend `hotel_booking_django/.env` config file  
The secret key, email and field hash keys are random generated strings, so if you're setting up the backend for the first time you can just assign randomly generated strings to those config fields. The email and field hash keys are used for ensuring secure encryption and decryption of PII info, while the django secret key is used to ensure secure cryptographic signing by the backend.   

## Frontend node environment setup (Ubuntu 20.04)
[instructions were based on this tutorial](https://tecadmin.net/how-to-install-nvm-on-debian-10/)

Run the following to install and use node v14.19.0 on your system
```bash
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
nvm install 14.19.0 
nvm use 14.19.0  
```

## Frontend setup instructions

1) cd to "dest-search" and run `npm install`  
2) to run the frontend code locally use `npm run dev`  
	Note that to use the google maps api (used in the HotelInfo page to show hotel location) in the website you will need to provide
	google map API key credentials in a `.env` config file to be located in `dest-search`.
	Refer to [dest-search/.env.example](https://github.com/milselarch/hotel-booking/blob/master/dest-search/.env.example) for an example of how the config file should look like. Also note that you will have to whitelist your google maps api key on the google maps setup site for the various domains that you intend to run your website on as well (such as localhost:8080, hotels.milselarch.com etc. etc.)
	
3) to run the 56 frontend unit tests in `dest-search/tests/unit`, run `npm run test:unit`. Note that many of the tests require that the backend server also be running at `http://localhost:8000`, so make sure that the backend is running there first before executing the frontend unit tests.
4) to build the frontend code for production deployment, run `npm run build-cli`
5) You can deploy to firebase static hosting after running `npm run build-cli` (and after setting up firebase config in your project) by executing `firebase deploy`	

## SQL Version Control Flow:
1) After any "models.py" changes are made in django,  
switch to command line, cd to "<git_project_root_folder>\hotel_booking_django"

2) run `python manage.py makemigrations`   
	This would create "migration" scripts  
	under the migrations folder for the respective app folder
	
3) run `python manage.py migrate`

4) Before commiting this migration scripts into git,  
	ensure you've pulled the latest files  
	and in the migrations folder of the corresponding django app (i.e "<git_project_root_folder>\hotel_booking_django\accounts\migrations"),  
	__ensure your newly generated script's running number does not conflict with existing scripts.__  
	If the number conflicts, ensure you __rename your script file name with the next appropriate number__.  
	>Note: the running number is the number in the file name.  
	i.e. for the script ***0023***_script_description.py, the number is 0023
	
5) Ensure that you do a run `python manage.py migrate` 
	and that there is no errors before commiting & pushing into git
