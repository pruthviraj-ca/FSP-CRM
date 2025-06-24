import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload, Image, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useProperties } from '@/contexts/PropertyContext';
import { toast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [propertyDetails, setPropertyDetails] = useState({
    title: '',
    location: '',
    price: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    area: ''
  });
  const navigate = useNavigate();
  const { addProperty } = useProperties();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple admin check - in real app this would be proper authentication
    if (email === 'admin@propertyhub.com' && password === 'admin123') {
      setIsLoggedIn(true);
      toast({
        title: "Admin login successful",
        description: "Welcome to the admin panel!",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one property image",
        variant: "destructive",
      });
      return;
    }

    // Convert File objects to URLs for display
    const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    
    // Add property to global context
    addProperty({
      title: propertyDetails.title,
      location: propertyDetails.location,
      price: propertyDetails.price,
      type: propertyDetails.type,
      bedrooms: propertyDetails.bedrooms,
      bathrooms: propertyDetails.bathrooms,
      area: propertyDetails.area,
      images: imageUrls,
      featured: Math.random() > 0.5, // Randomly set as featured
      rating: Number((Math.random() * 1 + 4).toFixed(1)) // Random rating between 4-5
    });
    
    toast({
      title: "Property uploaded successfully",
      description: `${propertyDetails.title} has been added to the listings and will appear on the landing page`,
    });

    // Reset form
    setPropertyDetails({
      title: '',
      location: '',
      price: '',
      type: '',
      bedrooms: '',
      bathrooms: '',
      area: ''
    });
    setSelectedFiles([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md px-4">
          <Card className="w-full shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin </CardTitle>
              <CardDescription>
                Login to manage property listings / photos
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAdminLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    placeholder="admin@propertyhub.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input 
                    id="admin-password" 
                    type="password" 
                    placeholder="admin123" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded">
                  Demo credentials:<br />
                  Email: admin@propertyhub.com<br />
                  Password: admin123
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Admin Sign In"}
                </Button>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/')}
                    className="text-sm"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PropertyHub Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsLoggedIn(false);
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Property</h1>
          <p className="text-gray-600 mt-2">Add new properties with photos to the listings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Property Details & Photos</CardTitle>
            <CardDescription>
              Fill in the property information and upload high-quality images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePropertySubmit} className="space-y-6">
              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury 3BHK Apartment"
                    value={propertyDetails.title}
                    onChange={(e) => setPropertyDetails(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Bandra West, Mumbai"
                    value={propertyDetails.location}
                    onChange={(e) => setPropertyDetails(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="e.g., ₹2.5 Cr"
                    value={propertyDetails.price}
                    onChange={(e) => setPropertyDetails(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border rounded-md"
                    value={propertyDetails.type}
                    onChange={(e) => setPropertyDetails(prev => ({ ...prev, type: e.target.value }))}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="e.g., 3"
                    value={propertyDetails.bedrooms}
                    onChange={(e) => setPropertyDetails(prev => ({ ...prev, bedrooms: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="e.g., 2"
                    value={propertyDetails.bathrooms}
                    onChange={(e) => setPropertyDetails(prev => ({ ...prev, bathrooms: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    placeholder="e.g., 1,200 sq ft"
                    value={propertyDetails.area}
                    onChange={(e) => setPropertyDetails(prev => ({ ...prev, area: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label>Property Photos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Click to upload property photos
                    </p>
                    <p className="text-sm text-gray-500">
                      Select multiple images (PNG, JPG, JPEG up to 10MB each)
                    </p>
                  </label>
                </div>

                {/* Selected Images Preview */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <Label>Selected Images ({selectedFiles.length})</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Property
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
