from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

# Login
def login_view(request):
    redirecting_url = request.GET.get("next", None)
    if request.user.is_authenticated:
        _url = redirecting_url if redirecting_url is not None else 'dashboard:Home'
        return redirect(_url)

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            _url = redirecting_url if redirecting_url is not None else 'dashboard:Home'
            return redirect(_url)
        else:
            return render(request, 'authenticator/login.html', {'Error': 'Invalid Username or Password', 'username': username, 'password': password})
    return render(request, 'authenticator/login.html')


# Logout
@login_required(login_url='auth:Login')
def logout_view(request):
    logout(request)
    return redirect('auth:Login')
