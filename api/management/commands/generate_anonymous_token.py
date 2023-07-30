# api/management/commands/generate_anonymous_token.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import RefreshToken

class Command(BaseCommand):
    help = 'Generate an API token for anonymous users'

    def handle(self, *args, **options):
        # Create a dummy user to associate with the token
        anonymous_user = AnonymousUser()
        token = RefreshToken.for_user(anonymous_user)
        access_token = str(token.access_token)
        self.stdout.write(self.style.SUCCESS(f'Generated token for anonymous users: {access_token}'))


