# Generated by Django 4.0.5 on 2022-07-16 16:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('payment', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='booking_order',
            fields=[
                ('uid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('datetime_modified', models.DateTimeField(auto_now=True)),
                ('destination_id', models.CharField(max_length=255)),
                ('hotel_id', models.CharField(max_length=255)),
                ('room_type_id', models.CharField(max_length=255)),
                ('booking_id', models.CharField(blank=True, max_length=255, null=True)),
                ('check_in_date', models.DateField()),
                ('check_out_date', models.DateField()),
                ('number_of_rooms', models.IntegerField()),
                ('number_of_guests_per_rooms', models.IntegerField()),
                ('special_request', models.CharField(blank=True, max_length=500, null=True)),
                ('primary_guest_title', models.CharField(choices=[('MR', 'Mr.'), ('MS', 'Ms.'), ('MRS', 'Mrs.')], max_length=3)),
                ('primary_guest_first_name', models.CharField(max_length=100)),
                ('primary_guest_last_name', models.CharField(max_length=100)),
                ('primary_guest_email', models.CharField(max_length=100)),
                ('primary_guest_phone', models.CharField(max_length=100)),
                ('primary_guest_phone_country', models.CharField(max_length=200)),
                ('did_primary_guest_accept_tnc', models.BooleanField()),
                ('cost_in_sgd', models.DecimalField(decimal_places=3, max_digits=10)),
                ('datetime_created', models.DateTimeField(auto_now_add=True)),
                ('booking_tnc', models.CharField(default='This is a sample booking terms and condition', max_length=1000)),
                ('hotel_tnc', models.CharField(default='This is a sample hotel terms and condition', max_length=1000)),
                ('payment_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payment.user_payment_credit_card_details')),
                ('user_account', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]