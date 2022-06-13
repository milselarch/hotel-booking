from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password = None):
        if email == None:
            raise ValueError("Users must have an email address")
        if name == None:
            raise ValueError("Users must have a name")
        if password == None:
            raise ValueError("Users must have a password")

        email = self.normalize_email(email)

        user = self.model(
            email = email, 
            name = name
        )

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, name, password = None):
        user = self.create_user
        user.is_superuser = True
        user.save()
        

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique = True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default = True)
    is_staff = models.BooleanField(default = False)
    is_superuser = models.BooleanField(default = False)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['name']

    def get_fullname(self):
        return self.name

    def get_short_name(self):
        return self.name
    
    def __str__(self):
        return self.email

