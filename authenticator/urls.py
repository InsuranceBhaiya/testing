from django.urls import path
from . import views

app_name = 'auth'

urlpatterns = [
    # NORMAL USER
    path('login/', views.login_view, name='Login'),
    # LOGOUT
    path('logout/', views.logout_view, name='Logout'),
]  