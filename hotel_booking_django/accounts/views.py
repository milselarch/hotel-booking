from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.utils.decorators import method_decorator

from rest_framework.authentication import (
    SessionAuthentication, BasicAuthentication
)
from rest_framework_simplejwt.authentication import (
    JWTAuthentication, JWTTokenUserAuthentication
)

from rest_framework.permissions import IsAuthenticated
from rest_framework import authentication, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class LogoutView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        request.csrf_processing_done = True
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, format=None):
        print('ENTER COOKIE', request)

        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print('LOGOUT ERR', e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # authentication_classes = [JWTAuthentication]

    @staticmethod
    def get(request):
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


# a convenient view without the need to authenticate for load testing
class LoadTestingView(APIView):
    @staticmethod
    def get(request):
        data = {"status": "ok"}
        return Response(data, status=status.HTTP_200_OK)
