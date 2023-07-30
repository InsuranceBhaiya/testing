from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.http import JsonResponse 
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# settings
from django.conf import settings
import random


my_db = settings.ATLAS_DB
article_collection = my_db['articles']

# Create your views here.
@api_view(['GET'])
# @authentication_classes([JWTAuthentication])  # Add JWTAuthentication class for token-based authentication
# @permission_classes([IsAuthenticated])  # Require authentication for this view
def search_article(request):
    query = request.GET.get('q', None)
    if query is not None:
        query_filter = {
            "$or": [
                {"name": {'$regex': query, '$options': 'i'}},
                {"search_keywords": {'$regex': query, '$options': 'i'}},
            ]
        }
    else:
        query_filter = {}

    projection = {
        'name': 1,
        'url': 1,
        'thumbnail': 1,
        'basic.sub_article': 1,
        'basic.short_description': 1,
        'search_keywords': 1
    }
    # Search for documents with "title" field matching the query
    search_results = article_collection.find(query_filter, projection)
    data = []
    for result in search_results:
        result['id'] = str(result['_id'])
        del result['_id']
        if "url" in result.keys() and "search_keywords" in result.keys():
            if len(result['search_keywords']) > 2:
                random.shuffle(result['search_keywords'])
                result['search_keywords'] = result['search_keywords'][:2]
            result['url'] = f"{result['url']}?sub={result['basic']['sub_article']['id']}" if result['basic']['sub_article']['is_sub_article'] else result['url']
            data.append(result)

    if query is not None:
        random.shuffle(data)
        data = data[:10]
    else:
        random.shuffle(data)
        if len(data) > 20:
            data = data[:20]
    return JsonResponse(data, safe=False)


@api_view(['GET'])
def search_keywords(request):
    projection = {'search_keywords': 1}
    # Search for documents with "title" field matching the query
    search_results = article_collection.find({}, projection)
    data = set()
    for result in search_results:
        del result['_id']
        if "search_keywords" in result.keys():
            data.update(result['search_keywords'])
    data = list(data)
    random.shuffle(data)
    return JsonResponse(data, safe=False)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])  # Add JWTAuthentication class for token-based authentication
@permission_classes([IsAuthenticated]) 
def all_apis(request):
    pass