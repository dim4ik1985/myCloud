from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, login, email,  password,  **extra_fields):
        if not login:
            raise ValueError("Login is a required field")
        if not email:
            raise ValueError("Email is a required field")

        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(login=login, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        user = self.create_user(
            login=login,
            email=self.normalize_email(email),
            password=password,
            **extra_fields
        )

        user.save(using=self._db)
        return
