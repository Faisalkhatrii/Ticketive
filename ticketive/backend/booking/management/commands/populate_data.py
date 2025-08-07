from django.core.management.base import BaseCommand
from booking.models import Train, TrainCoach, Bus
from datetime import time, timedelta, datetime
import random

class Command(BaseCommand):
    help = 'Populate sample data for trains and buses'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample trains and buses...')
        
        # Sample cities
        cities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
            'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
        ]
        
        # Sample train names
        train_names = [
            'Rajdhani Express', 'Shatabdi Express', 'Duronto Express',
            'Garib Rath', 'Jan Shatabdi', 'Superfast Express',
            'Mail Express', 'Passenger Train', 'Intercity Express',
            'Vande Bharat Express'
        ]
        
        # Sample bus names
        bus_names = [
            'Volvo Multi-Axle', 'Mercedes Luxury', 'Scania AC Sleeper',
            'Ashok Leyland Sleeper', 'Tata Starbus', 'Bharat Benz',
            'VRL Travels', 'SRS Travels', 'Orange Travels', 'Redbus Express'
        ]
        
        # Create trains
        for i in range(10):
            source = random.choice(cities)
            destination = random.choice([city for city in cities if city != source])
            
            departure_hour = random.randint(6, 22)
            departure_time = time(departure_hour, random.choice([0, 15, 30, 45]))
            
            travel_hours = random.randint(4, 24)
            travel_duration = timedelta(hours=travel_hours, minutes=random.choice([0, 15, 30, 45]))
            
            arrival_time = (datetime.combine(datetime.today(), departure_time) + travel_duration).time()
            
            train = Train.objects.create(
                train_name=random.choice(train_names),
                source=source,
                destination=destination,
                departure_time=departure_time,
                arrival_time=arrival_time,
                travel_duration=travel_duration
            )
            
            # Create coaches for each train (minimum 3)
            coach_types = ['sleeper', '3a', '2a', '1a']
            num_coaches = random.randint(3, 4)
            selected_coaches = random.sample(coach_types, num_coaches)
            
            for coach_type in selected_coaches:
                base_price = {'sleeper': 500, '3a': 1200, '2a': 2000, '1a': 3500}
                price = base_price[coach_type] + random.randint(-100, 300)
                available_seats = random.randint(20, 72)
                
                TrainCoach.objects.create(
                    train=train,
                    coach_type=coach_type,
                    total_seats=72,
                    available_seats=available_seats,
                    price_per_seat=price
                )
        
        # Create buses
        for i in range(15):
            source = random.choice(cities)
            destination = random.choice([city for city in cities if city != source])
            
            departure_hour = random.randint(6, 23)
            departure_time = time(departure_hour, random.choice([0, 15, 30, 45]))
            
            travel_hours = random.randint(2, 12)
            travel_duration = timedelta(hours=travel_hours, minutes=random.choice([0, 15, 30, 45]))
            
            arrival_time = (datetime.combine(datetime.today(), departure_time) + travel_duration).time()
            
            available_seats = random.randint(15, 35)  # Some seats already booked
            price = random.randint(300, 1500)
            
            Bus.objects.create(
                bus_name=random.choice(bus_names),
                bus_number=f'KA{random.randint(10, 99)}-{random.randint(1000, 9999)}',
                source=source,
                destination=destination,
                departure_time=departure_time,
                arrival_time=arrival_time,
                travel_duration=travel_duration,
                total_seats=40,
                available_seats=available_seats,
                price_per_seat=price
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {Train.objects.count()} trains and {Bus.objects.count()} buses')
        )