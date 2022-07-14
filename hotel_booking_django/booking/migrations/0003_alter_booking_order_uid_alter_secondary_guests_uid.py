# Generated by Django 4.0.5 on 2022-07-05 09:35

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0002_alter_booking_order_uid_alter_secondary_guests_uid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking_order',
            name='uid',
            field=models.UUIDField(default=uuid.UUID('8dd61413-642f-4136-9955-676b643fd30d'), editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='secondary_guests',
            name='uid',
            field=models.UUIDField(default=uuid.UUID('8dd61413-642f-4136-9955-676b643fd30d'), editable=False, primary_key=True, serialize=False),
        ),
    ]