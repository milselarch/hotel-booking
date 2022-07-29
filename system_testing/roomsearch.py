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

        self.email = "bacon@gmail.com"
        self.password = "crispy123"

        self.firstname = "Smoke E."
        self.lastname = "Bacon"
        self.phonenum = "90325412"

        self.cardnum = "4111 1111 1112"
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
        driver.implicitly_wait(3)

        loginpop = driver.find_element(By.ID, "login")
        loginpop.click()
        time.sleep(1)
        driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[1]/div/input").send_keys(self.email)
        time.sleep(1)
        driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[2]/div/input").send_keys(self.password)
        time.sleep(1)
        driver.find_element(By.XPATH, "/html/body/div[1]/div[1]/div[2]/div[1]/div/section/div[3]/button").click()

        time.sleep(2)

        destField = driver.find_element(By.ID, "dest_search_field")
        searchButton = driver.find_element(By.ID, "search_button")
        destField.send_keys(self.searchString)
        time.sleep(1)
        destField.send_keys(Keys.ARROW_DOWN)
        time.sleep(1)
        destField.send_keys(Keys.RETURN)

        driver.execute_script("arguments[0].style.border='3px solid red'", searchButton)
        time.sleep(0.7)
        driver.execute_script("arguments[0].style.border='none'", searchButton)
        searchButton.click()

        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "card")))

        for i in range(3):
            time.sleep(1.2)
            driver.execute_script("window.scrollBy({top: 800, behavior: 'smooth'})")

        time.sleep(2)
        driver.execute_script("window.scrollTo({ top: 700, behavior: 'smooth'})")
        time.sleep(1)

        hotelCards = driver.find_elements(By.CLASS_NAME, "card")
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
        if roomCards[1].is_displayed():
            roomCards[1].click()

        time.sleep(1)

        title = driver.find_element(By.XPATH, "//form[@id='bookingForm']/div[1]/div[2]/div/div/div")
        title.click()
        time.sleep(0.4)
        driver.find_element(By.XPATH, "//form[@id='bookingForm']/div[1]/div[2]/div/div/div/span/select/option[3]").click()
        # title.send_keys([Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys. RETURN])
        driver.find_element(By.ID, "first_name_field").send_keys(self.firstname)
        driver.find_element(By.ID, "last_name_field").send_keys(self.lastname)
        driver.find_element(By.ID, "phone_num_field").send_keys(self.phonenum)
        driver.find_element(By.ID, "email_field").send_keys(self.email)

        time.sleep(2)
        driver.find_element(By.ID, "cc_num_field").send_keys(self.cardnum)
        driver.find_element(By.ID, "cc_name_field").send_keys(self.cardname)
        driver.find_element(By.ID, "cc_expiry_date").send_keys(self.expmonth)
        driver.find_element(By.ID, "cc_expiry_date").send_keys(self.expyear)
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

        time.sleep(3)

    
    def end(self):
        driver = self.driver
        driver.close()

unittest.main()




