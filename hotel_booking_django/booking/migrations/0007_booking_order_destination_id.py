# Generated by Django 4.0.5 on 2022-07-16 08:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0006_alter_booking_order_check_in_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking_order',
            name='destination_id',
            field=models.CharField(default='1', max_length=255),
            preserve_default=False,
        ),
    ]