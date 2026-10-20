from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import BoardSettings


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_board_settings(sender, instance, created, raw, **kwargs):
    if created and not raw:
        BoardSettings.objects.create(user=instance)
