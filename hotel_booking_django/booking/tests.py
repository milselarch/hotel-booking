from unittest import mock
from unittest.mock import Mock
from django.test import TestCase
from accounts.models import user_account
from booking.models import booking_order
from booking import serializers as bookingSerializer
from booking.views import valid_credit_card
import copy
from faker import Faker
from datetime import datetime as dt, timedelta
from random import randint, choice
import string

class TestBooking(TestCase):

    # create 2 users on the backend 
    def setUp(self):
        self.TEST_USER1 = {
            'email': 'test1@test.com',
            'first_name': "Johnny",
            'last_name': "Depp",
            'password': 'qwe123qwe@!Q',
        }

        self.TEST_USER2 = {
            'email': 'test2@test.com',
            'first_name': "Johnny",
            'last_name': "Depp 2",
            'password': 'qwe123qwe@!Q',
        }

        self.TEST_ADMIN = {
            'email': 'test3@test.com',
            'first_name': "Johnny",
            'last_name': "Depp 3",
            'password': 'qwe123qwe@!Q',
        }

        self.TEST_USER1_SIGNUP = {
            'email': 'test1@test.com',
            'first_name': "Johnny",
            'last_name': "Depp",
            'password': 'qwe123qwe@!Q',
            're_password': 'qwe123qwe@!Q',
        }

        self.TEST_USER2_SIGNUP = {
            'email': 'test2@test.com',
            'first_name': "Johnny",
            "last_name": "Depp 2",
            'password': 'qwe123qwe@!Q',
            're_password': 'qwe123qwe@!Q',
        }

        self.TEST_ADMIN_SIGNUP = {
            'email': 'test3@test.com',
            'first_name': "Johnny",
            'last_name': "Depp 3",
            'password': 'qwe123qwe@!Q',
            're_password': 'qwe123qwe@!Q',
        }

        self.TEST_USER1_LOGIN = {
            'email': 'test1@test.com',
            'password': 'qwe123qwe@!Q',
        }

        self.TEST_USER2_LOGIN = {
            'email': 'test2@test.com',
            'password': 'qwe123qwe@!Q',
        }

        self.TEST_ADMIN_LOGIN = {
            'email': 'test3@test.com',
            'password': 'qwe123qwe@!Q',
        }

        self.user_1 = user_account.objects.create_user(**self.TEST_USER1)
        self.user_2 = user_account.objects.create_user(**self.TEST_USER2)
        self.adminUser = user_account.objects.create_admin(**self.TEST_ADMIN)

        # create 2 booking form data in dict format
        self.TEST_BOOKING_1 = {
            "user_account": str(self.user_1.uid),
            "hotel_id": "h_id_1",
            "room_type_id": "r_id_1",
            "room_breakfast_info": "r_breakfast_1",
            "booking_id": "b_id_1",
            "check_in_date": "2022-08-24",
            "check_out_date": "2022-08-30",
            "number_of_rooms": "2",
            "number_of_guests_per_rooms": "2",
            "special_request": "",
            "primary_guest_title": "MR",
            "primary_guest_first_name": "Johnny",
            "primary_guest_last_name": "Depp",
            "primary_guest_phone": "95068345",
            "primary_guest_phone_country": "Singapore +65",
            "cost_in_sgd": "99",
            "name_on_card": "Daniel",
            "card_number": "5105105105105100",
            "expiry_date": "2028-08-01",
            "security_code": "233",
            "billing_address_address": "59 Changi South Avenue 1",
            "billing_address_country": "Singapore",
            "billing_address_city": "Singapore",
            "billing_address_post_code": "485999",
            
            "destination_id": "RsBU",
            "did_primary_guest_accept_tnc": "true",
            "primary_guest_email": "joebaarath@hotmail.com",
            
            "hotel_name": "Shangri-La Hotel Singapore",
            "room_type": "Tower Wing, Deluxe Room, 1 King Bed",
            "destination_region": "Merlion, Singapore"
        }

        self.TEST_BOOKING_2 = {
            "user_account": str(self.user_2.uid),
            "hotel_id": "h_id_2",
            "room_type_id": "r_id_2",
            "room_breakfast_info": "r_breakfast_2",
            "booking_id": "b_id_2",
            "check_in_date": "2022-08-25",
            "check_out_date": "2022-08-28",
            "number_of_rooms": "1",
            "number_of_guests_per_rooms": "1",
            "special_request": "",
            "primary_guest_title": "MR",
            "primary_guest_first_name": "Johnny 2",
            "primary_guest_last_name": "Depp 2",
            "primary_guest_phone": "80000000",
            "primary_guest_phone_country": "Singapore +65",
            "cost_in_sgd": "199",
            "name_on_card": "Johnny",
            "card_number": "4111 1111 1111 1111",
            "expiry_date": "2028-08-01",
            "security_code": "244",
            "billing_address_address": "59 Changi South Avenue 2",
            "billing_address_country": "Singapore",
            "billing_address_city": "Singapore 2",
            "billing_address_post_code": "485111",
            
            "destination_id": "RsBU",
            "did_primary_guest_accept_tnc": "true",
            "primary_guest_email": "joebaarath@hotmail.com",
            
            "hotel_name": "Shangri-La Hotel Singapore",
            "room_type": "Tower Wing, Deluxe Room, 1 King Bed",
            "destination_region": "Merlion, Singapore"
            
        }
    
    # fuzzing to check the robustness of our credit card checker
    # ensuring no false negative
    def test_credit_card_checker(self):
        faker = Faker()
        for x in range(10000):
            card_number = faker.credit_card_number()
            # print(f"count:{x}")
            # print(card_number)
            self.assertTrue(valid_credit_card(card_number))

    # check if the booking can be created internally
    # expected result: yes
    def test_create_booking(self):

        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            serializer1.save()

        serializer2 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_2)
        if serializer2.is_valid():
            serializer2.save()

        # check if there are 2 booking objects in the database
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 2)
    
    # check if user can create booking without logging in
    # expected result: no
    @mock.patch('booking.views.user_booking_data.room_details_get_request', return_value = None)
    @mock.patch('booking.views.user_booking_data.verify_hotel_price_from_ascenda_api_matches_with_request_from_client', return_value = None)
    def test_make_booking_without_login(self, mock_output_room_details_get_request, mock_output_verify_hotel_price):
        booking_endpoint = '/booking/'

        response1 = self.client.post(
            booking_endpoint, 
            content_type='application/json', 
            data = self.TEST_BOOKING_1)

        status_code1 = response1.status_code

        # check that the booking fails since the user is not logged in
        # Django should return a 401 unauthorized response.
        self.assertEquals(status_code1, 401)

        # check if number of bookings in the system is 0
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

    # check if user can create bookings after logging in
    # expected result: yes
    @mock.patch('booking.views.user_booking_data.room_details_get_request', return_value = None)
    @mock.patch('booking.views.user_booking_data.verify_hotel_price_from_ascenda_api_matches_with_request_from_client', return_value = None)
    def test_make_booking_with_login(self, mock_output_room_details_get_request, mock_output_verify_hotel_price ):
        # fixed endpoint from Djoser to login
        login_url = '/auth/jwt/create/' 
        booking_endpoint = '/booking/'

        # generate access token for user1
        response1 = self.client.post(
            login_url, 
            content_type='application/json', 
            data = self.TEST_USER1_LOGIN)

        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        response2 = self.client.post(
            booking_endpoint, 
            content_type='application/json', 
            data = self.TEST_BOOKING_1, 
            **auth_header)

        status_code2 = response2.status_code
        self.assertEquals(status_code2, 201)

        response3 = self.client.post(
            booking_endpoint, 
            content_type='application/json', 
            data = self.TEST_BOOKING_2, 
            **auth_header)

        status_code3 = response3.status_code
        self.assertEquals(status_code3, 201)

        # check if there are 2 bookings in the database
        # expected number of bookings = 2
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 2)

        # test if the credit card validator works
        # 5999 9999 9999 9108 is a card number that fails the luhn's test
        test_booking_3 = copy.deepcopy(self.TEST_BOOKING_2)
        test_booking_3["card_number"] = "5999 9999 9999 9108"

        response4 = self.client.post(
            booking_endpoint, 
            content_type='application/json', 
            data = test_booking_3, 
            **auth_header)

        status_code4 = response4.status_code
        self.assertEquals(status_code4, 400)
        self.assertEquals(response4.data, {"card_number": "Invalid Credit Card Number"})

        # check if the number of bookings in the database is still 2
        self.assertEquals(booking_count, 2)

        # check if the post method catches an missing credit card field in the request
        test_booking_4 = copy.deepcopy(self.TEST_BOOKING_2)
        test_booking_4.pop("card_number")
        
        response5 = self.client.post(
            booking_endpoint, 
            content_type='application/json', 
            data = test_booking_4, 
            **auth_header)

        status_code5 = response5.status_code
        self.assertEquals(status_code5, 400)
        self.assertEquals(response5.data, {"card_number": "Request requires a card number field"})

        # check if the number of bookings in the database is still 2
        self.assertEquals(booking_count, 2)

        # check if the post method catches an empty credit card field in the request
        test_booking_5 = copy.deepcopy(self.TEST_BOOKING_2)
        test_booking_5["card_number"] = ""
        
        response6 = self.client.post(
            booking_endpoint, 
            content_type='application/json', 
            data = test_booking_5, 
            **auth_header)

        status_code6 = response5.status_code
        self.assertEquals(status_code6, 400)
        self.assertEquals(response6.data, {"card_number": "Missing Credit Card Number"})

        # check if the number of bookings in the database is still 2
        self.assertEquals(booking_count, 2)

    # check if user can create bookings after logging in
    # expected result: yes
    @mock.patch('booking.views.user_booking_data.room_details_get_request', return_value = None)
    @mock.patch('booking.views.user_booking_data.verify_hotel_price_from_ascenda_api_matches_with_request_from_client', return_value = None)
    def test_make_booking_with_login_with_faker(self, mock_output_room_details_get_request, mock_output_verify_hotel_price ):
        # fixed endpoint from Djoser to login
        login_url = '/auth/jwt/create/' 
        booking_endpoint = '/booking/'

        # generate access token for user1
        response1 = self.client.post(
            login_url, 
            content_type='application/json', 
            data = self.TEST_USER1_LOGIN)

        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        number_of_booking = 1000
        faker = Faker()
        for x in range(number_of_booking):
            test_start_date = faker.date_between(start_date='today',end_date='+7d')
            test_end_date = faker.date_between(start_date='+8d',end_date='+15d')

            #Create TEST_BOOKING DATA using faker
            TEST_BOOKING_FUZZ_JSON = {
            "user_account": str(self.user_2.uid),
            "hotel_id": faker.lexify(text='??????????'),
            "room_type_id": faker.lexify(text='??????????'),
            "room_breakfast_info": faker.lexify(text='??????????'),
            "booking_id": faker.lexify(text='??????????'),
            "check_in_date":str(test_start_date),
            "check_out_date": str(test_end_date),
            "number_of_rooms": str(faker.random_digit_not_null()),
            "number_of_guests_per_rooms": str(faker.random_digit_not_null()),
            "special_request": faker.paragraph(nb_sentences=5),
            "primary_guest_title": str(faker.random_choices(elements=('MR', 'MS', 'MRS'), length=1)[0]),
            "primary_guest_first_name": faker.first_name(),
            "primary_guest_last_name": faker.last_name(),
            "primary_guest_phone": str(faker.random_int(min=10000000, max=99999999)),
            "primary_guest_phone_country": str(faker.country()) + " " + str(faker.country_calling_code()),
            "cost_in_sgd": str(faker.random_int(min=1, max=100000)),
            "name_on_card": faker.name(),
            "card_number": str(faker.credit_card_number()),
            "expiry_date": str(faker.date_between(start_date='today',end_date='+5y')),
            "security_code": str(faker.random_number(digits=3,fix_len=True)),
            "billing_address_address": faker.street_address(),
            "billing_address_country": faker.country(),
            "billing_address_city": faker.city(),
            "billing_address_post_code": faker.postcode(),
            
            "destination_id": faker.lexify(text='??????????'),
            "did_primary_guest_accept_tnc": "true",
            "primary_guest_email": faker.email(),

            "hotel_name": "Hotel:"+faker.paragraph(nb_sentences=1),
            "room_type": "Room:"+faker.paragraph(nb_sentences=1),
            "destination_region": faker.city() + ", " + faker.country(),

            }
            # print("Count:"+str(x+1))
            # print(TEST_BOOKING_FUZZ_JSON)

            response2 = self.client.post(
                booking_endpoint, 
                content_type='application/json', 
                data = TEST_BOOKING_FUZZ_JSON, 
                **auth_header)

            status_code2 = response2.status_code
            self.assertEquals(status_code2, 201)

        # check if there are x number_of_booking bookings in the database
        # expected number of bookings = number_of_booking
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, number_of_booking)

    @mock.patch('booking.views.user_booking_data.room_details_get_request', return_value = None)
    @mock.patch('booking.views.user_booking_data.verify_hotel_price_from_ascenda_api_matches_with_request_from_client', return_value = None)
    def test_make_booking_with_login_with_faker_random_fuzz_fail_json(self, mock_output_room_details_get_request, mock_output_verify_hotel_price ):
        # fixed endpoint from Djoser to login
        login_url = '/auth/jwt/create/' 
        booking_endpoint = '/booking/'

        # generate access token for user1
        response1 = self.client.post(
            login_url, 
            content_type='application/json', 
            data = self.TEST_USER1_LOGIN)

        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        number_of_booking = 1000
        faker = Faker()
        for x in range(number_of_booking):

            #Create TEST_BOOKING DATA using faker
            TEST_BOOKING_FUZZ_JSON = faker.json()
            # print("Count:"+str(x+1))
            # print(TEST_BOOKING_FUZZ_JSON)

            response2 = self.client.post(
                booking_endpoint, 
                content_type='application/json', 
                data = TEST_BOOKING_FUZZ_JSON, 
                **auth_header)

            status_code2 = response2.status_code
            self.assertEquals(status_code2, 400)

        # check if there are x number_of_booking bookings in the database
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

    @mock.patch('booking.views.user_booking_data.room_details_get_request', return_value = None)
    @mock.patch('booking.views.user_booking_data.verify_hotel_price_from_ascenda_api_matches_with_request_from_client', return_value = None)
    def test_make_booking_with_login_with_faker_fuzz_fail_json(self, mock_output_room_details_get_request, mock_output_verify_hotel_price ):
        # fixed endpoint from Djoser to login
        login_url = '/auth/jwt/create/' 
        booking_endpoint = '/booking/'

        # generate access token for user1
        response1 = self.client.post(
            login_url, 
            content_type='application/json', 
            data = self.TEST_USER1_LOGIN)

        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }
        
        number_of_booking = 10
        for x in range(number_of_booking):
            for i in range(1,len(self.TEST_BOOKING_2)):
                TEST_BOOKING = copy.deepcopy(self.TEST_BOOKING_2)
                # print("count_x:"+str(x))
                # print("count_i:"+str(i))
                random_int=randint(1001,20000)
                # print(random_int)
                # source = string.ascii_letters + string.punctuation + string.digits + string.whitespace
                source = string.printable
                random_val=''.join(choice(source) for x in range(random_int))
                # print(random_val)
                TEST_BOOKING[list(self.TEST_BOOKING_2)[i]]=random_val

                # print(TEST_BOOKING)

                response2 = self.client.post(
                    booking_endpoint, 
                    content_type='application/json', 
                    data = TEST_BOOKING, 
                    **auth_header)

                status_code2 = response2.status_code
                self.assertEquals(status_code2, 400)

        # check if there are x number_of_booking bookings in the database
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

    # check if admin can retrieve booking without logging in
    # expected result: no
    def test_admin_get_booking_without_login(self):
        booking_endpoint = '/admin_booking/'
        get_request = booking_endpoint + str(self.user_1.uid) + '/'

        response1 = self.client.get(
            get_request, 
            content_type='application/json')
        
        status_code1 = response1.status_code

        # check that retrieving the booking fails since the user is 
        # not logged in Django should return a 401 unauthorized response.
        self.assertEquals(status_code1, 401)

        # check if number of bookings in the system is 0
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

        # create a booking in the DB to check if the user can get the booking
        # data if there was a booking in the DB 
        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            serializer1.save()

        # check if number of bookings in the system is 1
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 1)

        # check that the endpoint still returns http 401
        response2 = self.client.get(
            get_request, 
            content_type='application/json')
        
        status_code2 = response2.status_code

        self.assertEquals(status_code2, 401)

    # check if admin can retrieve booking after logging in
    # expected result: yes
    def test_admin_get_booking_with_login(self):
        booking_endpoint = '/admin_booking/'
        get_request = booking_endpoint + str(self.user_1.uid) + '/'

        login_url = '/auth/jwt/create/'

        # generate access token for admin user
        response1 = self.client.post(
            login_url, 
            content_type='application/json',
            data = self.TEST_ADMIN_LOGIN)

        ADMIN_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + ADMIN_ACCESS_TOKEN,
        }

        response1 = self.client.get(
            get_request,
            content_type='application/json', 
            **auth_header)
        
        status_code1 = response1.status_code

        # check that the booking succeeds since the user is logged in
        # Django should return a HTTP 200 response.
        self.assertEquals(status_code1, 200)

        # check if number of bookings in the system is 0
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

        # the data field in the response should be an empty list
        # since there should be no bookings in the database
        self.assertEquals(response1.data, [])

        # create a booking in the DB to check if the user can get the booking
        # data if there was a booking in the DB
        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            serializer1.save()

        # check if number of bookings in the system is 1
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 1)

        # check that the endpoint returns http 200
        response2 = self.client.get(
            get_request,
            content_type='application/json', 
            **auth_header)
        
        status_code2 = response2.status_code

        self.assertEquals(status_code2, 200)

        # create another booking under user 2
        serializer2 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_2)
        if serializer2.is_valid():
            serializer2.save()
        
        # check if number of bookings in the system is 2
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 2)

        # try retrieving the booking info under user 2
        get_request2 = booking_endpoint+ str(self.user_2.uid) + "/"

        response3 = self.client.get(
            get_request2, 
            content_type='application/json',
            **auth_header)

        # check that the endpoint returns http 200
        status_code3 = response3.status_code
        self.assertEquals(status_code3, 200)

        # add another booking under user 1
        serializer3 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer3.is_valid():
            serializer3.save()

        # check if number of bookings in the system is 3
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 3)

        response4 = self.client.get(
            get_request, 
            content_type='application/json', 
            **auth_header)
        # check if the get request is a success
        status_code4 = response4.status_code
        self.assertEquals(status_code4, 200)
        
        # check if 2 bookings are returned under user 1
        self.assertEquals(len(response4.data), 2)

    # check if user can retrieve booking without logging in
    # expected result: no
    def test_get_booking_without_login(self):
        booking_endpoint = '/booking/'

        response1 = self.client.get(
            booking_endpoint, 
            content_type='application/json')
        
        status_code1 = response1.status_code

        # check that retrieving the booking fails since the user is 
        # not logged in Django should return a 401 unauthorized response.
        self.assertEquals(status_code1, 401)

        # check if number of bookings in the system is 0
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

        # create a booking in the DB to check if the user can get the booking
        # data if there was a booking in the DB 
        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            serializer1.save()

        # check if number of bookings in the system is 1
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 1)

        # check that the endpoint still returns http 401
        response2 = self.client.get(
            booking_endpoint, 
            content_type='application/json')
        
        status_code2 = response2.status_code

        self.assertEquals(status_code2, 401)

    # check if user can retrieve booking after logging in
    # expected result: yes
    def test_get_booking_with_login(self):
        booking_endpoint = '/booking/'

        login_url = '/auth/jwt/create/'

        # generate access token for normal user
        response1 = self.client.post(
            login_url,
            content_type='application/json', 
            data = self.TEST_USER1)

        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        response1 = self.client.get(
            booking_endpoint, 
            content_type='application/json', 
            **auth_header)
        
        status_code1 = response1.status_code

        # check that the booking succeeds since the user is logged in
        # Django should return a HTTP 200 response.
        self.assertEquals(status_code1, 200)

        # check if number of bookings in the system is 0
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

        # the data field in the response should be an empty list
        # since there should be no bookings in the database
        self.assertEquals(response1.data, [])

        # create a booking in the DB to check if the user can get the booking
        # data if there was a booking in the DB
        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            serializer1.save()

        # check if number of bookings in the system is 1
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 1)

        
        response2 = self.client.get(
            booking_endpoint, 
            content_type='application/json',
            **auth_header)
        status_code2 = response2.status_code

        # check that the endpoint returns http 200
        self.assertEquals(status_code2, 200)

        # create another booking under user 2
        serializer2 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_2)
        if serializer2.is_valid():
            serializer2.save()
        
        # check if number of bookings in the system is 2
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 2)

        response3 = self.client.get(
            booking_endpoint, 
            content_type='application/json', 
            **auth_header)

        # check that the endpoint returns http 200
        status_code3 = response3.status_code
        self.assertEquals(status_code3, 200)

        # add another booking under user 1
        serializer3 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer3.is_valid():
            serializer3.save()

        # check if number of bookings in the system is 3
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 3)

        response4 = self.client.get(
            booking_endpoint, 
            content_type='application/json',
            **auth_header)

        # check if the get request is a success
        status_code4 = response4.status_code
        self.assertEquals(status_code4, 200)
        
        # check if 2 bookings are returned under user 1
        self.assertEquals(len(response4.data), 2)


    # check if user can update booking without logging in
    # expected result: no
    def test_put_booking_without_login(self):
        booking_endpoint = '/booking/'

        # create a booking in the system first, 
        # for the user to update
        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            booking = serializer1.save()

        # check if number of bookings in the system is 1
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 1)

        # create a set of updated data
        updated_data = copy.deepcopy(self.TEST_BOOKING_1)
        updated_data["hotel_id"] = "This id is updated"

        # create the put request
        put_request = booking_endpoint + str(booking.uid) + "/"

        response1 = self.client.put(
            put_request, 
            content_type='application/json',
            data = updated_data)
        
        status_code1 = response1.status_code

        # check that updating the booking fails since the user is 
        # not logged in Django should return a 401 unauthorized response.
        self.assertEquals(status_code1, 401)

    # check if user can update booking after logging in
    # expected result: yes
    def test_put_booking_with_login(self):
        booking_endpoint = '/booking/'

        login_url = '/auth/jwt/create/'

        # generate access token for normal user
        response1 = self.client.post(
            login_url,
            content_type='application/json',
            data = self.TEST_USER1)

        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        # create a booking in the system first, 
        # for the user to update
        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            booking = serializer1.save()

        # check if number of bookings in the system is 1
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 1)

        # create a set of updated data
        updated_data = copy.deepcopy(self.TEST_BOOKING_1)
        updated_data["hotel_id"] = "This id is updated"

        # create the put request
        put_request = booking_endpoint + str(booking.uid) + "/"

        response1 = self.client.put(
            put_request, 
            data = updated_data, 
            content_type='application/json',
            **auth_header)
        
        status_code1 = response1.status_code

        # check that updating the booking fails since the user is 
        # not logged in Django should return a 202 accepted response.
        self.assertEquals(status_code1, 202)

        # check that the booking data is updated
        updated_booking = booking_order.objects.get(pk = str(booking.uid))
        self.assertEquals(updated_booking.hotel_id, 'This id is updated')

        # create another booking under user 2
        serializer2 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_2)
        if serializer2.is_valid():
            user2_booking = serializer2.save()
        
        # check if number of bookings in the system is 2
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 2)

        # create another set of updated data
        updated_data2 = copy.deepcopy(self.TEST_BOOKING_2)
        updated_data2["hotel_id"] = "This id is updated 2"

        put_request2 = booking_endpoint + str(user2_booking.uid) + "/"

        # check if a user can update another user's booking
        response2 = self.client.put(
            put_request2, 
            data = updated_data2, 
            content_type='application/json',
            **auth_header)
        
        status_code2 = response2.status_code

        # check that updating the booking fails since the user is 
        # updating his own booking. Django should return HTTP 403
        self.assertEquals(status_code2, 403)

    # check if normal user can retrieve all bookings without logging in
    # expected result: no
    def test_get_all_bookings_with_login(self):
        booking_endpoint = '/admin_booking/'

        login_url = '/auth/jwt/create/'

        # generate access token for normal user
        response1 = self.client.post(
            login_url,
            content_type='application/json',
            data = self.TEST_USER1)

        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        response1 = self.client.get(
            booking_endpoint,
            content_type='application/json', 
            **auth_header)
        
        status_code1 = response1.status_code

        # check that the booking fails since the user that logged in
        # is not an admin, Django should return a HTTP 403 response due
        # to the lack of privilege
        self.assertEquals(status_code1, 403)

        # check if number of bookings in the system is 0
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

        # create a booking in the DB to check if the user can get the booking
        # data if there was a booking in the DB
        serializer1 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer1.is_valid():
            serializer1.save()

        # check if number of bookings in the system is 1
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 1)

        # check that the endpoint still returns http 401
        response2 = self.client.get(
            booking_endpoint,
            content_type='application/json', 
            **auth_header)
        
        status_code2 = response2.status_code

        self.assertEquals(status_code2, 403)

        # add another booking under user 1
        serializer2 = bookingSerializer.booking_serializer(data = self.TEST_BOOKING_1)
        if serializer2.is_valid():
            serializer2.save()

        # check if number of bookings in the system is 3
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 2)

        response3 = self.client.get(
            booking_endpoint, 
            content_type='application/json', 
            **auth_header)

        # check if the get request is still unauthorized
        status_code3 = response3.status_code
        self.assertEquals(status_code3, 403)