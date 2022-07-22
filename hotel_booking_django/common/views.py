import django

from django.shortcuts import render
from django.http import JsonResponse


# Create your views here.
def get_csrf_token(request):
    token = django.middleware.csrf.get_token(request)
    return JsonResponse({'token': token})
