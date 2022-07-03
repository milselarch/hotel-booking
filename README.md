# hotel-booking

# Backend virtualenv setup
## Ubuntu 20.04

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
GRANT ALL PRIVILEGES ON hotel_booking . * TO 'esc_server'@'localhost';  
FLUSH PRIVILEGES;
```
	
4) Open your terminal and cd to your git project folder.  
	Activate Python Virtual Environment: `<virtual_environment_name>\scripts\activate`  
	Run `pip install -r requirements.txt` if you have not already,  
	which ensures that mysqlclient is installed as a python package

5) cd to "hotel_booking_django" and run `python manage.py migrate`

DONE.

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
