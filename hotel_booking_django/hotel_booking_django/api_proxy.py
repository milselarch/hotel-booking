import requests

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


@csrf_exempt
def proxy_view(request, path):
    base_url = f'https://hotelapi.loyalty.dev/api'
    formatted_get_params = '&'.join([
        f'{param}={request.GET[param]}' for param in request.GET
    ])

    # print('params', get_params)
    remote_url = f'{base_url}/{path}?{formatted_get_params}'
    proxy_success, error_message = True, ''
    response_json = {}

    try:
        response = requests.get(remote_url)
        response_json = response.json()
    except requests.exceptions.RequestException as e:
        error_message = str(e)
        proxy_success = False

    return JsonResponse({
        'proxy_success': proxy_success,
        'error_message': error_message,
        'proxy_response': response_json
    })