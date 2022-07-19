from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import datetime
import time
import unittest
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager



class Login_Signup(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))
        # self.driver = webdriver.Firefox(executable_path="./geckodriver.exe")
    def test_login_signup(self):
        driver = self.driver
        driver.get("http://localhost:8080/")

        # Signup
        signup_button = driver.find_element(By.XPATH, r"/html/body/div/div/div/div[1]/div[1]/div/div/button[2]")
        signup_button.click()

        email = "johndoe6@gmail.com"
        first_name = "John"
        last_name = "Doe"
        password = "ASqw!@12"

        signup_email_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[1]/div/input")
        signup_email_field.send_keys(email)

        signup_first_name_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[2]/div[2]/div[1]/div/div/input")
        signup_first_name_field.send_keys(first_name)

        signup_last_name_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[2]/div[2]/div[2]/div/div/input")
        signup_last_name_field.send_keys(last_name)

        signup_password_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[3]/div/input")
        signup_password_field.send_keys(password)

        signup_re_password_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[4]/div/input")
        signup_re_password_field.send_keys(password)

        signup_page_button = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[5]/button")
        signup_page_button.click()

        # check if the application successfully gets rerouted to the login page after signup
        login_title = driver.find_element(By.ID, "login-title")
        expected_title = "LOGIN"
        self.assertEqual(login_title.text, expected_title)

        

    def tearDown(self):
        # TODO implement user account deletion
        self.driver.close()

unittest.main()