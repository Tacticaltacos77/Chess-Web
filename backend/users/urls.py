from django.urls import path
from django.contrib.auth.views import LoginView
from .views import RegisterView
from .forms import LoginForm

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(template_name="users/login.html", authentication_form=LoginForm, redirect_authenticated_user=True), name="login")
]