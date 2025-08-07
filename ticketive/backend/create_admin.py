#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ticketive_backend.settings')
    django.setup()
    
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@ticketive.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print("Superuser 'admin' created successfully!")
        print("Username: admin")
        print("Password: admin123")
        print("Email: admin@ticketive.com")
    else:
        print("Superuser 'admin' already exists!")