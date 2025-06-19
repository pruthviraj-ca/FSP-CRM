
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  images: string[];
  featured: boolean;
  rating: number;
  createdAt: string;
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  searchProperties: (query: string, type?: string, budget?: string) => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹2.5 Cr",
      type: "Apartment",
      bedrooms: "3",
      bathrooms: "2",
      area: "1,200 sq ft",
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"],
      featured: true,
      rating: 4.8,
      createdAt: "2024-01-01"
    },
    {
      id: '2',
      title: "Modern 2BHK Flat",
      location: "Koramangala, Bangalore",
      price: "₹1.2 Cr",
      type: "Apartment",
      bedrooms: "2",
      bathrooms: "2",
      area: "980 sq ft",
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"],
      featured: false,
      rating: 4.5,
      createdAt: "2024-01-02"
    },
    {
      id: '3',
      title: "Spacious 4BHK Villa",
      location: "Gurgaon, Delhi NCR",
      price: "₹3.8 Cr",
      type: "Villa",
      bedrooms: "4",
      bathrooms: "3",
      area: "2,100 sq ft",
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"],
      featured: true,
      rating: 4.9,
      createdAt: "2024-01-03"
    }
  ]);

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProperties(prev => [newProperty, ...prev]);
  };

  const searchProperties = (query: string, type?: string, budget?: string) => {
    return properties.filter(property => {
      const matchesQuery = !query || 
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.location.toLowerCase().includes(query.toLowerCase()) ||
        property.type.toLowerCase().includes(query.toLowerCase());
      
      const matchesType = !type || type === 'Property Type' || property.type === type;
      
      const matchesBudget = !budget || budget === 'Budget' || (() => {
        const priceNum = parseFloat(property.price.replace(/[^\d.]/g, ''));
        switch (budget) {
          case 'Under ₹50 Lac': return priceNum < 0.5;
          case '₹50 Lac - ₹1 Cr': return priceNum >= 0.5 && priceNum <= 1;
          case '₹1 Cr - ₹2 Cr': return priceNum > 1 && priceNum <= 2;
          case 'Above ₹2 Cr': return priceNum > 2;
          default: return true;
        }
      })();

      return matchesQuery && matchesType && matchesBudget;
    });
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, searchProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
