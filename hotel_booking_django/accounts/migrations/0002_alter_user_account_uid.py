# Generated by Django 4.0.5 on 2022-07-02 13:25

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_account',
            name='uid',
            field=models.UUIDField(default=uuid.UUID('062c9e4f-8ea3-4c1d-992b-7ee2e3c017a6'), editable=False, primary_key=True, serialize=False),
        ),
    ]
