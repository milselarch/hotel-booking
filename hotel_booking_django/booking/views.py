from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import booking_order
from .serializers import booking_serializer, booking_history_serializer
from payment.serializers import user_payment_credit_card_details_serializer
from api_proxy.views import proxy_view
from datetime import datetime, date
import re
import json

# function used to validate credit card number
# credits: https://www.geeksforgeeks.org/luhn-algorithm/
def valid_credit_card(cardNo):
    #check if card number is all int
    if(not cardNo.isdigit()):
        return False
    
    nDigits = len(cardNo)

    if not (nDigits >= 8 and nDigits <= 19):
        return False

    nSum = 0
    isSecond = False

    for i in range(nDigits - 1, -1, -1):
        d = ord(cardNo[i]) - ord('0')

        if (isSecond == True):
            d = d * 2

        # We add two digits to handle
        # cases that make two digits after
        # doubling
        nSum += d // 10
        nSum += d % 10

        isSecond = not isSecond

    if (nSum % 10 == 0):
        return True
    else:
        return False


class user_booking_data(APIView):

    # require login to interact with booking data
    permission_classes = (IsAuthenticated,)

    # get the bookings of the logged-in user
    def get(self, request):
        pk = request.user.uid
        queryset = booking_order.objects.filter(user_account__exact=pk).select_related(
            "payment_id").all().order_by('-datetime_created')
        serializer = booking_history_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a booking under the user account

        Args:
            request: a request that contains a json object in its data field.
            The json object should contain these information:
            {
                "hotel_id": ,
                "room_type_id": ,
                "booking_id": ,
                "check_in_date": ,
                "check_out_date": ,
                "number_of_rooms": ,
                "number_of_guests_per_rooms": ,
                "special_request": ,
                "primary_guest_title": ,
                "primary_guest_first_name": ,
                "primary_guest_last_name": ,
                "primary_guest_phone": ,
                "primary_guest_phone_country": ,
                "cost_in_sgd": ,
                "name_on_card": ,
                "card_number": ,
                "billing_address": ,
                "billing_address_country": ,
                "billing_address_city": ,
                "billing_address_post_code":
            }

        Returns:
            A response that contains all the booking information being saved into the database
        """

        Error_Responses = {}

        Error_Responses = self.booking_fields_validation(
            request, Error_Responses)

        if Error_Responses != {}:
            return Response(Error_Responses, status=status.HTTP_400_BAD_REQUEST)

        # START OF VERIFYING PRICE CALCULATIONS
        result_json_content = self.room_details_get_request(request)
        resp = self.verify_hotel_price_from_ascenda_api_matches_with_request_from_client(result_json_content, request)
        if resp != None:
            return resp
        # END OF VERIFYING PRICE CALCULATIONS

        # save the payment info first to generate the payment id
        payment_serializer = user_payment_credit_card_details_serializer(data=request.data)
        if payment_serializer.is_valid():

            # obtain the user_payment_credit_card_details object
            payment = payment_serializer.save()

            # update the request with the payment id obtained
            request.data['payment_id'] = payment.uid
                

            # serializer to serialize all the data in the request
            serializer = booking_serializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            else:
                Error_Responses = {**Error_Responses, **serializer.errors}

        else:
            Error_Responses = {**Error_Responses, **payment_serializer.errors}

        if Error_Responses != {}:
            return Response(Error_Responses, status=status.HTTP_400_BAD_REQUEST)
    
    def verify_hotel_price_from_ascenda_api_matches_with_request_from_client(self, result_json_content, request):
        selected_room_price = 0
        if result_json_content["proxy_success"] == True:
            result_dict = result_json_content["proxy_json"]
            print(f"req: {request.data['room_type_id']}")
            if "rooms" in result_dict and isinstance(result_dict["rooms"], list) and len(result_dict["rooms"]) > 0:
                for i in result_dict["rooms"]:
                    print(i["type"])
                    if(i["type"] == request.data["room_type_id"] and i['roomAdditionalInfo']['breakfastInfo'] == request.data["room_breakfast_info"]):
                        # print(f"found: {i['type']} - {i['roomAdditionalInfo']['breakfastInfo']}")
                        selected_room_price = i['price']
                        break
            if selected_room_price <= 0 or request.data['number_of_rooms'] <= 0:
                return Response("Room Price cannot be verified", status=status.HTTP_400_BAD_REQUEST)
            else:
                calculated_price = selected_room_price * \
                    request.data['number_of_rooms']
                if(calculated_price != request.data['cost_in_sgd']):
                    return Response("Price in web browser doesn't match with price in system", status=status.HTTP_400_BAD_REQUEST)
        else:
            # print(result_json_content["error_message"])
            return Response(result_json_content["error_message"], status=status.HTTP_400_BAD_REQUEST)

    def room_details_get_request(self, request):
        getReq = type(
            "request",  # the name
            (object,),  # base classess
            {  # the body
                "GET": {
                    "destination_id": request.data["destination_id"],
                    "checkin": request.data["check_in_date"],
                    "checkout": request.data["check_out_date"],
                    "lang": "en_US",
                    "currency": "SGD",
                    "partner_id": "16",
                    "country_code": "SG",
                    "guests": request.data["number_of_guests_per_rooms"]
                }
            }
        )()

        result_json_response = proxy_view(
            getReq, f"hotels/{request.data['hotel_id']}/price")
        result_json_content = json.loads(result_json_response.content)
        return result_json_content

    def booking_fields_validation(self, request, Error_Responses):
        # ensure that the request contains a card_number field in data
        if 'card_number' in request.data:
            card_number = request.data['card_number']
            if card_number != "" and card_number != None:
                # remove whitespaces from the credit card number
                card_number = card_number.replace(" ", "")

                # update card number in request with the
                # removed whitespaces credit card number
                request.data['card_number'] = card_number


                # check if credit card number is valid
                if valid_credit_card(card_number):
                    # pre-fill the data of the logged in user
                    request.data["user_account"] = request.user.uid
                    # mask credit card
                    request.data['card_number'] = card_number[-4:]
                else:
                    Error_Responses["card_number"] = "Invalid Credit Card Number"
            else:
                Error_Responses["card_number"] = "Missing Credit Card Number"
        else:
            Error_Responses["card_number"] = "Request requires a card number field"

        if 'security_code' in request.data:
            security_code = request.data['security_code']
            if security_code != "" and security_code != None:
                security_code = security_code.replace(" ", "")
                request.data['security_code'] = security_code
                
                if len(security_code) != 3:
                    Error_Responses["security_code"] = "Invalid CVV/CVC. Requires 3 digits."
                else:
                    # valid security code but dont store into db for PII and payment security
                    request.data['security_code'] = ''
            else:
                Error_Responses["security_code"] = "Missing CVV/CVC value"
        else:
            Error_Responses["security_code"] = "Request requires CVV/CVC value"

        if 'primary_guest_phone' in request.data:
            primary_guest_phone = request.data['primary_guest_phone']
            if primary_guest_phone != "" and primary_guest_phone != None:
                primary_guest_phone = primary_guest_phone.replace(" ", "")
                request.data['primary_guest_phone'] = primary_guest_phone

                if (len(primary_guest_phone) < 8 or len(primary_guest_phone) > 12):
                    Error_Responses["primary_guest_phone"] = "Invalid Primary Guest Phone number. Requires 8-12 digits."
            else:
                Error_Responses["primary_guest_phone"] = "Missing Primary Guest Phone number"
        else:
            Error_Responses["primary_guest_phone"] = "Request requires Primary Guest Phone number"

        if 'billing_address_post_code' in request.data:
            billing_address_post_code = request.data['billing_address_post_code']
            if billing_address_post_code != "" and billing_address_post_code != None:
                billing_address_post_code = billing_address_post_code.replace(
                    " ", "")
                request.data['billing_address_post_code'] = billing_address_post_code
                
                if (len(billing_address_post_code) < 5 or len(billing_address_post_code) > 6):
                    Error_Responses["billing_address_post_code"] = "Invalid Postal Code. Requires 5-6 digits."
            else:
                Error_Responses["billing_address_post_code"] = "Missing Postal Code"
        else:
            Error_Responses["billing_address_post_code"] = "Request requires Postal Code"

        if 'primary_guest_email' in request.data:
            primary_guest_email = request.data['primary_guest_email']
            if primary_guest_email != "" and primary_guest_email != None:
                primary_guest_email = primary_guest_email.replace(" ", "")
                request.data['primary_guest_email'] = primary_guest_email
                
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if not (re.fullmatch(regex, primary_guest_email)):
                    Error_Responses["primary_guest_email"] = "Invalid Primary Guest's Email Address Format"
            else:
                Error_Responses["primary_guest_email"] = "Missing Primary Guest's Email"
        else:
            Error_Responses["primary_guest_email"] = "Request Primary Guest's Email"

        if 'expiry_date' in request.data:
            expiry_date = request.data['expiry_date']
            if expiry_date != "" and expiry_date != None:
                expiry_date = expiry_date.replace(" ", "")
                request.data['expiry_date'] = expiry_date
                
                # incorrect format
                try:
                    exp_date = datetime.strptime(expiry_date, "%Y-%m-%d")
                    if (exp_date.year < date.today().year) or (exp_date.year == date.today().year and exp_date.month < date.today().month):
                        Error_Responses["expiry_date"] = "Invalid Credit Card Expiry Date. Credit card has expired."
                    else:
                        # valid but don't store in db
                        request.data['expiry_date'] = None
                        
                except ValueError:
                    Error_Responses["expiry_date"] = "Invalid Credit Card Expiry Date. Requires date in MM/YYYY"
            else:
                Error_Responses["expiry_date"] = "Missing Credit Card Expiry Date"
        else:
            Error_Responses["expiry_date"] = "Request requires Credit Card Expiry Date"
        return Error_Responses

    # modify a user's booking_data
    # pk = booking uid

    def put(self, request, pk):
        instance = get_object_or_404(booking_order.objects.all(), pk=pk)

        # ensure that the user can only update their own booking
        user = str(request.user.uid)
        queryset = booking_order.objects.filter(user_account__exact=user)
        if instance not in queryset:
            return Response({"user_account": "booking not found under user"}, status=status.HTTP_403_FORBIDDEN)

        serializer = booking_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class admin_booking_data(APIView):

    # only admins can use this endpoint
    permission_classes = (IsAdminUser,)

    # get all the bookings in the Database
    def get(self, request):
        queryset = booking_order.objects.all()
        serializer = booking_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # get all the bookings under any 1 user in the Database
    # pk = user uid

    def get(self, request, pk):
        # only admins can use this endpoint
        permission_classes = (IsAdminUser,)
        queryset = booking_order.objects.filter(user_account__exact=pk)
        serializer = booking_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# # generate the html webpage for hotel tnc
# class HotelTnCView(TemplateView):
#     template_name = "hotel_tnc.html"

# # generate the html webpage for booking tnc
# class BookingTnCView(TemplateView):
#     template_name = "booking_tnc.html"

class BookingCreation_LoadTest(APIView):
    # only admins can use this endpoint
    permission_classes = (IsAuthenticated,)

    # load test endpoint for booking creation
    def post(self, request):
        """
        Create a booking under the user account

        Args:
            request: a request that contains a json object in its data field.
            The json object should contain these information:
            {
                "hotel_id": ,
                "room_type_id": ,
                "booking_id": ,
                "check_in_date": ,
                "check_out_date": ,
                "number_of_rooms": ,
                "number_of_guests_per_rooms": ,
                "special_request": ,
                "primary_guest_title": ,
                "primary_guest_first_name": ,
                "primary_guest_last_name": ,
                "primary_guest_phone": ,
                "primary_guest_phone_country": ,
                "cost_in_sgd": ,
                "name_on_card": ,
                "card_number": ,
                "billing_address": ,
                "billing_address_country": ,
                "billing_address_city": ,
                "billing_address_post_code":
            }

        Returns:
            A response that contains all the booking information being saved into the database
        """

        Error_Responses = {}

        Error_Responses = self.booking_fields_validation(
            request, Error_Responses)

        if Error_Responses != {}:
            return Response(Error_Responses, status=status.HTTP_400_BAD_REQUEST)

        # save the payment info first to generate the payment id
        payment_serializer = user_payment_credit_card_details_serializer(data=request.data)
        if payment_serializer.is_valid():

            # serializer to serialize all the data in the request
            serializer = booking_serializer(data=request.data)

            if serializer.is_valid():
                # return response without saving the booking
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            else:
                Error_Responses = {**Error_Responses, **serializer.errors}

        else:
            Error_Responses = {**Error_Responses, **payment_serializer.errors}

        if Error_Responses != {}:
            return Response(Error_Responses, status=status.HTTP_400_BAD_REQUEST)

    def booking_fields_validation(self, request, Error_Responses):
        # ensure that the request contains a card_number field in data
        if 'card_number' in request.data:
            card_number = request.data['card_number']
            if card_number != "" and card_number != None:
                # remove whitespaces from the credit card number
                card_number = card_number.replace(" ", "")

                # update card number in request with the
                # removed whitespaces credit card number
                _mutable = request.data._mutable
                request.data._mutable = True
                request.data['card_number'] = card_number
                request.data._mutable = _mutable


                # check if credit card number is valid
                if valid_credit_card(card_number):
                    # pre-fill the data of the logged in user
                    
                    _mutable = request.data._mutable
                    request.data._mutable = True
                    request.data["user_account"] = request.user.uid
                    request.data._mutable = _mutable
                    # mask credit card
                    _mutable = request.data._mutable
                    request.data._mutable = True
                    request.data['card_number'] = card_number[-4:]
                    request.data._mutable = _mutable

                else:
                    Error_Responses["card_number"] = "Invalid Credit Card Number"
            else:
                Error_Responses["card_number"] = "Missing Credit Card Number"
        else:
            Error_Responses["card_number"] = "Request requires a card number field"

        if 'security_code' in request.data:
            security_code = request.data['security_code']
            if security_code != "" and security_code != None:
                security_code = security_code.replace(" ", "")
                _mutable = request.data._mutable
                request.data._mutable = True
                request.data['security_code'] = security_code
                request.data._mutable = _mutable
                
                if len(security_code) != 3:
                    Error_Responses["security_code"] = "Invalid CVV/CVC. Requires 3 digits."
                else:
                    # valid security code but dont store into db for PII and payment security
                    _mutable = request.data._mutable
                    request.data._mutable = True
                    request.data['security_code'] = ''
                    request.data._mutable = _mutable
            else:
                Error_Responses["security_code"] = "Missing CVV/CVC value"
        else:
            Error_Responses["security_code"] = "Request requires CVV/CVC value"

        if 'primary_guest_phone' in request.data:
            primary_guest_phone = request.data['primary_guest_phone']
            if primary_guest_phone != "" and primary_guest_phone != None:
                primary_guest_phone = primary_guest_phone.replace(" ", "")
                _mutable = request.data._mutable
                request.data._mutable = True
                request.data['primary_guest_phone'] = primary_guest_phone
                request.data._mutable = _mutable

                if (len(primary_guest_phone) < 8 or len(primary_guest_phone) > 12):
                    Error_Responses["primary_guest_phone"] = "Invalid Primary Guest Phone number. Requires 8-12 digits."
            else:
                Error_Responses["primary_guest_phone"] = "Missing Primary Guest Phone number"
        else:
            Error_Responses["primary_guest_phone"] = "Request requires Primary Guest Phone number"

        if 'billing_address_post_code' in request.data:
            billing_address_post_code = request.data['billing_address_post_code']
            if billing_address_post_code != "" and billing_address_post_code != None:
                billing_address_post_code = billing_address_post_code.replace(
                    " ", "")
                _mutable = request.data._mutable
                request.data._mutable = True
                request.data['billing_address_post_code'] = billing_address_post_code
                request.data._mutable = _mutable
                
                if (len(billing_address_post_code) < 5 or len(billing_address_post_code) > 6):
                    Error_Responses["billing_address_post_code"] = "Invalid Postal Code. Requires 5-6 digits."
            else:
                Error_Responses["billing_address_post_code"] = "Missing Postal Code"
        else:
            Error_Responses["billing_address_post_code"] = "Request requires Postal Code"

        if 'primary_guest_email' in request.data:
            primary_guest_email = request.data['primary_guest_email']
            if primary_guest_email != "" and primary_guest_email != None:
                primary_guest_email = primary_guest_email.replace(" ", "")
                _mutable = request.data._mutable
                request.data._mutable = True
                request.data['primary_guest_email'] = primary_guest_email
                request.data._mutable = _mutable
                
                regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                if not (re.fullmatch(regex, primary_guest_email)):
                    Error_Responses["primary_guest_email"] = "Invalid Primary Guest's Email Address Format"
            else:
                Error_Responses["primary_guest_email"] = "Missing Primary Guest's Email"
        else:
            Error_Responses["primary_guest_email"] = "Request Primary Guest's Email"

        if 'expiry_date' in request.data:
            expiry_date = request.data['expiry_date']
            if expiry_date != "" and expiry_date != None:
                expiry_date = expiry_date.replace(" ", "")
                _mutable = request.data._mutable
                request.data._mutable = True
                request.data['expiry_date'] = expiry_date
                request.data._mutable = _mutable
                
                # incorrect format
                try:
                    exp_date = datetime.strptime(expiry_date, "%Y-%m-%d")
                    if (exp_date.year < date.today().year) or (exp_date.year == date.today().year and exp_date.month < date.today().month):
                        Error_Responses["expiry_date"] = "Invalid Credit Card Expiry Date. Credit card has expired."
                    else:
                        # valid but don't store in db
                        _mutable = request.data._mutable
                        request.data._mutable = True
                        request.data['expiry_date'] = None
                        request.data._mutable = _mutable
                        
                except ValueError:
                    Error_Responses["expiry_date"] = "Invalid Credit Card Expiry Date. Requires date in MM/YYYY"
            else:
                Error_Responses["expiry_date"] = "Missing Credit Card Expiry Date"
        else:
            Error_Responses["expiry_date"] = "Request requires Credit Card Expiry Date"
        return Error_Responses