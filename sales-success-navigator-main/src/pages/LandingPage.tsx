
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Search, Bed, Bath, Square, Heart, Phone, Mail, Star, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '@/contexts/PropertyContext';
import { toast } from '@/hooks/use-toast';

const LandingPage = () => {
  const { properties, searchProperties } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('Property Type');
  const [budget, setBudget] = useState('Budget');
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = () => {
    const results = searchProperties(searchQuery, propertyType, budget);
    setFilteredProperties(results);
    toast({
      title: "Search completed",
      description: `Found ${results.length} properties`,
    });
  };

  const handleNavClick = (section: string) => {
    toast({
      title: `${section} Section`,
      description: `You clicked on ${section}. This feature is coming soon!`,
    });
  };

  const handleContactClick = (action: string) => {
    toast({
      title: `${action} Feature`,
      description: `${action} functionality will be available soon!`,
    });
  };

  React.useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PropertyHub</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavClick('Buy')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Buy
              </button>
              <button 
                onClick={() => handleNavClick('Rent')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Rent
              </button>
              <button 
                onClick={() => handleNavClick('Sell')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sell
              </button>
              <button 
                onClick={() => handleNavClick('About')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('Contact')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/admin-login">
                  <Button variant="outline" size="sm">
                    Admin Login
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Employee Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => handleNavClick('Buy')}
                  className="text-gray-700 hover:text-blue-600 font-medium text-left"
                >
                  Buy
                </button>
                <button 
                  onClick={() => handleNavClick('Rent')}
                  className="text-gray-700 hover:text-blue-600 font-medium text-left"
                >
                  Rent
                </button>
                <button 
                  onClick={() => handleNavClick('Sell')}
                  className="text-gray-700 hover:text-blue-600 font-medium text-left"
                >
                  Sell
                </button>
                <button 
                  onClick={() => handleNavClick('About')}
                  className="text-gray-700 hover:text-blue-600 font-medium text-left"
                >
                  About
                </button>
                <button 
                  onClick={() => handleNavClick('Contact')}
                  className="text-gray-700 hover:text-blue-600 font-medium text-left"
                >
                  Contact
                </button>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link to="/admin-login">
                    <Button variant="outline" size="sm" className="w-full">
                      Admin Login
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Employee Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover the perfect property from thousands of listings
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search by city, locality, or project name" 
                  className="pl-10 h-12 text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-3 border rounded-md text-gray-900 h-12"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option>Property Type</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Studio</option>
                <option>Penthouse</option>
              </select>
              <select 
                className="px-4 py-3 border rounded-md text-gray-900 h-12"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option>Budget</option>
                <option>Under ₹50 Lac</option>
                <option>₹50 Lac - ₹1 Cr</option>
                <option>₹1 Cr - ₹2 Cr</option>
                <option>Above ₹2 Cr</option>
              </select>
              <Button 
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked properties for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.slice(0, 6).map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                <div className="relative">
                  <img 
                    src={property.images[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"} 
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {property.featured && (
                    <Badge className="absolute top-3 left-3 bg-orange-500">
                      Featured
                    </Badge>
                  )}
                  <button 
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    onClick={() => toast({ title: "Added to favorites!", description: `${property.title} added to your favorites` })}
                  >
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{property.rating}</span>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {property.title}
                    </CardTitle>
                    <span className="text-lg font-bold text-blue-600">
                      {property.price}
                    </span>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} Bath</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span>{property.area}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleContactClick('Call')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => toast({ title: "Property Details", description: `Showing details for ${property.title}` })}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8"
              onClick={() => toast({ title: "All Properties", description: "Showing all available properties" })}
            >
              View All Properties ({filteredProperties.length})
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{properties.length}+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">PropertyHub</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect home.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavClick('Buy Property')} className="hover:text-white">Buy Property</button></li>
                <li><button onClick={() => handleNavClick('Rent Property')} className="hover:text-white">Rent Property</button></li>
                <li><button onClick={() => handleNavClick('Sell Property')} className="hover:text-white">Sell Property</button></li>
                <li><button onClick={() => handleNavClick('Property Services')} className="hover:text-white">Property Services</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavClick('About Us')} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => handleNavClick('Careers')} className="hover:text-white">Careers</button></li>
                <li><button onClick={() => handleNavClick('Contact')} className="hover:text-white">Contact</button></li>
                <li><button onClick={() => handleNavClick('Privacy Policy')} className="hover:text-white">Privacy Policy</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <button 
                  onClick={() => handleContactClick('Call')}
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </button>
                <button 
                  onClick={() => handleContactClick('Email')}
                  className="flex items-center gap-2 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@propertyhub.com</span>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PropertyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
