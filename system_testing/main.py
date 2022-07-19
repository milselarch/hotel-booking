from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time

def Test_Login():
    PATH = "./geckodriver.exe"
    driver = webdriver.Firefox(PATH)
    #select browser
    driver.get("http://localhost:8080/")

    #login
    login_button = driver.find_element(By.XPATH, )
    username = driver.find_element_by_id("pgContent1_uiLoginid")
    username.send_keys(open(r"username.txt").read())
    pw = driver.find_element(By.XPATH,)
    # TODO 
    pw.send_keys()
    pw.send_keys(Keys.RETURN)