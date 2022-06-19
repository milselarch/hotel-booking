import requests
import traceback
import json

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
    print(f'REMOTE: {remote_url}')
    proxy_success, error_message = True, ''
    response_json, raw_response = {}, ''
    response, status = None, -1

    try:
        response = requests.get(remote_url)
    except requests.exceptions.RequestException as e:
        traceback.print_exc()
        error_message = str(e)
        proxy_success = False

    if response is not None:
        status = response.status_code

        try:
            response_json = response.json()
        except json.decoder.JSONDecodeError:
            raw_response = response.content.decode()

    return JsonResponse({
        'proxy_success': proxy_success,
        'error_message': error_message,
        'proxy_json': response_json,
        'proxy_raw_response': raw_response,
        'status_code': status
    })