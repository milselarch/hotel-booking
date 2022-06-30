"""hotel_booking_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

from hotel_booking_django.api_proxy import proxy_view, proxy_mocklabs
from rest_framework_simplejwt import views as jwt_views
from accounts.views import ExampleView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    path('auth_test', ExampleView.as_view(), name='example'),
    path(
        'token/refresh/',
        csrf_exempt(jwt_views.TokenRefreshView.as_view()),
        name='token_refresh'
    ),
]

urlpatterns += [
    re_path('proxy/(?P<path>.*)', proxy_view),
    re_path('mocklabs/(?P<path>.*)', proxy_mocklabs),

    re_path(
        r'^.*',
        TemplateView.as_view(template_name='index.html')
    ),
]