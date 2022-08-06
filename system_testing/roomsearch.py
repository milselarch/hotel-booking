from faulthandler import is_enabled
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time

class HotelSearch(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.get("http://localhost:8080/")
        self.driver.maximize_window()

        self.searchString = "singapore"

        self.email = "sieun@gmail.com"
        self.password = "rlatldms"

        self.firstname = "Smoke E."
        self.lastname = "Bacon"
        self.phonenum = "90325412"

        self.cardnum1 = "4111"
        self.cardnum2 = "1111"
        self.cardnum3 = "1111"
        self.cardnum4 = "1111"
        self.cardname = "Chris P. Bacon"
        self.expmonth = "5"
        self.expyear = "2030"
        self.cvc = "378"

        self.address = "8 Somapah Road"
        self.postal = "487372"

    def testSearch(self):
        driver = self.driver
        # driver.get("http://localhost:8080/")
        # driver.maximize_window()
        driver.implicitly_wait(5)

        loginpop = driver.find_element(By.ID, "login")
        loginpop.click()
        time.sleep(0.5)
        driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[1]/div/input").send_keys(self.email)
        time.sleep(0.5)
        driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[2]/div/input").send_keys(self.password)
        time.sleep(0.5)
        driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[3]/button").click()

        time.sleep(1)

        destField = driver.find_element(By.ID, "dest_search_field")
        searchButton = driver.find_element(By.ID, "search_button")
        destField.send_keys(self.searchString)
        time.sleep(0.5)
        destField.send_keys(Keys.ARROW_DOWN)
        time.sleep(0.5)
        destField.send_keys(Keys.RETURN)

        driver.execute_script("arguments[0].style.border='3px solid red'", searchButton)
        time.sleep(0.7)
        driver.execute_script("arguments[0].style.border='none'", searchButton)
        while searchButton.is_enabled():
            searchButton.click()

        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "card")))

        for i in range(3):
            time.sleep(1.2)
            driver.execute_script("window.scrollBy({top: 800, behavior: 'smooth'})")

        time.sleep(2)
        driver.execute_script("window.scrollTo({ top: 700, behavior: 'smooth'})")
        time.sleep(1)

        hotelCards = driver.find_elements(By.CLASS_NAME, "card")
        WebDriverWait(driver, 8).until(EC.presence_of_element_located((By.ID, "price")))
        time.sleep(1.5)
        for i in range(len(hotelCards)):
            valid = hotelCards[i].find_element(By.ID, "price")
            if valid.is_displayed():
                hotelCards[i].click()
                break

        for i in range(3):
            time.sleep(1.2)
            driver.execute_script("window.scrollBy({top: 500, behavior: 'smooth'})")

        time.sleep(1.5)

        roomCards = driver.find_elements(By.CLASS_NAME, "card")
        if roomCards[0].is_displayed():
            roomCards[0].click()

        time.sleep(1)

        title = driver.find_element(By.XPATH, "//form[@id='bookingForm']/div[1]/div[2]/div/div/div")
        title.click()
        time.sleep(0.4)
        driver.find_element(By.XPATH, "//form[@id='bookingForm']/div[1]/div[2]/div/div/div/span/select/option[3]").click()
        driver.find_element(By.ID, "first_name_field").send_keys(self.firstname)
        driver.find_element(By.ID, "last_name_field").send_keys(self.lastname)
        driver.find_element(By.ID, "phone_num_field").send_keys(self.phonenum)
        driver.find_element(By.ID, "email_field").send_keys(self.email)

        time.sleep(2)
        driver.find_element(By.ID, "cc_num_field").send_keys(self.cardnum1)
        driver.find_element(By.ID, "cc_num_field").send_keys(self.cardnum2)
        driver.find_element(By.ID, "cc_num_field").send_keys(self.cardnum3)
        driver.find_element(By.ID, "cc_num_field").send_keys(self.cardnum4)
        driver.find_element(By.ID, "cc_name_field").send_keys(self.cardname)
        driver.find_element(By.ID, "cc_expiry_date_field").send_keys(self.expmonth)
        driver.find_element(By.ID, "cc_expiry_date_field").send_keys(self.expyear)
        driver.find_element(By.ID, "cvc_field").send_keys(self.cvc)

        time.sleep(2)
        driver.find_element(By.ID, "city_field").send_keys(self.searchString)
        driver.find_element(By.ID, "address_field").send_keys(self.address)
        driver.find_element(By.ID, "postal_field").send_keys(self.postal)

        time.sleep(2)
        driver.find_element(By.XPATH, "html/body/div/div/div/div/div/form/div[4]/div/label").click()
        time.sleep(0.5)
        driver.find_element(By.ID, "booking_button").click()

        driver.execute_script("window.scrollTo({top: 800, behavior: 'smooth'})")

        time.sleep(4)

    
    def end(self):
        driver = self.driver
        driver.close()

# class Login_Signup(unittest.TestCase):

#     def setUp(self):
#         self.driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))
#         self.email = "johndoe15@gmail.com"
#         self.first_name = "John"
#         self.last_name = "Doe"
#         self.password = "ASqw!@12"
        
#     def test_login_signup(self):
#         driver = self.driver
#         driver.get("http://localhost:8080/")

#         # Signup
#         signup_button = driver.find_element(By.XPATH, r"/html/body/div/div/div/div[1]/div[1]/div/div/button[2]")
#         signup_button.click()

        

#         signup_email_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[1]/div/input")
#         signup_email_field.send_keys(self.email)

#         signup_first_name_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[2]/div[2]/div[1]/div/div/input")
#         signup_first_name_field.send_keys(self.first_name)

#         signup_last_name_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[2]/div[2]/div[2]/div/div/input")
#         signup_last_name_field.send_keys(self.last_name)

#         signup_password_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[3]/div/input")
#         signup_password_field.send_keys(self.password)

#         signup_re_password_field = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[4]/div/input")
#         signup_re_password_field.send_keys(self.password)

#         signup_page_button = driver.find_element(By.XPATH, r"/html/body/div/div[1]/div[2]/div[2]/div/section/div[5]/button")
#         signup_page_button.click()

#         # check if the application successfully gets rerouted to the login page after signup
#         login_title = WebDriverWait(driver, 5).until(
#             EC.presence_of_element_located((By.ID, "login-title")))
#         expected_title = "LOGIN"
#         self.assertEqual(login_title.text, expected_title)

#         # login to account
#         login_password_field = driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[2]/div/input")
#         login_password_field.send_keys(self.password)
#         login_button = driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[3]/button")
#         login_button.click()

#         time.sleep(3)

        

#     def tearDown(self):
#         # user account deletion after testing
#         driver = self.driver
#         account_icon = driver.find_element(By.XPATH, "/html/body/div/nav/div[2]/div[2]/div/div/section/div/div[1]/button")
#         account_icon.click()
#         profile_link = driver.find_element(By.XPATH, "/html/body/div/nav/div[2]/div[2]/div/div/section/div/div[3]/div/a[3]")
#         profile_link.click()

#         delete_account_button = WebDriverWait(driver, 5).until(
#             EC.presence_of_element_located((By.ID, "delete_account_button")))
#         delete_account_button.click()

#         confirm_delete_password_input = driver.find_element(By.ID, "delete_account_password_field")
#         confirm_delete_password_input.send_keys(self.password)
#         confirm_delete_account_button = driver.find_element(By.ID, "confirm_delete_account_button")
#         confirm_delete_account_button.click()

#         self.driver.close()

unittest.main()




