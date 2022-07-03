import requests
import traceback
import json
import time

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


@csrf_exempt
def proxy_view(request, path):
    return proxy_request(
        request, path, base_url=f'https://hotelapi.loyalty.dev/api'
    )


@csrf_exempt
def proxy_mocklabs(request, path):
    return proxy_request(
        request, path, base_url=f'https://ascendahotels.mocklab.io/api'
    )


def proxy_request(request, path, base_url):
    assert not base_url.endswith('/')
    formatted_get_params = '&'.join([
        f'{param}={request.GET[param]}' for param in request.GET
    ])

    # print('params', get_params)
    sess = requests.Session()
    remote_url = f'{base_url}/{path}?{formatted_get_params}'
    print(f'REMOTE: {remote_url}')
    proxy_success, error_message = True, ''
    response_json, raw_response = {}, ''
    response, status_code = None, -1
    attempts = 0

    while True:
        # we keep sending our request till the api
        # says that completed is true
        attempts += 1

        try:
            response = sess.get(remote_url)
        except requests.exceptions.RequestException as e:
            traceback.print_exc()
            error_message = str(e)
            proxy_success = False

        if response is None:
            break

        status_code = response.status_code

        try:
            response_json = response.json()
        except json.decoder.JSONDecodeError:
            raw_response = response.content.decode()
            break

        if 'completed' not in response_json:
            # print('COMPLETED NOT IN')
            break

        completed = response_json['completed']
        if completed:
            break

        print('ATTEMPT NO', attempts, len(response_json))
        time.sleep(2)

    return JsonResponse({
        'proxy_success': proxy_success,
        'error_message': error_message,
        'proxy_json': response_json,
        'proxy_raw_response': raw_response,
        'status_code': status_code
    })