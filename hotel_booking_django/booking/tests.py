from django.test import TestCase
from accounts.models import user_account
from booking.models import booking_order
from booking import serializers as bookingSerializer

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

        self.TEST_USER1_LOGIN = {
            'email': 'test1@test.com',
            'password': 'qwe123qwe@!Q',
        }

        self.TEST_USER2_LOGIN = {
            'email': 'test2@test.com',
            'password': 'qwe123qwe@!Q',
        }

        self.user_1 = user_account.objects.create_user(**self.TEST_USER1)
        self.user_2 = user_account.objects.create_user(**self.TEST_USER2)

        # create 2 booking form data in dict format
        self.TEST_BOOKING_1 = {
            "user_account": str(self.user_1.uid),
            "hotel_id": "h_id_1",
            "room_type_id": "r_id_1",
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
            # "primary_guest_phone_country": "",
            "primary_guest_passport_number": "E28401J",
            # "primary_guest_passport_country": "",
            "cost_in_sgd": "99",
            "name_on_card": "Daniel",
            "card_number": "5105105105105100",
            "expiry_date": "2024-08-01",
            "security_code": "233",
            "billing_address_address": "59 Changi South Avenue 1",
            # "billing_address_country": "",
            "billing_address_city": "Singapore",
            "billing_address_post_code": "485999"
        }

        self.TEST_BOOKING_2 = {
            "user_account": str(self.user_2.uid),
            "hotel_id": "h_id_2",
            "room_type_id": "r_id_2",
            "booking_id": "b_id_2",
            "check_in_date": "2022-08-25",
            "check_out_date": "2022-08-03",
            "number_of_rooms": "1",
            "number_of_guests_per_rooms": "1",
            "special_request": "",
            "primary_guest_title": "MR",
            "primary_guest_first_name": "Johnny 2",
            "primary_guest_last_name": "Depp 2",
            "primary_guest_phone": "80000000",
            # "primary_guest_phone_country": "",
            "primary_guest_passport_number": "E28401G",
            # "primary_guest_passport_country": "",
            "cost_in_sgd": "199",
            "name_on_card": "Johnny",
            "card_number": "4111 1111 1111 1111",
            "expiry_date": "2024-08-01",
            "security_code": "244",
            "billing_address_address": "59 Changi South Avenue 2",
            # "billing_address_country": "",
            "billing_address_city": "Singapore 2",
            "billing_address_post_code": "485111"
        }
        

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
    def test_make_booking_without_login(self):
        booking_endpoint = '/booking/'

        response1 = self.client.post(booking_endpoint, self.TEST_BOOKING_1)
        status_code1 = response1.status_code
        # check that the booking fails since the user is not logged in
        # Django should return a 401 unauthorized response.
        self.assertEquals(status_code1, 401)

        # check if number of bookings in the system is 0
        booking_count = booking_order.objects.all().count()
        self.assertEquals(booking_count, 0)

    # check if user can create booking after logging in
    # expected result: yes
    def test_make_booking_with_login(self):
        # fixed endpoint from Djoser to login
        login_url = '/auth/jwt/create/' 
        booking_endpoint = '/booking/'

        # generate access token for user1
        response1 = self.client.post(login_url, self.TEST_USER1_LOGIN)
        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        response2 = self.client.post(booking_endpoint, content_type='application/json', data = self.TEST_BOOKING_1, **auth_header)
        status_code2 = response2.status_code
        self.assertEquals(status_code2, 201)




    



    # TODO: check if user can retrieve booking without logging in
    # expected result: no

    # TODO: check if user can retrieve  booking after logging in
    # expected result: yes

    # TODO: check if user can update booking without logging in
    # expected result: no

    # TODO: check if user can update booking after logging in
    # expected result: yes

    # TODO: check if normal user can retrieve all bookings without logging in
    # expected result: no

    # TODO: check if normal user can retrieve all bookings after logging in
    # expected result: no