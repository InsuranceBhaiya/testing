from django import template
from django.contrib.auth.models import Group
from datetime import datetime

register = template.Library()

@register.filter(name='has_group')
def has_group(user, group_name):
    try:
        group =  Group.objects.get(name=group_name)
    except Group.DoesNotExist:
        return False

    return group in user.groups.all()

@register.filter(name='date_strftime')
def date_strftime(date, format):
    date = datetime.strptime(date, "%Y-%m-%d")
    return date.strftime(format)