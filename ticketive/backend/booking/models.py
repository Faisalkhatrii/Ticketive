from django.db import models
from django.contrib.auth import get_user_model
import random
import string

User = get_user_model()

class Train(models.Model):
    COACH_CHOICES = [
        ('sleeper', 'Sleeper Class'),
        ('3a', '3A Tier AC Coach'),
        ('2a', '2nd Tier AC Coach'),
        ('1a', '1st Tier AC Coach'),
    ]
    
    train_number = models.CharField(max_length=5, unique=True)
    train_name = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    travel_duration = models.DurationField()
    
    def __str__(self):
        return f"{self.train_name} ({self.train_number})"
    
    def save(self, *args, **kwargs):
        if not self.train_number:
            self.train_number = ''.join(random.choices(string.digits, k=5))
        super().save(*args, **kwargs)

class TrainCoach(models.Model):
    train = models.ForeignKey(Train, on_delete=models.CASCADE, related_name='coaches')
    coach_type = models.CharField(max_length=20, choices=Train.COACH_CHOICES)
    total_seats = models.IntegerField(default=72)
    available_seats = models.IntegerField(default=72)
    price_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.train.train_name} - {self.get_coach_type_display()}"

class Bus(models.Model):
    bus_name = models.CharField(max_length=100)
    bus_number = models.CharField(max_length=20, unique=True)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    travel_duration = models.DurationField()
    total_seats = models.IntegerField(default=40)
    available_seats = models.IntegerField(default=40)
    price_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.bus_name} ({self.bus_number})"

class BusSeat(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=5)
    is_booked = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.bus.bus_name} - Seat {self.seat_number}"

class Booking(models.Model):
    BOOKING_TYPE_CHOICES = [
        ('train', 'Train'),
        ('bus', 'Bus'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_type = models.CharField(max_length=10, choices=BOOKING_TYPE_CHOICES)
    booking_id = models.CharField(max_length=20, unique=True)
    
    # Train booking fields
    train = models.ForeignKey(Train, on_delete=models.CASCADE, null=True, blank=True)
    train_coach = models.ForeignKey(TrainCoach, on_delete=models.CASCADE, null=True, blank=True)
    
    # Bus booking fields
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, null=True, blank=True)
    selected_seats = models.JSONField(default=list, blank=True)
    
    # Common fields
    journey_date = models.DateField()
    total_passengers = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_screenshot = models.ImageField(upload_to='payment_screenshots/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Booking {self.booking_id} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        if not self.booking_id:
            self.booking_id = 'TKT' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        super().save(*args, **kwargs)

class Passenger(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='passengers')
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    seat_number = models.CharField(max_length=10, blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} - {self.booking.booking_id}"
