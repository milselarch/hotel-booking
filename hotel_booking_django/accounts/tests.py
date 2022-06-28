from django.test import TestCase
from accounts.models import user_account

class TestAuthentication(TestCase):

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
            'name': "Johnny Depp 2",
            'password': 'qwe123qwe@!Q',
            're_password': 'qwe123qwe@!Q',
        }

        self.TEST_USER3_SIGNUP = {
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

        user_account.objects.create_user(**self.TEST_USER1)
        user_account.objects.create_user(**self.TEST_USER2)


    
    # covers if the account can be created internally on the backend
    def test_user_count(self): 

        user_count = user_account.objects.all().count()
        self.assertEquals(user_count, 2)

    # check if user_account can be retrieved from the database and check if the
    # password matches the one inputted to the create_user method
    def test_user_password(self):

        user_qs1 = user_account.objects.filter(email__iexact="test1@test.com")
        user1 = user_qs1.first()
        self.assertTrue(user1.check_password(self.TEST_USER1['password']))

        user_qs2 = user_account.objects.filter(email__iexact="test2@test.com")
        user2 = user_qs2.first()
        self.assertTrue(user2.check_password(self.TEST_USER2['password']))

    # test if the user is able to signup for an account using Djoser's endpoint
    def test_signup_api(self):

        signup_url = '/auth/users/'

        # test if user1 can signup
        response1 = self.client.post(signup_url, self.TEST_USER1_SIGNUP)
        status_code1 = response1.status_code

        # user should not be able to create an account since another account with the same email
        # is already present in the database
        self.assertEquals(status_code1, 400)

        # test if user2 can signup
        response2 = self.client.post(signup_url, self.TEST_USER2_SIGNUP)
        status_code2 = response2.status_code

        # user should not be able to create an account since another account with the same email
        # is already present in the database
        self.assertEquals(status_code2, 400)

        # test if user3 can signup
        response3 = self.client.post(signup_url, self.TEST_USER3_SIGNUP)
        status_code3 = response3.status_code

        # user should be able to create an account
        # expected HTTP status code = 201 for account created
        self.assertEquals(status_code3, 201)
        self.assertEquals(response3.data['email'], self.TEST_USER3_SIGNUP['email'])


    # test if user is able to get successfully authenticated by Djoser's /jwt/create/ endpoint
    def test_login_api(self):

        # fixed endpoint from Djoser
        login_url = '/auth/jwt/create/' 

        # test if user1 can login
        response1 = self.client.post(login_url, self.TEST_USER1_LOGIN)
        status_code1 = response1.status_code
        self.assertEquals(status_code1, 200)

        # test if user2 can login
        response2 = self.client.post(login_url, self.TEST_USER2_LOGIN)
        status_code2 = response2.status_code
        self.assertEquals(status_code2, 200)

    # test if user can use the JWT token obtained to access parts of the
    # site that requires login
    def test_JWT_authentication(self):
        
        # fixed endpoint from Djoser to login
        login_url = '/auth/jwt/create/' 

        # fixed endpoint from Djoser to obtain user data
        user_profile_url = '/auth/users/me/'

        # generate access token for user1
        response1 = self.client.post(login_url, self.TEST_USER1_LOGIN)
        USER1_ACCESS_TOKEN = response1.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER1_ACCESS_TOKEN,
        }

        response1 = self.client.get(user_profile_url, **auth_header)
        status_code1 = response1.status_code

        # check if the get request is successful
        self.assertEquals(status_code1, 200)

        # check if the response contains the correct information
        user1_email = response1.data['email']
        self.assertEquals(user1_email, self.TEST_USER1['email'])
        user1_name = response1.data['name']
        self.assertEquals(user1_name, self.TEST_USER1['name'])
        
        # generate access token for user2
        response2 = self.client.post(login_url, self.TEST_USER2_LOGIN)
        USER2_ACCESS_TOKEN = response2.data['access']

        auth_header = {
            'HTTP_AUTHORIZATION': "JWT " + USER2_ACCESS_TOKEN,
        }

        response2 = self.client.get(user_profile_url, **auth_header)
        status_code2 = response2.status_code

        # check if the get request is successful
        self.assertEquals(status_code2, 200)

        # check if the response contains the correct information
        user2_email = response2.data['email']
        self.assertEquals(user2_email, self.TEST_USER2['email'])
        user2_name = response2.data['name']
        self.assertEquals(user2_name, self.TEST_USER2['name'])