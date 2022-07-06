from django.shortcuts import render

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import booking_order
from .serializers import booking_serializer
from payment.serializers import user_payment_credit_card_details_serializer
import re

# function used to validate credit card number
# credits: https://linuxconfig.org/regular-expression-to-validate-credit-card-number
def valid_credit_card(card_number):
    cc_list = [
        '1234 5678 1234 5678',
        '1234567812345678',
        '1234-5678-1234-5678',
        '1234-5678-1234-56786',
        '1234-55678-1234-5678'
        ]
    pattern = '^([0-9]{4}[- ]?){3}[0-9]{4}$'
    for eachnumber in cc_list:
        result = re.match(pattern, eachnumber)
        if result:
            return True
        else:
            return False


class booking_data(APIView):

    # require login to interact with booking data
    permission_classes = (IsAuthenticated,)

    # get all the bookings under 1 user in the Database
    # pk = user uid
    def get(self, request, pk):
        queryset = booking_order.objects.filter(user_account__exact = pk)
        serializer = booking_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):

        """
        Create a booking under the user account

        Args:
            request: a request that contains a json object in its data field.
            The json object should contain these information:
            {
                "user_account": ,
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
                "datetime_created": ,
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

        # remove whitespaces from the credit card number
        card_number = request.data['card_number'].replace(" ", "")

        # check if credit card number is present
        if card_number != None:

            # update card number in request with the
            # removed whitespaces credit card number
            request.data['card_number'] = card_number

            # check if credit card number is valid    
            if valid_credit_card(card_number):

                # pre-fill the data of the logged in user
                request.data["user_account"] = request.user.uid

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
                return Response({"error: Invalid Credit Card Number"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error: Missing Credit Card Number"}, status=status.HTTP_400_BAD_REQUEST)




    # modify a user's booking_data
    # pk = booking uid
    def put(self, request, pk):
        instance = get_object_or_404(booking_order.objects.all(), pk=pk)
        serializer = booking_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class all_booking_data(APIView):

    # only admins can use this endpoint
    permission_classes = (IsAdminUser,)

    # get all the bookings in the Database
    def get(self, request):
        queryset = booking_order.objects.all()
        serializer = booking_serializer(queryset, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)

# # generate the html webpage for hotel tnc
# class HotelTnCView(TemplateView):
#     template_name = "hotel_tnc.html"

# # generate the html webpage for booking tnc
# class BookingTnCView(TemplateView):
#     template_name = "booking_tnc.html"