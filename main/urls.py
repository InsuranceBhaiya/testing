from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.home, name='Home'),
    path('search/', views.search, name='Search'),
    path('article/<str:url>', views.article, name='Article'),
    # Essentials
    path('terms-and-conditions/', views.terms_and_conditions, name='TermsAndConditions'),
    path('privacy-policy/', views.privacy_policy, name='PrivacyPolicy'),
    path('disclaimer/', views.disclaimer, name='Disclaimer'),
    path('ads.txt', views.ads_file, name='adsFile'),
    path('sitemap.xml', views.sitemap_view, name='sitemap'),
    path('googlecc1a0711e704e752', views.googlecc1a0711e704e752, name='sitemap'),
]  