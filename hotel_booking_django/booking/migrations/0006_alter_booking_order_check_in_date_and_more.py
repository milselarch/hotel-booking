# Generated by Django 4.0.5 on 2022-07-16 08:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('payment', '0004_alter_user_payment_user_account_and_more'),
        ('booking', '0005_booking_order_did_primary_guest_accept_tnc_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking_order',
            name='check_in_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='check_out_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='cost_in_sgd',
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='did_primary_guest_accept_tnc',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='hotel_id',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='number_of_guests_per_rooms',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='number_of_rooms',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='payment_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='payment.user_payment_credit_card_details'),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_email',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_first_name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_last_name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_phone',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_phone_country',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_title',
            field=models.CharField(choices=[('MR', 'Mr.'), ('MS', 'Ms.'), ('MRS', 'Mrs.')], max_length=3),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='room_type_id',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='user_account',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]