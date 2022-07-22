from django.shortcuts import render

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from requests import RequestException
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import booking_order
from .serializers import booking_serializer, booking_history_serializer
from payment.serializers import user_payment_credit_card_details_serializer
from datetime import datetime, date
import re

# function used to validate credit card number
# credits: https://www.geeksforgeeks.org/luhn-algorithm/
def valid_credit_card(cardNo):
     
    nDigits = len(cardNo)
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
        queryset = booking_order.objects.filter(user_account__exact = pk).select_related("payment_id").all().order_by('-datetime_created')
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
                "primary_guest_passport_number": ,
                "primary_guest_passport_country": ,
                "cost_in_sgd": ,
                "name_on_card": ,
                "card_number": ,
                "expiry_date": ,
                "security_code": ,
                "billing_address_address": ,
                "billing_address_country": ,
                "billing_address_city": ,
                "billing_address_post_code": 
            }

        Returns:
            A response that contains all the booking information being saved into the database
        """
        
        Error_Responses = {}     

        # ensure that the request contains a card_number field in data
        if 'card_number' in request.data:
            card_number = request.data['card_number']
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
                billing_address_post_code = billing_address_post_code.replace(" ", "")
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
                if (re.fullmatch(regex, primary_guest_email)):
                    print("valid email")
                else:
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
                    if (exp_date.year < date.today().year) or (exp_date.year == date.today().year and exp_date.month < date.today().month ):
                        Error_Responses["expiry_date"] = "Invalid Credit Card Expiry Date. Credit card has expired."
                except ValueError:
                    Error_Responses["expiry_date"] = "Invalid Credit Card Expiry Date. Requires date in MM/YYYY"
            else:
                Error_Responses["expiry_date"] = "Missing Credit Card Expiry Date"
        else:
            Error_Responses["expiry_date"] = "Request requires Credit Card Expiry Date"
            
        if Error_Responses != {}:
            return Response(Error_Responses, status=status.HTTP_400_BAD_REQUEST)

        # check if credit card number is present in the request

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
                request.data['security_code'] = ''

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
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                else:
                    return Response(payment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response({"card_number": "Invalid Credit Card Number"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"card_number": "Missing Credit Card Number"}, status=status.HTTP_400_BAD_REQUEST)

    # modify a user's booking_data
    # pk = booking uid
    def put(self, request, pk):
        instance = get_object_or_404(booking_order.objects.all(), pk=pk)

        # ensure that the user can only update their own booking
        user = str(request.user.uid)
        queryset = booking_order.objects.filter(user_account__exact = user)
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
        return Response(serializer.data, status = status.HTTP_200_OK)


    # get all the bookings under any 1 user in the Database
    # pk = user uid
    def get(self, request, pk):
        # only admins can use this endpoint
        permission_classes = (IsAdminUser,)
        queryset = booking_order.objects.filter(user_account__exact = pk)
        serializer = booking_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# # generate the html webpage for hotel tnc
# class HotelTnCView(TemplateView):
#     template_name = "hotel_tnc.html"

# # generate the html webpage for booking tnc
# class BookingTnCView(TemplateView):
#     template_name = "booking_tnc.html"