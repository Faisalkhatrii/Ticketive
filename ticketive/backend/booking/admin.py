from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Train, TrainCoach, Bus, BusSeat, Booking, Passenger

# Custom Admin Site Configuration
admin.site.site_header = "Ticketive Admin Dashboard"
admin.site.site_title = "Ticketive Admin"
admin.site.index_title = "Welcome to Ticketive Administration"

class TrainCoachInline(admin.TabularInline):
    model = TrainCoach
    extra = 1
    fields = ('coach_type', 'total_seats', 'available_seats', 'price_per_seat')
    readonly_fields = ('available_seats',)

@admin.register(Train)
class TrainAdmin(admin.ModelAdmin):
    list_display = ('train_name', 'train_number', 'route_display', 'departure_time', 'arrival_time', 'coach_count', 'total_revenue')
    list_filter = ('source', 'destination', 'departure_time')
    search_fields = ('train_name', 'train_number', 'source', 'destination')
    inlines = [TrainCoachInline]
    list_per_page = 20
    
    def route_display(self, obj):
        return format_html(
            '<span style="color: #007bff;"><strong>{}</strong> → <strong>{}</strong></span>',
            obj.source, obj.destination
        )
    route_display.short_description = 'Route'
    
    def coach_count(self, obj):
        return obj.coaches.count()
    coach_count.short_description = 'Coaches'
    
    def total_revenue(self, obj):
        bookings = Booking.objects.filter(train=obj, payment_status='completed')
        total = sum(booking.total_amount for booking in bookings)
        return f"₹{total:,.2f}"
    total_revenue.short_description = 'Revenue'

@admin.register(TrainCoach)
class TrainCoachAdmin(admin.ModelAdmin):
    list_display = ('train', 'coach_type_display', 'occupancy_display', 'price_per_seat', 'revenue')
    list_filter = ('coach_type', 'train__source', 'train__destination')
    search_fields = ('train__train_name', 'train__train_number')
    
    def coach_type_display(self, obj):
        colors = {
            'sleeper': '#28a745',
            '3a': '#007bff', 
            '2a': '#ffc107',
            '1a': '#dc3545'
        }
        color = colors.get(obj.coach_type, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_coach_type_display()
        )
    coach_type_display.short_description = 'Coach Type'
    
    def occupancy_display(self, obj):
        occupied = obj.total_seats - obj.available_seats
        percentage = (occupied / obj.total_seats) * 100 if obj.total_seats > 0 else 0
        color = '#dc3545' if percentage > 80 else '#ffc107' if percentage > 50 else '#28a745'
        return format_html(
            '<span style="color: {};">{}/{} ({:.1f}%)</span>',
            color, occupied, obj.total_seats, percentage
        )
    occupancy_display.short_description = 'Occupancy'
    
    def revenue(self, obj):
        bookings = Booking.objects.filter(train_coach=obj, payment_status='completed')
        total = sum(booking.total_amount for booking in bookings)
        return f"₹{total:,.2f}"
    revenue.short_description = 'Revenue'

class BusSeatInline(admin.TabularInline):
    model = BusSeat
    extra = 0
    readonly_fields = ('seat_number',)
    fields = ('seat_number', 'is_booked')

@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'bus_number', 'route_display', 'departure_time', 'seat_availability', 'price_per_seat', 'total_revenue')
    list_filter = ('source', 'destination', 'departure_time')
    search_fields = ('bus_name', 'bus_number', 'source', 'destination')
    inlines = [BusSeatInline]
    list_per_page = 20
    
    def route_display(self, obj):
        return format_html(
            '<span style="color: #28a745;"><strong>{}</strong> → <strong>{}</strong></span>',
            obj.source, obj.destination
        )
    route_display.short_description = 'Route'
    
    def seat_availability(self, obj):
        occupied = obj.total_seats - obj.available_seats
        percentage = (occupied / obj.total_seats) * 100 if obj.total_seats > 0 else 0
        color = '#dc3545' if percentage > 80 else '#ffc107' if percentage > 50 else '#28a745'
        return format_html(
            '<span style="color: {};">{}/{} ({:.1f}%)</span>',
            color, occupied, obj.total_seats, percentage
        )
    seat_availability.short_description = 'Seat Availability'
    
    def total_revenue(self, obj):
        bookings = Booking.objects.filter(bus=obj, payment_status='completed')
        total = sum(booking.total_amount for booking in bookings)
        return f"₹{total:,.2f}"
    total_revenue.short_description = 'Revenue'

@admin.register(BusSeat)
class BusSeatAdmin(admin.ModelAdmin):
    list_display = ('bus', 'seat_number', 'booking_status')
    list_filter = ('is_booked', 'bus__source', 'bus__destination')
    search_fields = ('bus__bus_name', 'seat_number')
    
    def booking_status(self, obj):
        if obj.is_booked:
            return format_html('<span style="color: #dc3545; font-weight: bold;">BOOKED</span>')
        return format_html('<span style="color: #28a745; font-weight: bold;">AVAILABLE</span>')
    booking_status.short_description = 'Status'

class PassengerInline(admin.TabularInline):
    model = Passenger
    extra = 0
    readonly_fields = ('name', 'age', 'gender', 'seat_number')
    can_delete = False

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'user_info', 'booking_type_display', 'journey_date', 'passengers_count', 'payment_status_display', 'total_amount', 'created_at')
    list_filter = ('booking_type', 'payment_status', 'journey_date', 'created_at')
    search_fields = ('booking_id', 'user__username', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('booking_id', 'created_at', 'updated_at', 'payment_screenshot_preview')
    date_hierarchy = 'created_at'
    inlines = [PassengerInline]
    list_per_page = 25
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_id', 'user', 'booking_type', 'journey_date', 'total_passengers')
        }),
        ('Travel Details', {
            'fields': ('train', 'train_coach', 'bus', 'selected_seats')
        }),
        ('Payment Information', {
            'fields': ('total_amount', 'platform_fee', 'payment_status', 'payment_screenshot', 'payment_screenshot_preview')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def user_info(self, obj):
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.user.get_full_name() or obj.user.username,
            obj.user.email
        )
    user_info.short_description = 'User'
    
    def booking_type_display(self, obj):
        colors = {'train': '#007bff', 'bus': '#28a745'}
        color = colors.get(obj.booking_type, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.booking_type.upper()
        )
    booking_type_display.short_description = 'Type'
    
    def passengers_count(self, obj):
        return obj.passengers.count()
    passengers_count.short_description = 'Passengers'
    
    def payment_status_display(self, obj):
        colors = {
            'completed': '#28a745',
            'pending': '#ffc107', 
            'failed': '#dc3545'
        }
        color = colors.get(obj.payment_status, '#6c757d')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.payment_status.upper()
        )
    payment_status_display.short_description = 'Payment Status'
    
    def payment_screenshot_preview(self, obj):
        if obj.payment_screenshot:
            return format_html(
                '<a href="{}" target="_blank"><img src="{}" style="max-height: 100px; max-width: 150px;" /></a>',
                obj.payment_screenshot.url, obj.payment_screenshot.url
            )
        return "No screenshot uploaded"
    payment_screenshot_preview.short_description = 'Payment Screenshot'

@admin.register(Passenger)
class PassengerAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'gender', 'booking_info', 'seat_number')
    list_filter = ('gender', 'booking__booking_type', 'booking__payment_status')
    search_fields = ('name', 'booking__booking_id', 'booking__user__username')
    
    def booking_info(self, obj):
        return format_html(
            '<a href="{}">{}</a><br><small>{}</small>',
            reverse('admin:booking_booking_change', args=[obj.booking.id]),
            obj.booking.booking_id,
            obj.booking.user.username
        )
    booking_info.short_description = 'Booking'

# Dashboard Analytics (Custom Admin Views)
class TicketiveAdminSite(admin.AdminSite):
    site_header = "Ticketive Admin Dashboard"
    site_title = "Ticketive Admin"
    index_title = "Dashboard Overview"
    
    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        # Calculate statistics
        from django.db.models import Sum, Count
        
        total_bookings = Booking.objects.count()
        completed_bookings = Booking.objects.filter(payment_status='completed').count()
        pending_bookings = Booking.objects.filter(payment_status='pending').count()
        total_revenue = Booking.objects.filter(payment_status='completed').aggregate(
            total=Sum('total_amount'))['total'] or 0
        
        train_bookings = Booking.objects.filter(booking_type='train').count()
        bus_bookings = Booking.objects.filter(booking_type='bus').count()
        
        extra_context.update({
            'total_bookings': total_bookings,
            'completed_bookings': completed_bookings,
            'pending_bookings': pending_bookings,
            'total_revenue': total_revenue,
            'train_bookings': train_bookings,
            'bus_bookings': bus_bookings,
        })
        
        return super().index(request, extra_context)
