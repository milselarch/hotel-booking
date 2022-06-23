# Generated by Django 4.0.5 on 2022-06-23 12:10

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking_order',
            name='uid',
            field=models.UUIDField(default=uuid.UUID('2a1647e9-ab91-4cf3-b5b0-0480b034e4ab'), editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='secondary_guests',
            name='uid',
            field=models.UUIDField(default=uuid.UUID('2a1647e9-ab91-4cf3-b5b0-0480b034e4ab'), editable=False, primary_key=True, serialize=False),
        ),
    ]
