from django.urls import path
from .views import pending_view

urlpatterns = [
    path('pending', pending_view, name="pending"),
]