from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('', views.all_apis, name='Allapi'),
    path('search_article/', views.search_article, name='SearchArticle'),
    path('search_keywords/', views.search_keywords, name='SearchKeywords'),
]  