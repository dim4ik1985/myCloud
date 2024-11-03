import os
import hashlib
import secrets

from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager

def generate_file_link(file: str, user_id: int) -> str:
    """
    Generate a file link by hashing the file ID and a secret key.

    Args:
        file_id (int): The ID of the file.

    Returns:
        str: The generated file link.
        :param user_id: The ID of the user.
        :param file: The ID of the file.
    """

    secret_key = secrets.token_hex(16)
    file_hash = hashlib.sha256(f"{file}{secret_key}".encode()).hexdigest()
    # The link is not a real URL, it's just a placeholder for the real URL
    # that will be used in the frontend.
    return f"http://127.0.0.1:8000/{settings.MEDIA_ROOT}/{file_hash}"

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class CustomUser(AbstractUser):
    login = models.CharField(max_length=100, unique=True)
    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(max_length=200, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['username', 'email']

    def __str__(self):
        return self.login



class File(models.Model):
    file = models.FileField(upload_to=user_directory_path)
    name = models.CharField(max_length=500, null=True, blank=True)
    commentary = models.TextField(null=True, blank=False)
    size = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_download_at = models.DateTimeField(blank=True, null=True)
    file_link = models.CharField(max_length=255, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='users_files')

    def save(
        self,
        *args,
        **kwargs
    ):
        self.file_link = generate_file_link(self.file.name, self.user.id)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.login









