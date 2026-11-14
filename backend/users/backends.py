from typing import Any

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.base_user import AbstractBaseUser
from django.db.models import Q
from django.http import HttpRequest
from .models import User

class LoginBackend(ModelBackend):
    def authenticate(self, request: HttpRequest | None, username: str | None = None, password: str | None = None, **kwargs: Any) -> AbstractBaseUser | None:
        if not username or not password:
            return None
        user = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).first()
        
        if not user or not self.user_can_authenticate(user):
            User().set_password(password)
            return None

        if not user.check_password(password):
            return None
        
        return user
        

    
