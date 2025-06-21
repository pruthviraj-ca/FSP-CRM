from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import authenticate
from django.contrib.auth.models import User as DjangoUser
from django.utils import timezone
from .models import User, Lead, Property, Flat
from .serializers import UserSerializer, LeadSerializer, PropertySerializer, FlatSerializer

class HelloWorldView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "Hello from Django API!"})

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate using Django's built-in user model
        try:
            django_user = DjangoUser.objects.get(email=email)
        except DjangoUser.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = authenticate(username=django_user.username, password=password)
        
        if user is not None:
            # Now get our custom user profile
            try:
                custom_user = User.objects.get(django_user=user)
                serializer = UserSerializer(custom_user)
                return Response({
                    'user': serializer.data,
                    'message': 'Login successful'
                })
            except User.DoesNotExist:
                return Response(
                    {'error': 'User profile not found'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

class LeadViewSet(ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'manager':
            return Lead.objects.all()
        return Lead.objects.filter(assigned_to=user)

    def update_status(self, request, pk=None):
        lead = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Lead.LEAD_STATUS):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lead.status = new_status
        lead.save()
        serializer = self.get_serializer(lead)
        return Response(serializer.data)

    def update_followup(self, request, pk=None):
        lead = self.get_object()
        follow_up_date = request.data.get('follow_up_date')
        notes = request.data.get('notes')
        
        if follow_up_date:
            lead.follow_up_date = follow_up_date
        if notes:
            lead.notes = notes
        
        lead.missed = False
        lead.save()
        serializer = self.get_serializer(lead)
        return Response(serializer.data)

class PropertyViewSet(ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]  # Allow public access to properties

    def get_queryset(self):
        queryset = Property.objects.all()
        
        # Filter by search query
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(title__icontains=search)
        
        # Filter by property type
        property_type = self.request.query_params.get('type', None)
        if property_type:
            queryset = queryset.filter(property_type=property_type)
        
        # Filter by budget (simplified)
        budget = self.request.query_params.get('budget', None)
        if budget:
            # This is a simplified budget filter - you might want to implement more sophisticated logic
            pass
        
        return queryset

class FlatViewSet(ModelViewSet):
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'manager':
            return Flat.objects.all()
        return Flat.objects.filter(assigned_to=user)
