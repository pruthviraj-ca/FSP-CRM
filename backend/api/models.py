from django.db import models
from django.contrib.auth.models import User as DjangoUser
from django.utils import timezone

class User(models.Model):
    USER_ROLES = [
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]
    
    django_user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=USER_ROLES, default='employee')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    class Meta:
        db_table = 'users'

class Lead(models.Model):
    LEAD_STATUS = [
        ('hot', 'Hot'),
        ('warm', 'Warm'),
        ('cold', 'Cold'),
    ]
    
    client_id = models.CharField(max_length=10, unique=True)
    client_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    inquiry_time = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=4, choices=LEAD_STATUS, default='cold')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_leads')
    follow_up_date = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    missed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leads'
        ordering = ['-inquiry_time']

class Property(models.Model):
    PROPERTY_TYPES = [
        ('apartment', 'Apartment'),
        ('villa', 'Villa'),
        ('studio', 'Studio'),
        ('penthouse', 'Penthouse'),
    ]
    
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    price = models.CharField(max_length=50)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    bedrooms = models.CharField(max_length=10)
    bathrooms = models.CharField(max_length=10)
    area = models.CharField(max_length=50)
    images = models.JSONField(default=list)  # Store image URLs as JSON array
    featured = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'properties'
        ordering = ['-created_at']

class Flat(models.Model):
    FLAT_TYPES = [
        ('1BHK', '1BHK'),
        ('2BHK', '2BHK'),
        ('3BHK', '3BHK'),
        ('4BHK', '4BHK'),
    ]
    
    builder_name = models.CharField(max_length=100)
    flat_number = models.CharField(max_length=50)
    flat_type = models.CharField(max_length=10, choices=FLAT_TYPES)
    address = models.TextField()
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_flats')
    status = models.CharField(max_length=20, default='available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'flats'
        ordering = ['-created_at']
