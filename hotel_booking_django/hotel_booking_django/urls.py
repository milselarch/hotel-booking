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
from booking import views
from django.views.decorators.csrf import csrf_exempt

from common.views import get_csrf_token
from hotel_booking_django.api_proxy import proxy_view, proxy_mocklabs
from rest_framework_simplejwt import views as jwt_views
from accounts.views import ProfileView, LoadTestingView, LogoutView
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('booking/', views.user_booking_data.as_view(),),
    path('booking/<str:pk>/', views.user_booking_data.as_view(),),
    path('admin_booking/', views.admin_booking_data.as_view(),),
    path('admin_booking/<str:pk>/', views.admin_booking_data.as_view(),),
    path('loadTest', LoadTestingView.as_view(),),

    path('load-csrf', csrf_exempt(get_csrf_token)),
    path('token-logout/', csrf_exempt(LogoutView.as_view()), name='auth_logout'),
    path('auth_test', ProfileView.as_view(), name='example'),
    path('profile', ProfileView.as_view(), name='profile'),
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