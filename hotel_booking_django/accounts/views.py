from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Create your views here.


@csrf_exempt
def ping_test(request, path):
    return JsonResponse({
        'pinged': True
    })