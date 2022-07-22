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
        self.email = "johndoe15@gmail.com"
        self.first_name = "John"
        self.last_name = "Doe"
        self.password = "ASqw!@12"
        
    def test_login_signup(self):
        driver = self.driver
        driver.get("http://localhost:8080/")

        # Signup
        signup_button = driver.find_element(By.XPATH, r"/html/body/div/div/div/div[1]/div[1]/div/div/button[2]")
        signup_button.click()

        

        signup_email_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[1]/div/input")
        signup_email_field.send_keys(self.email)

        signup_first_name_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[2]/div[2]/div[1]/div/div/input")
        signup_first_name_field.send_keys(self.first_name)

        signup_last_name_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[2]/div[2]/div[2]/div/div/input")
        signup_last_name_field.send_keys(self.last_name)

        signup_password_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[3]/div/input")
        signup_password_field.send_keys(self.password)

        signup_re_password_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[4]/div/input")
        signup_re_password_field.send_keys(self.password)

        signup_page_button = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[5]/button")
        signup_page_button.click()

        # check if the application successfully gets rerouted to the login page after signup
        login_title = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "login-title")))
        expected_title = "LOGIN"
        self.assertEqual(login_title.text, expected_title)

        # login to account
        login_password_field = driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[2]/div/input")
        login_password_field.send_keys(self.password)
        login_button = driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[3]/button")
        login_button.click()

        time.sleep(3)

        

    def tearDown(self):
        # user account deletion after testing
        driver = self.driver
        account_icon = driver.find_element(By.XPATH, "/html/body/div/nav/div[2]/div[2]/div/div/section/div/div[1]/button")
        account_icon.click()
        profile_link = driver.find_element(By.XPATH, "/html/body/div/nav/div[2]/div[2]/div/div/section/div/div[3]/div/a[3]")
        profile_link.click()

        delete_account_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "delete_account_button")))
        delete_account_button.click()

        confirm_delete_password_input = driver.find_element(By.ID, "delete_account_password_field")
        confirm_delete_password_input.send_keys(self.password)
        confirm_delete_account_button = driver.find_element(By.ID, "confirm_delete_account_button")
        confirm_delete_account_button.click()

        self.driver.close()

unittest.main()