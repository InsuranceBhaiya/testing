# search_api/authentication.py
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import APIKey

class QueryParamAuthentication(BaseAuthentication):
    def authenticate(self, request):
        api_key = request.GET.get('api_key')
        if not api_key:
            return None

        try:
            api_key_obj = APIKey.objects.get(key=api_key)
        except APIKey.DoesNotExist:
            raise AuthenticationFailed('Invalid API key.')

        return (api_key_obj.user, None)
