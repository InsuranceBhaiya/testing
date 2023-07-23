from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.home, name='Home'),
    path('search/', views.search_view, name='Search'),
    path('article/<str:id>', views.article_view, name='Article'),
    path('sitemap/', views.sitemap_view, name='Sitemap'),
    path('test/', views.test_view, name='Test'),
]  