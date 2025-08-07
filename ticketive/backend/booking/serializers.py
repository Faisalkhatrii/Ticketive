from rest_framework import serializers
from .models import Train, TrainCoach, Bus, BusSeat, Booking, Passenger

class TrainCoachSerializer(serializers.ModelSerializer):
    coach_type_display = serializers.CharField(source='get_coach_type_display', read_only=True)
    
    class Meta:
        model = TrainCoach
        fields = ['id', 'coach_type', 'coach_type_display', 'total_seats', 'available_seats', 'price_per_seat']

class TrainSerializer(serializers.ModelSerializer):
    coaches = TrainCoachSerializer(many=True, read_only=True)
    
    class Meta:
        model = Train
        fields = ['id', 'train_number', 'train_name', 'source', 'destination', 
                 'departure_time', 'arrival_time', 'travel_duration', 'coaches']

class BusSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusSeat
        fields = ['id', 'seat_number', 'is_booked']

class BusSerializer(serializers.ModelSerializer):
    seats = BusSeatSerializer(many=True, read_only=True)
    
    class Meta:
        model = Bus
        fields = ['id', 'bus_name', 'bus_number', 'source', 'destination',
                 'departure_time', 'arrival_time', 'travel_duration', 
                 'total_seats', 'available_seats', 'price_per_seat', 'seats']

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = ['id', 'name', 'age', 'gender', 'seat_number']

class BookingSerializer(serializers.ModelSerializer):
    passengers = PassengerSerializer(many=True, read_only=True)
    train_details = TrainSerializer(source='train', read_only=True)
    bus_details = BusSerializer(source='bus', read_only=True)
    coach_details = TrainCoachSerializer(source='train_coach', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'booking_id', 'booking_type', 'journey_date', 'total_passengers',
                 'total_amount', 'platform_fee', 'payment_status', 'created_at',
                 'train_details', 'bus_details', 'coach_details', 'selected_seats', 'passengers']

class BookingCreateSerializer(serializers.ModelSerializer):
    passengers_data = PassengerSerializer(many=True, write_only=True)
    
    class Meta:
        model = Booking
        fields = ['booking_type', 'train', 'train_coach', 'bus', 'selected_seats',
                 'journey_date', 'total_passengers', 'total_amount', 'passengers_data']
    
    def create(self, validated_data):
        passengers_data = validated_data.pop('passengers_data')
        booking = Booking.objects.create(**validated_data)
        
        for passenger_data in passengers_data:
            Passenger.objects.create(booking=booking, **passenger_data)
        
        return booking

class TrainSearchSerializer(serializers.Serializer):
    source = serializers.CharField(max_length=100)
    destination = serializers.CharField(max_length=100)
    date = serializers.DateField()

class BusSearchSerializer(serializers.Serializer):
    source = serializers.CharField(max_length=100)
    destination = serializers.CharField(max_length=100)
    date = serializers.DateField()