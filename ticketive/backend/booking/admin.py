from django.contrib import admin
from .models import Train, TrainCoach, Bus, BusSeat, Booking, Passenger

class TrainCoachInline(admin.TabularInline):
    model = TrainCoach
    extra = 1

@admin.register(Train)
class TrainAdmin(admin.ModelAdmin):
    list_display = ('train_name', 'train_number', 'source', 'destination', 'departure_time')
    list_filter = ('source', 'destination')
    search_fields = ('train_name', 'train_number', 'source', 'destination')
    inlines = [TrainCoachInline]

@admin.register(TrainCoach)
class TrainCoachAdmin(admin.ModelAdmin):
    list_display = ('train', 'coach_type', 'total_seats', 'available_seats', 'price_per_seat')
    list_filter = ('coach_type',)

class BusSeatInline(admin.TabularInline):
    model = BusSeat
    extra = 0

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'bus_number', 'source', 'destination', 'departure_time', 'available_seats')
    list_filter = ('source', 'destination')
    search_fields = ('bus_name', 'bus_number', 'source', 'destination')
    inlines = [BusSeatInline]

@admin.register(BusSeat)
class BusSeatAdmin(admin.ModelAdmin):
    list_display = ('bus', 'seat_number', 'is_booked')
    list_filter = ('is_booked',)

class PassengerInline(admin.TabularInline):
    model = Passenger
    extra = 1

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'user', 'booking_type', 'journey_date', 'payment_status', 'total_amount')
    list_filter = ('booking_type', 'payment_status', 'journey_date')
    search_fields = ('booking_id', 'user__username')
    readonly_fields = ('booking_id', 'created_at', 'updated_at')
    inlines = [PassengerInline]

@admin.register(Passenger)
class PassengerAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'gender', 'booking', 'seat_number')
    list_filter = ('gender', 'booking__booking_type')
