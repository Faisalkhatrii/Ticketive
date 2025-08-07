from django.urls import path
from . import views

urlpatterns = [
    path('search-trains/', views.search_trains, name='search_trains'),
    path('search-buses/', views.search_buses, name='search_buses'),
    path('bus-seats/<int:bus_id>/', views.get_bus_seats, name='get_bus_seats'),
    path('create-booking/', views.create_booking, name='create_booking'),
    path('upload-payment/<str:booking_id>/', views.upload_payment_screenshot, name='upload_payment'),
    path('my-bookings/', views.get_user_bookings, name='get_user_bookings'),
    path('booking/<str:booking_id>/', views.get_booking_details, name='get_booking_details'),
]