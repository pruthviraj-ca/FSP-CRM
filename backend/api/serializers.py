from rest_framework import serializers
from .models import User, Lead, Property, Flat
from django.contrib.auth.models import User as DjangoUser

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='django_user.username', read_only=True)
    email = serializers.EmailField(source='django_user.email', read_only=True)
    first_name = serializers.CharField(source='django_user.first_name', read_only=True)
    last_name = serializers.CharField(source='django_user.last_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number']
        read_only_fields = ['id', 'username', 'email', 'first_name', 'last_name']

class LeadSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Lead
        fields = [
            'id', 'client_id', 'client_name', 'phone_number', 'email',
            'inquiry_time', 'status', 'assigned_to', 'assigned_to_id',
            'follow_up_date', 'notes', 'missed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'location', 'price', 'property_type',
            'bedrooms', 'bathrooms', 'area', 'images', 'featured',
            'rating', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class FlatSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Flat
        fields = [
            'id', 'builder_name', 'flat_number', 'flat_type', 'address',
            'assigned_to', 'assigned_to_id', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at'] 