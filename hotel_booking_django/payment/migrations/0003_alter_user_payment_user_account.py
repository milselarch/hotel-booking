# Generated by Django 4.0.5 on 2022-07-22 01:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('payment', '0002_alter_user_payment_credit_card_details_billing_address_country'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_payment',
            name='user_account',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]
