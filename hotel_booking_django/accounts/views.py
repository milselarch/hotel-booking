from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from rest_framework_simplejwt.authentication import (
    JWTAuthentication, JWTTokenUserAuthentication
)
from rest_framework.permissions import IsAuthenticated
from rest_framework import authentication, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        print(user, type(user))

        content = {
            'status': 'request was permitted',
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        response = JsonResponse(content)
        return response