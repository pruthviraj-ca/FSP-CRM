
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Search, Filter, Home } from 'lucide-react';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/hooks/useAuth';

const Properties = () => {
  const { flats } = useLeads();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const isManager = user?.role === 'manager';
  const filteredFlats = flats
    .filter(flat => isManager || flat.assignedTo === user?.id)
    .filter(flat => 
      flat.builderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flat.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flat.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(flat => typeFilter === 'all' || flat.flatType === typeFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case '4BHK': return 'bg-blue-100 text-blue-800';
      case '3BHK': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isManager ? 'All Properties' : 'My Properties'}
        </h1>
        <p className="text-muted-foreground">
          Manage and view available properties
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="2BHK">2BHK</SelectItem>
            <SelectItem value="3BHK">3BHK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFlats.map((flat) => (
          <Card key={flat.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{flat.builderName}</CardTitle>
                <Badge className={getTypeColor(flat.flatType)}>
                  {flat.flatType}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                {flat.flatNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{flat.address}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Property ID: {flat.flatId}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Show to Client
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFlats.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || typeFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'No properties have been assigned to you yet'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Properties;
