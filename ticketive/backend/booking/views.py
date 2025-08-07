from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Train, TrainCoach, Bus, BusSeat, Booking
from .serializers import (TrainSerializer, BusSerializer, BookingSerializer, 
                         BookingCreateSerializer, TrainSearchSerializer, BusSearchSerializer)
import random
from datetime import timedelta

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def search_trains(request):
    serializer = TrainSearchSerializer(data=request.data)
    if serializer.is_valid():
        source = serializer.validated_data['source']
        destination = serializer.validated_data['destination']
        
        # Search for trains (case-insensitive)
        trains = Train.objects.filter(
            Q(source__icontains=source) & Q(destination__icontains=destination)
        )
        
        # If no exact matches, return sample trains for demo
        if not trains.exists():
            trains = Train.objects.all()[:5]
        
        serializer = TrainSerializer(trains, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def search_buses(request):
    serializer = BusSearchSerializer(data=request.data)
    if serializer.is_valid():
        source = serializer.validated_data['source']
        destination = serializer.validated_data['destination']
        
        # Search for buses (case-insensitive)
        buses = Bus.objects.filter(
            Q(source__icontains=source) & Q(destination__icontains=destination)
        )
        
        # If no exact matches, return sample buses for demo
        if not buses.exists():
            buses = Bus.objects.all()[:6]
        
        serializer = BusSerializer(buses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_bus_seats(request, bus_id):
    try:
        bus = Bus.objects.get(id=bus_id)
        seats = bus.seats.all()
        
        # If no seats exist, create them
        if not seats.exists():
            for i in range(1, 41):  # 40 seats
                seat_number = f"A{i}" if i <= 20 else f"B{i-20}"
                is_booked = random.choice([True, False]) if random.random() < 0.3 else False  # 30% chance of being booked
                BusSeat.objects.create(bus=bus, seat_number=seat_number, is_booked=is_booked)
        
        seats = bus.seats.all()
        from .serializers import BusSeatSerializer
        serializer = BusSeatSerializer(seats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Bus.DoesNotExist:
        return Response({'error': 'Bus not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_booking(request):
    serializer = BookingCreateSerializer(data=request.data)
    if serializer.is_valid():
        booking = serializer.save(user=request.user)
        response_serializer = BookingSerializer(booking)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_payment_screenshot(request, booking_id):
    try:
        booking = Booking.objects.get(booking_id=booking_id, user=request.user)
        
        if 'payment_screenshot' in request.FILES:
            booking.payment_screenshot = request.FILES['payment_screenshot']
            booking.payment_status = 'completed'  # Simulate payment verification
            booking.save()
            
            return Response({
                'message': 'Payment screenshot uploaded successfully',
                'payment_status': booking.payment_status
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'No screenshot provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_booking_details(request, booking_id):
    try:
        booking = Booking.objects.get(booking_id=booking_id, user=request.user)
        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
