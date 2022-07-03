from django.shortcuts import render

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import booking_order
from .serializers import booking_serializer

class booking_data(APIView):

    # # require login to interact with booking data
    # permission_classes = (IsAuthenticated,)

    # get all the bookings under the user in the Database
    # pk = user uid
    def get(self, request, pk):
        queryset = booking_order.objects.filter(user_account__exact = pk)
        serializer = booking_serializer(queryset, many=True)
        return Response(serializer.data)
    
    # create a booking under the user account
    # pass in UID in the user_account field
    def post(self, request):
        serializer = booking_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    # permission_classes = [IsAdminUser]

    # get all the bookings in the Database
    def get(self, request):
        queryset = booking_order.objects.all()
        serializer = booking_serializer(queryset, many=True)
        return Response(serializer.data)