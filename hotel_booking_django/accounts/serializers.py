from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
<<<<<<< HEAD
        fields = (
            'uid', 
            'email', 
            'first_name', 
            'last_name', 
            'password', 
            'phone',
            'title',
            'phone_country',
            'display_currency_preference',
            'datetime_created',
            )
=======
        fields = ('uid', 'email', 'first_name', 'last_name', 'password')
>>>>>>> 3c69483506816ea366d62a350dc76af68fbf205f
