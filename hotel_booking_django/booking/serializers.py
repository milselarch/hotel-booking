from rest_framework import serializers
from .models import booking_order

# serialize all the datafields in the booking_order model
class booking_serializer(serializers.ModelSerializer):
    class Meta:
        model = booking_order
        fields = ("__all__")