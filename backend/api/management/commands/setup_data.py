from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User as DjangoUser
from api.models import User, Lead, Property, Flat
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Set up initial data for the CRM system'

    def handle(self, *args, **options):
        self.stdout.write('Setting up initial data...')

        # Create Django users first
        manager_django_user, created = DjangoUser.objects.get_or_create(
            email='manager@example.com',
            defaults={
                'username': 'manager',
                'first_name': 'John',
                'last_name': 'Manager',
                'password': make_password('password'),
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            self.stdout.write(f'Created manager Django user: {manager_django_user.email}')

        employee_django_user, created = DjangoUser.objects.get_or_create(
            email='employee@example.com',
            defaults={
                'username': 'employee',
                'first_name': 'Alice',
                'last_name': 'Employee',
                'password': make_password('password'),
            }
        )
        if created:
            self.stdout.write(f'Created employee Django user: {employee_django_user.email}')

        # Create custom User models
        manager, created = User.objects.get_or_create(
            django_user=manager_django_user,
            defaults={
                'role': 'manager',
                'phone_number': '123-456-7890',
            }
        )
        if created:
            self.stdout.write(f'Created manager user profile')

        employee, created = User.objects.get_or_create(
            django_user=employee_django_user,
            defaults={
                'role': 'employee',
                'phone_number': '234-567-8901',
            }
        )
        if created:
            self.stdout.write(f'Created employee user profile')

        # Create sample leads
        leads_data = [
            {
                'client_id': 'C1001',
                'client_name': 'John Doe',
                'phone_number': '123-456-7890',
                'email': 'john@example.com',
                'status': 'warm',
                'assigned_to': employee,
                'follow_up_date': timezone.now() + timedelta(days=2),
                'notes': 'Interested in 3BHK properties'
            },
            {
                'client_id': 'C1002',
                'client_name': 'Alice Smith',
                'phone_number': '234-567-8901',
                'email': 'alice@example.com',
                'status': 'hot',
                'assigned_to': employee,
                'follow_up_date': timezone.now() + timedelta(days=1),
                'notes': 'Ready to visit properties this weekend'
            },
            {
                'client_id': 'C1003',
                'client_name': 'Robert Johnson',
                'phone_number': '345-678-9012',
                'email': 'robert@example.com',
                'status': 'cold',
                'assigned_to': employee,
                'follow_up_date': timezone.now() - timedelta(days=1),
                'notes': 'Just exploring options',
                'missed': True
            }
        ]

        for lead_data in leads_data:
            lead, created = Lead.objects.get_or_create(
                client_id=lead_data['client_id'],
                defaults=lead_data
            )
            if created:
                self.stdout.write(f'Created lead: {lead.client_name}')

        # Create sample properties
        properties_data = [
            {
                'title': 'Luxury 3BHK Apartment',
                'location': 'Bandra West, Mumbai',
                'price': '₹2.5 Cr',
                'property_type': 'apartment',
                'bedrooms': '3',
                'bathrooms': '2',
                'area': '1,200 sq ft',
                'images': ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
                'featured': True,
                'rating': 4.8
            },
            {
                'title': 'Modern 2BHK Flat',
                'location': 'Koramangala, Bangalore',
                'price': '₹1.2 Cr',
                'property_type': 'apartment',
                'bedrooms': '2',
                'bathrooms': '2',
                'area': '980 sq ft',
                'images': ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'],
                'featured': False,
                'rating': 4.5
            },
            {
                'title': 'Spacious 4BHK Villa',
                'location': 'Gurgaon, Delhi NCR',
                'price': '₹3.8 Cr',
                'property_type': 'villa',
                'bedrooms': '4',
                'bathrooms': '3',
                'area': '2,100 sq ft',
                'images': ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'],
                'featured': True,
                'rating': 4.9
            }
        ]

        for property_data in properties_data:
            property_obj, created = Property.objects.get_or_create(
                title=property_data['title'],
                defaults=property_data
            )
            if created:
                self.stdout.write(f'Created property: {property_obj.title}')

        # Create sample flats
        flats_data = [
            {
                'builder_name': 'ABC Developers',
                'flat_number': 'A-101',
                'flat_type': '3BHK',
                'address': '123 Main Street, Mumbai',
                'assigned_to': employee,
                'status': 'available'
            },
            {
                'builder_name': 'XYZ Builders',
                'flat_number': 'B-205',
                'flat_type': '2BHK',
                'address': '456 Park Avenue, Bangalore',
                'assigned_to': employee,
                'status': 'available'
            },
            {
                'builder_name': 'PQR Construction',
                'flat_number': 'C-301',
                'flat_type': '4BHK',
                'address': '789 Lake View, Delhi',
                'assigned_to': employee,
                'status': 'available'
            }
        ]

        for flat_data in flats_data:
            flat, created = Flat.objects.get_or_create(
                builder_name=flat_data['builder_name'],
                flat_number=flat_data['flat_number'],
                defaults=flat_data
            )
            if created:
                self.stdout.write(f'Created flat: {flat.builder_name} - {flat.flat_number}')

        self.stdout.write(
            self.style.SUCCESS('Successfully set up initial data!')
        )
        self.stdout.write('\nDemo credentials:')
        self.stdout.write('Manager: manager@example.com / password')
        self.stdout.write('Employee: employee@example.com / password') 