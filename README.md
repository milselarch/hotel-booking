# Ascenda Hotel Booking Web App

50.003 hotel booking 1D project website project for Ascenda hotels (C02G01).  
Created using VueJS on the frontend, Django for the backend, and MySQL as our database. 

Live Web App: https://hotels.milselarch.com/
![Screenshot from 2023-11-03 22-50-03](https://github.com/milselarch/hotel-booking/assets/11241733/f2348c67-1118-4129-ad88-d138575d12a1)
![Screenshot from 2022-09-04 11-05-44](https://user-images.githubusercontent.com/11241733/188295622-aef653e1-35b4-4895-8d09-bf4a1ed17c1f.png)


Team members:  
* Lim Thian Yew - [milselarch](https://github.com/milselarch)
* Koh Aik Hong - [ffeew](https://github.com/ffeew)
* Baarath S/O Sellathurai - [joebaarath](https://github.com/joebaarath) and [kingbaarath](https://github.com/kingbaarath)
* Kim Si Eun - [joenkim](https://github.com/joenkim)

# Webapp Installation Instructions

## Backend virtualenv install setup (Ubuntu 20.04)

```shell
sudo apt-get install python3.10
# required to build virtualenv
sudo apt-get install python3.10-distutils python3.10-dev
# required to setup python3.10 venv
sudo apt-get install python3.10-venv

# install pip for python3.10
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10
python3.10 -m pip install virtualenv

# go to project folder 
python3.10 -m pip venv venv 
source venv/bin/activate
(venv)$ python -m pip install -r requirements.txt
```


## Backend virtualenv install setup (Windows)
Pre-Requisite: Ensure Python 3.10 is installed from https://www.python.org/downloads/<br>
Pre-Requisite: Add Python to PATH environment variables in Windows

```shell
# go to project folder to setup virtual env
python -m venv venv
venv\scripts\activate
pip install -r requirements.txt
```

## Fresh DB Installation Instructions:
1) (Ubuntu / Debian only)   
	Install MySQL or MariaDB development packages, depending on which intend to use for as the database engine for this application    

	1.1) MySQL development package download  
	```shell
	sudo apt update
	sudo apt install libmysqlclient-dev
	```

	1.2) MariaDB development package download  
	```shell
	sudo apt update
	sudo apt install libmariadb-dev
	sudo apt-get install mariadb-client mariadb-server
	```

1) Install MySql and Workbench (Products: MySQL Server, MySQL Workbench)  
	and Setup Root password (any password you like)  
	Install Link: https://dev.mysql.com/downloads/windows/installer/8.0.html  
	Video Tutorial: https://www.youtube.com/watch?v=u96rVINbAUI
		
2) In MySQL Workbench, Create a new Connection (any connection name)  
	using the root user account with the rest of the default settings
	
3) Open the connection and then under the query tab,  
	paste the following 4 lines & execute (press the lighting icon) to create an empty DB & mysql user account:  

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

## Backend Setup Instructions:

1) make sure that you provide the environment secret key, email + field hash keys and DB user password in the `.env` config file that should be located in `hotel_booking_django/.env`. For an example of how the backend .env config file should look like do refer to [hotel_booking_django/.env.example](https://github.com/milselarch/hotel-booking/blob/master/hotel_booking_django/.env.example)  
2) create a settings.py file in the `hotel_booking_django/` backend directory and modify it as needed. Copying over `hotel_booking_django/settings.example.py` into 	settings.py` should work right out of the box if you're using MySQL / MariaDB as the database for running this application.  
  
	- If the frontend is accessing the backend using a non-localhost IP / a domain name / using a custom a port number, then you will have to add the custom IP / domain name / custom port to the `ALLOWED_HOSTS` list in `settings.py` as well. See the default list of allowed backend hosts in settings.example.py to get an idea of the expected format required for whitelisting custom backend endpoint IPs / domains.

3) To run the backend code, go to "hotel_booking_django" and run `python manage.py runserver`  
(requires db install instructions and `python manage.py migrate` to have been run already, and for backend .env config file to be setup, and for a settings.py to have been setup already for the django backend application)  

## Elaboration on django backend `hotel_booking_django/.env` config file  
The secret key is a randomly generated string, while the field encryption key and hash keys are randomly generated 32 byte hexadecimal strings. The email and field hash keys are used for ensuring secure encryption and decryption of PII info, while the django secret key is used to ensure secure cryptographic signing by the backend. If you're setting up the backend for the first time you can use the `env_generator.py` under hotel_booking_django to generate the secret, email, and field hash keys.

To use `env_generator.py`, first open the file and fill in your MySQL database credentials. Next, simply run the file to generate the secret, email, and field hash keys, which you can then copy over to the config .env file.

## Frontend node environment setup (Ubuntu 20.04)
[instructions were based on this tutorial](https://tecadmin.net/how-to-install-nvm-on-debian-10/)

Run the following to install and use node v14.19.0 on your system
```bash
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
nvm install 14.19.0 
nvm use 14.19.0  
```

## Frontend node environment setup (Windows)
Note: node versions higher than v14 may not work as intended. Hence if you have a higher version of node, we recommend using windows nvm (https://github.com/coreybutler/nvm-windows) to manage multiple versions of node easily.

#### Option 1: Using Windows NVM (Recommended)
Do the following to install and use node v14.19.0 on your system

Uninstall any previous installation of node<br>
Install the latest release of windows nvm from https://github.com/coreybutler/nvm-windows
```shell
nvm install 14.19.0 
nvm use 14.19.0  
```
#### Option 2: Manual installation
Uninstall any previous installation of node<br>
Download and Install node v14.19.0 from https://nodejs.org/download/release/v14.19.0/

## Frontend setup instructions

1) cd to "dest-search" and run `npm install`
2) copy `dest-search/settings.example.js` into `dest-search/settings.js` file and edit it to specify the backend url endpoints that will be called when the frontend is run in development and production modes
3) to run the frontend code locally use `npm run dev`  
	Note that to use the google maps api (used in the HotelInfo page to show hotel location) in the website you will need to provide
	google map API key credentials in a `.env` config file to be located in `dest-search`.
	Refer to [dest-search/.env.example](https://github.com/milselarch/hotel-booking/blob/master/dest-search/.env.example) for an example of how the config file should look like. Also note that you will have to whitelist your google maps api key on the google maps setup site for the various domains that you intend to run your website on as well (such as localhost:8080, hotels.milselarch.com etc. etc.)
	
4) to run the 56 frontend unit tests in `dest-search/tests/unit`, run `npm run test:unit`. Note that many of the tests require that the backend server also be running at `http://localhost:8000`, so make sure that the backend is running there first before executing the frontend unit tests.
5) to build the frontend code for production deployment, run `npm run build-cli`
6) You can deploy to firebase static hosting after running `npm run build-cli` (and after setting up firebase config in your project) by executing `firebase deploy`	

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
	
## Deployment architecture:
![system-architecture-v2](https://user-images.githubusercontent.com/11241733/184599512-e1a5da21-c38a-4f9c-afb9-11547e05632c.png)  
The frontend is deployed as static webpage files using firebase static web hosting, and secured from DDOS attacks using cloudflare, while the backend + MySQL database server is running on a GCP (Google cloud playform) compute instance and secured from DDOS attacks using cloudflare. The advantage of this arrangement is that static frontend files can be served with caching (as they don't change) + CDN optimisation using firebase's own CDN, and also that the frontend deployment can be done independently from the backend and vice versa. The disadvantage is that our system architecure is slightly more complicated than if we deployed everything on just one server, and that we have to protect the frontend and backend from DDOS attacks seperately as well.
