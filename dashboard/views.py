from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from bson.objectid import ObjectId
from django.http import JsonResponse
import json
from datetime import datetime
# settings
from django.conf import settings

my_db = settings.ATLAS_DB
article_collection = my_db['articles']
search_collection = my_db['search']
sitemaps_collection = my_db['sitemaps']

# Create your views here.
@login_required(login_url='auth:Login')
def home(request):
    # Add new insurance
    if request.method == "POST" and "add_insurance" in request.POST:
        name = request.POST.get("name", "")
        _data = {
            "name": name, 
            "published_on": datetime.now()
        }
        article_collection.insert_one(_data)
        if article_collection.find_one(_data):
            messages.success(request, "Insurance added successfully.")
        else:
            messages.error(request, "Error occurred while adding Insurance.")
        return redirect('dashboard:Home') 
    
    # Delete Insurance
    if request.method == "POST" and "delete_insurance" in request.POST:
        id = request.POST.get("insurance_id", None)
        if id is not None:
            article_collection.delete_one({"_id": ObjectId(id)})
            if article_collection.find_one({"_id": ObjectId(id)}):
                messages.error(request, "Error occurred while deleting Insurance.")
            else:
                messages.success(request, "Insurance deleted successfully.")
        return redirect('dashboard:Home')  

    insurances_data = article_collection.find({}, projection = {'name': 1})
    insurances = []
    for _ in insurances_data:
        _["id"] = str(_['_id'])
        del _["_id"]
        insurances.append(_)

    data = {
        "insurances": insurances
    }
    return render(request, 'dashboard/pages/home.html', data)


@login_required(login_url='auth:Login')
def search_view(request):
    return render(request, 'dashboard/pages/search.html')


@login_required(login_url='auth:Login')
def article_view(request, id):
    if request.method == "POST" and "update" in request.POST:
        data_block = json.loads(request.POST.get("data", {}))
        data_block['last_updated_on'] = datetime.now()

        article_collection.update_one({"_id": ObjectId(id)}, {"$set": data_block})
        if article_collection.find_one(data_block):
            response = {"msg": "Insurance updated successfully.", "ok": True}
        else:
            response = {"msg": "Error occurred while updating Insurance.", "ok": False}
        return JsonResponse(response, safe=True)
        
    insurance_data = article_collection.find_one({"_id": ObjectId(id)})
    insurance_data['id'] = str(insurance_data['_id'])
    del insurance_data['_id']
    data = {"insurance": insurance_data}
    return render(request, 'dashboard/pages/article.html', data)


@login_required(login_url='auth:Login')
def sitemap_view(request):
    sitemapUrls = sitemaps_collection.find()
    sitemap_urls = [sitemap for sitemap in sitemapUrls]
    if request.method == "POST" and "add_url" in request.POST:
        location = request.POST.get('location', '')
        priority = request.POST.get('priority', '')
        lastmod = request.POST.get('lastmod', '')
        changefreq = "monthly"

        url_data = {
            "location": location,
            "priority": priority,
            "lastmod": lastmod,
            "changefreq": changefreq
        }

        url_exists = any(url['location'] == location for url in sitemap_urls)
        if url_exists:
            messages.error(request, "URL already exists.")
        else:
            sitemaps_collection.insert_one(url_data)
            if sitemaps_collection.find_one(url_data):
                messages.success(request, "URL added successfully.")
            else:
                messages.error(request, "Error occurred while adding URL.")

        return redirect('dashboard:Sitemap')  

    data = {
        "sitemaps": sitemap_urls
    }
    return render(request, 'dashboard/pages/sitemap.html', data)


def test_view(request):
    return render(request, "dashboard/pages/test.html")