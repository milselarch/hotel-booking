from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator
from common.models import common_attribute_model, country_code, country_currency

class user_account_manager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password = None):
        if email == None:
            raise ValueError("Users must have an email address")
        if first_name == None:
            raise ValueError("Users must have a name")
        if password == None:
            raise ValueError("Users must have a password")

        email = self.normalize_email(email)

        user = self.model(
            email = email, 
            first_name = first_name,
            last_name = last_name,
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, first_name, last_name, password = None):
        user = self.create_user
        user.is_superuser = True
        user.save()

class user_account(AbstractBaseUser, PermissionsMixin, common_attribute_model):
    email = models.EmailField(max_length=100, unique = True)
    #name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default = True)
    is_staff = models.BooleanField(default = False)
    is_superuser = models.BooleanField(default = False)
    
    phone = models.PositiveIntegerField(validators=[MinValueValidator(10000000),MaxValueValidator(999999999999999)], blank=True, null=True)
    titles = (
        ('MR','Mr.'),
        ('MS', 'Ms.'),
        ('MRS', 'Mrs.'),
    )
    title = models.CharField(max_length=3, choices=titles, blank=True, null=True)
    phone_country = models.ForeignKey(country_code, on_delete=models.PROTECT, blank=True, null=True)
    display_currency_preference = models.ForeignKey(country_currency, on_delete=models.PROTECT, blank=True, null=True)
    # format in YYYY-MM-DD HH:MM
    datetime_created = models.DateTimeField(auto_now_add=True)

    objects = user_account_manager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', "last_name"]

    def get_fullname(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email




