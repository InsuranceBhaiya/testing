from django.shortcuts import redirect

def has_permission(permissions):
    groups = permissions
    def _method_wrapper(view_method):
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect("auth:Login")

            if request.user.is_anonymous:
                return redirect("auth:Login")
            
            permissions = groups.replace(" ", ",").split(",")
            
            for group in permissions: 
                if request.user.groups.filter(name=group).exists():
                    return view_method(request, *args, **kwargs)

            if request.user.groups.filter(name="staff").exists() or request.user.groups.filter(name="admin").exists():
                return redirect("main:Home")
            else: 
                return redirect("auth:Login")

        return _wrapped_view
    return _method_wrapper


def is_not_member(groupname):
    def _method_wrapper(view_method):
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect("auth:Login")

            if request.user.is_anonymous:
                return redirect("auth:Login")

            if request.user.groups.filter(name=groupname).exists(): 
                return redirect("auth:Login")
            else :
                return view_method(request, *args, **kwargs)

        return _wrapped_view
    return _method_wrapper
    