from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from booking.models import Train, TrainCoach, Bus, Booking, Passenger
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample bookings for testing admin panel'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample bookings...')
        
        # Create sample users if they don't exist
        sample_users = [
            {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
            {'username': 'bob_wilson', 'email': 'bob@example.com', 'first_name': 'Bob', 'last_name': 'Wilson'},
        ]
        
        users = []
        for user_data in sample_users:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name']
                }
            )
            if created:
                user.set_password('password123')
                user.save()
            users.append(user)
        
        # Create sample train bookings
        trains = Train.objects.all()[:5]
        buses = Bus.objects.all()[:5]
        
        payment_statuses = ['completed', 'pending', 'completed', 'completed', 'pending']
        
        # Create train bookings
        for i in range(8):
            if trains:
                train = random.choice(trains)
                coach = random.choice(train.coaches.all())
                user = random.choice(users)
                
                booking = Booking.objects.create(
                    user=user,
                    booking_type='train',
                    train=train,
                    train_coach=coach,
                    journey_date=date.today() + timedelta(days=random.randint(1, 30)),
                    total_passengers=random.randint(1, 4),
                    total_amount=float(coach.price_per_seat) * random.randint(1, 4) + 50,
                    platform_fee=50,
                    payment_status=random.choice(payment_statuses)
                )
                
                # Create passengers
                passenger_names = ['Rahul Kumar', 'Priya Sharma', 'Amit Singh', 'Sunita Patel']
                for j in range(booking.total_passengers):
                    Passenger.objects.create(
                        booking=booking,
                        name=random.choice(passenger_names),
                        age=random.randint(18, 65),
                        gender=random.choice(['male', 'female']),
                        seat_number=f"{random.choice(['A', 'B', 'C'])}{random.randint(1, 72)}"
                    )
        
        # Create bus bookings
        for i in range(6):
            if buses:
                bus = random.choice(buses)
                user = random.choice(users)
                passengers_count = random.randint(1, 3)
                selected_seats = [f"A{j+1}" for j in range(passengers_count)]
                
                booking = Booking.objects.create(
                    user=user,
                    booking_type='bus',
                    bus=bus,
                    selected_seats=selected_seats,
                    journey_date=date.today() + timedelta(days=random.randint(1, 30)),
                    total_passengers=passengers_count,
                    total_amount=float(bus.price_per_seat) * passengers_count + 50,
                    platform_fee=50,
                    payment_status=random.choice(payment_statuses)
                )
                
                # Create passengers
                passenger_names = ['Arjun Mehta', 'Kavya Reddy', 'Vikram Joshi', 'Meera Gupta']
                for j, seat in enumerate(selected_seats):
                    Passenger.objects.create(
                        booking=booking,
                        name=random.choice(passenger_names),
                        age=random.randint(18, 65),
                        gender=random.choice(['male', 'female']),
                        seat_number=seat
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created sample bookings!')
        )