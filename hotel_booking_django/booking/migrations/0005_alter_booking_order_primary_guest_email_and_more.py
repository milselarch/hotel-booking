# Generated by Django 4.0.5 on 2022-08-01 16:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_cryptography.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('booking', '0004_booking_order_room_breakfast_info'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_email',
            field=django_cryptography.fields.encrypt(models.CharField(max_length=100)),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_first_name',
            field=django_cryptography.fields.encrypt(models.CharField(max_length=100)),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_last_name',
            field=django_cryptography.fields.encrypt(models.CharField(max_length=100)),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_phone',
            field=django_cryptography.fields.encrypt(models.CharField(max_length=100)),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_phone_country',
            field=django_cryptography.fields.encrypt(models.CharField(max_length=200)),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='primary_guest_title',
            field=django_cryptography.fields.encrypt(models.CharField(choices=[('MR', 'Mr.'), ('MS', 'Ms.'), ('MRS', 'Mrs.')], max_length=3)),
        ),
        migrations.AlterField(
            model_name='booking_order',
            name='user_account',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
