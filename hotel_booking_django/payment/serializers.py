from rest_framework import serializers
from .models import user_payment_credit_card_details

# serialize all the datafields in the user_payment_credit_card_details model
class user_payment_credit_card_details_serializer(serializers.ModelSerializer):

    class Meta:
        model = user_payment_credit_card_details
        fields = (
                'uid', 
                'name_on_card',
                'card_number',
                'expiry_date',
                'security_code',
                'billing_address_address',
                'billing_address_country',
                'billing_address_city',
                'billing_address_post_code',
                'user_payment'
                )