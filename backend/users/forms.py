from django import forms 
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate
from .models import User

class RegisterForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs["placeholder"] = "Pick a username"
        self.fields["email"].widget.attrs["placeholder"] = "you@example.com"
        self.fields["password1"].widget.attrs["placeholder"] = "Password"
        self.fields["password2"].widget.attrs["placeholder"] = "Confirm"

class LoginForm(forms.Form):
    account = forms.CharField(
        max_length=User._meta.get_field("email").max_length,
        widget=forms.TextInput(attrs={
            "placeholder": "Username or email",
            "autocomplete": "username",
            "autocapitalize": "none",
            "autofocus": True,
        }),
    )
    password = forms.CharField(
        max_length=64,
        strip=False,
        widget=forms.PasswordInput(attrs={
            "placeholder": "Password",
            "autocomplete": "current-password",
        }),
    )

    def __init__(self, request=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = request
        self.user = None

    def clean(self):
        cleaned = super().clean()
        account = cleaned.get("account")
        password = cleaned.get("password")
        if account and password:
            self.user = authenticate(self.request, username=account, password=password)
            if self.user is None:
                raise forms.ValidationError("Incorrect account or password")
        return cleaned

    # LoginView calls this after is_valid() to know who to log in
    def get_user(self):
        return self.user


