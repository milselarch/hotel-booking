from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator
from common.models import common_attribute_model
import uuid
from django_cryptography.fields import encrypt
from encrypted_fields import fields


class user_account_manager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password = None):
        if email == None:
            raise ValueError("Users must have an email address")
        if first_name == None:
            raise ValueError("Users must have a first name")
        if last_name == None:
            raise ValueError("Users must have a last name")
        if password == None:
            raise ValueError("Users must have a password")

        email = self.normalize_email(email)
        
        user = self.model(
            uid = uuid.uuid4(),
            email = email, 
            first_name = first_name,
            last_name = last_name
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, first_name, last_name, password = None):
        user = self.create_user(email, first_name, last_name, password)
        user.is_superuser = True
        user.save()

    def create_admin(self, email, first_name, last_name, password = None):
        user = self.create_user(email, first_name, last_name, password)
        user.is_staff = True
        user.save()


class user_account(AbstractBaseUser, PermissionsMixin, common_attribute_model):
    _email_data = fields.EncryptedEmailField()
    email = fields.SearchField(hash_key="b6b7029f69d04cc11f4d22a84e80d4bcab1249dbf981c58de64a69deb46e8b06", encrypted_field_name="_email_data", unique = True)
    

    first_name = encrypt(models.CharField(max_length=100, blank=True, null=True))
    last_name = encrypt(models.CharField(max_length=100, blank=True, null=True))
    is_active = models.BooleanField(default = True)
    is_staff = models.BooleanField(default = False)
    is_superuser = models.BooleanField(default = False)
    
    # ITU imposes a maximum length of 15 digits to telephone numbers
    phone = encrypt(models.CharField(max_length=15, blank=True, null=True))

    titles = (
        ('MR','Mr.'),
        ('MS', 'Ms.'),
        ('MRS', 'Mrs.'),
    )
    title = models.CharField(max_length=3, choices=titles, blank=True, null=True)
    phone_country = models.CharField(max_length=200, blank=True, null=True)
    # format in YYYY-MM-DD HH:MM
    datetime_created = models.DateTimeField(auto_now_add=True)

    objects = user_account_manager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_fullname(self):
        return self.first_name + " " + self.last_name

    def get_firstname(self):
        return self.first_name

    def get_lastname(self):
        return self.last_name

    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email




