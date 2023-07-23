from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template.loader import render_to_string
# settings
from django.conf import settings
from bson import ObjectId
import uuid, datetime

my_db = settings.ATLAS_DB
article_collection = my_db['articles']
search_collection = my_db['search']
sitemaps_collection = my_db['sitemaps']

# Create your views here.
def home(request):
    return render(request, 'main/pages/home.html')


def search(request):
    return render(request, 'main/pages/search.html')


def article(request, url):
    sub_article_of = request.GET.get("sub", "")
    insurance_data = article_collection.find_one({"url": url, "basic.sub_article.id": sub_article_of})
    
    if insurance_data is not None:
        insurance_data['basic']['content_keywords'] = insurance_data['basic']['content_keywords'].split(", ")
        insurance_data['basic']['sidebar_keywords'] = insurance_data['basic']['sidebar_keywords'].split(", ")
        _article_ids = set()
        # Sub Article
        if insurance_data['basic']['sub_article']['id']:
            _article_ids.add(ObjectId(insurance_data['basic']['sub_article']['id']))
        # Previous Article
        if insurance_data['recommendation']['previous_article_id']:
            _article_ids.add(ObjectId(insurance_data['recommendation']['previous_article_id']))
        # Next Article
        if insurance_data['recommendation']['next_article_id']:
            _article_ids.add(ObjectId(insurance_data['recommendation']['next_article_id']))
        # Recommended Article
        if insurance_data['recommendation']['recommendation_article_id']:
            _article_ids.add(ObjectId(insurance_data['recommendation']['recommendation_article_id']))
        # Recommended Article
        if insurance_data['recommendation']['sub_article_id_1']:
            _article_ids.add(ObjectId(insurance_data['recommendation']['sub_article_id_1']))
        # Recommended Article
        if insurance_data['recommendation']['sub_article_id_2']:
            _article_ids.add(ObjectId(insurance_data['recommendation']['sub_article_id_2']))
        # Recommended Article
        if insurance_data['recommendation']['sub_article_id_3']:
            _article_ids.add(ObjectId(insurance_data['recommendation']['sub_article_id_3']))

        projection = {
            'name': 1,
            'url': 1,
            'basic': 1,
        }
        _other_article_data = article_collection.find({"_id": {"$in": list(_article_ids)}}, projection)
        _other_article_map = {str(_article['_id']): _article for _article in _other_article_data}
        
        for _article_id in _article_ids:
            # Sub Article   
            if insurance_data['basic']['sub_article']['id'] == str(_article_id):
                insurance_data['sub_article'] = _other_article_map.get(str(_article_id))

            # Previous Article
            if insurance_data['recommendation']['previous_article_id'] == str(_article_id):
                insurance_data['previous_article'] = _other_article_map.get(str(_article_id))

            # Next Article
            if insurance_data['recommendation']['next_article_id'] == str(_article_id):
                insurance_data['next_article'] = _other_article_map.get(str(_article_id))

            # Recommended Article
            if insurance_data['recommendation']['recommendation_article_id'] == str(_article_id):
                insurance_data['recommendation_article'] = _other_article_map.get(str(_article_id))

            # Sub Article 1
            if insurance_data['recommendation']['sub_article_id_1'] == str(_article_id):
                insurance_data['sub_article_1'] = _other_article_map.get(str(_article_id))

            # Sub Article 2
            if insurance_data['recommendation']['sub_article_id_2'] == str(_article_id):
                insurance_data['sub_article_2'] = _other_article_map.get(str(_article_id))

            # Sub Article 3
            if insurance_data['recommendation']['sub_article_id_3'] == str(_article_id):
                insurance_data['sub_article_3'] = _other_article_map.get(str(_article_id))
                
    data = {
        "insurance": insurance_data
    }
    return render(request, 'main/pages/article.html', data)


# Essentials
def terms_and_conditions(request):
    return render(request, 'main/pages/terms-and-conditions.html')


def privacy_policy(request):
    return render(request, 'main/pages/privacy-policy.html')


def disclaimer(request):
    return render(request, 'main/pages/disclaimer.html')


def ads_file(request):
    return render(request, 'main/pages/ads.txt')


def sitemap_view(request):
    urls = sitemaps_collection.find()
    context = {'urls': urls}
    xml_content = render_to_string('main/pages/sitemap.xml', context)
    return HttpResponse(xml_content, content_type='application/xml')