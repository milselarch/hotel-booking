from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
import pytz

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):

    datetime_created = serializers.DateTimeField(default_timezone=pytz.timezone('Asia/Singapore'), read_only=True,format="%d-%b-%Y %H:%M:%S")
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("__all__")
