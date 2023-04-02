"""
Django settings for hotel_booking_django project.

Generated by 'django-admin startproject' using Django 4.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = str(os.environ.get('DEBUG')) == '1'

# https://stackoverflow.com/questions/24857158
ALLOWED_HOSTS = ['*']
"""
[
    'localhost', '127.0.0.1', 
    'backend.milselarch.com', 
    'hotels.milselarch.com',
    'ascenda-52c6d.web.app',

    'hotel-booking-django-dev.us-west-2.elasticbeanstalk.com',
    'hotel-booking-django-dev1.us-west-2.elasticbeanstalk.com',
    'hotel-booking-django-dev2.us-west-2.elasticbeanstalk.com'
]
"""

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'djoser',
    'accounts',
    'booking',
    'common',
    'payment',
    "encrypted_fields",
    "api_proxy"
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080", 
    "https://ascenda-52c6d.web.app",
    "https://hotels.milselarch.com",
    "https://www.hotel458.rocks.s3-website-ap-southeast-1.amazonaws.com",
    "http://www.hotel458.rocks.s3-website-ap-southeast-1.amazonaws.com",
    "http://www.hotel458.rocks",
    "https://www.hotel458.rocks"
]

# set CSRF hosts allowed to be the same as for CORS
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
CSRF_COOKIE_NAME = "csrftoken"
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_HTTPONLY = False
# CSRF_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SAMESITE = 'None'

CORS_ALLOW_HEADERS = [
    'HTTP_AUTHORIZATION', 'content-type', 'Authorization',
    'x-csrf-token', "X-CSRFToken", "refresh_token"
]

ROOT_URLCONF = 'hotel_booking_django.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hotel_booking_django.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', 
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'rest_framework.permissions.IsAuthenticated',
    # )
}

SIMPLE_JWT = {
   'AUTH_HEADER_TYPES': ('JWT',),
   'USER_ID_FIELD': 'uid',
   'ACCESS_TOKEN_LIFETIME': timedelta(minutes=21),
}

DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True, # pass re_password to /users/ endpoint
    'SERIALIZERS': {
        'user_create': 'accounts.serializers.UserCreateSerializer',
        'user': 'accounts.serializers.UserCreateSerializer',
        'user_delete': 'djoser.serializers.UserDeleteSerializer',
        "current_user": 'accounts.serializers.UserCreateSerializer',
    }
}

# A list of hex-encoded 32 byte keys
# You only need one unless/until rotating keys
FIELD_ENCRYPTION_KEYS = [
    os.environ.get('FIELD_ENCRYPTION_KEY'),
]

AUTH_USER_MODEL = 'accounts.user_account'
