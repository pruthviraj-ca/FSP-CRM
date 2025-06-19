
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/contexts/LeadsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Building2, CheckSquare, ThermometerSun, 
  Calendar, AlertTriangle, BarChart3 
} from 'lucide-react';

// Mock employee data
const employees = [
  { id: '2', name: 'Alice Employee', email: 'alice@example.com' },
  { id: '3', name: 'Bob Worker', email: 'bob@example.com' },
  { id: '4', name: 'Carol Staff', email: 'carol@example.com' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { leads, flats } = useLeads();
  const isManager = user?.role === 'manager';

  // Get leads assigned to the current employee if not a manager
  const myLeads = isManager ? leads : leads.filter(lead => lead.assignedTo === user?.id);
  const myFlats = isManager ? flats : flats.filter(flat => flat.assignedTo === user?.id);
  
  // Calculate statistics
  const coldLeads = myLeads.filter(lead => lead.status === 'cold').length;
  const warmLeads = myLeads.filter(lead => lead.status === 'warm').length;
  const hotLeads = myLeads.filter(lead => lead.status === 'hot').length;
  
  const missedFollowUps = myLeads.filter(lead => lead.missed).length;
  const upcomingFollowUps = myLeads.filter(lead => 
    lead.followUpDate && new Date(lead.followUpDate) > new Date() && !lead.missed
  ).length;

  // Manager statistics
  const getEmployeeStats = (employeeId: string) => {
    const empLeads = leads.filter(lead => lead.assignedTo === employeeId);
    const empFlats = flats.filter(flat => flat.assignedTo === employeeId);
    
    return {
      assignedLeads: empLeads.length,
      assignedFlats: empFlats.length,
      coldLeads: empLeads.filter(lead => lead.status === 'cold').length,
      warmLeads: empLeads.filter(lead => lead.status === 'warm').length,
      hotLeads: empLeads.filter(lead => lead.status === 'hot').length,
      missedFollowUps: empLeads.filter(lead => lead.missed).length,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isManager ? 'Manager Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isManager && <TabsTrigger value="team">Team Performance</TabsTrigger>}
          <TabsTrigger value="leads">My Leads</TabsTrigger>
          <TabsTrigger value="properties">My Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myLeads.length}</div>
                <p className="text-xs text-muted-foreground">
                  {myLeads.length > 0 ? 'Active leads in your pipeline' : 'No leads assigned yet'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myFlats.length}</div>
                <p className="text-xs text-muted-foreground">
                  {myFlats.length > 0 ? 'Available for showing' : 'No properties assigned'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
                <ThermometerSun className="h-4 w-4 text-realestate-hot" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hotLeads}</div>
                <p className="text-xs text-muted-foreground">
                  {hotLeads > 0 ? 'Ready to close' : 'No hot leads yet'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingFollowUps}</div>
                <p className="text-xs text-muted-foreground">
                  {upcomingFollowUps > 0 ? 'Upcoming scheduled follow-ups' : 'No upcoming follow-ups'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-hover col-span-2">
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-realestate-cold">{coldLeads}</div>
                    <div className="text-sm text-muted-foreground">Cold</div>
                    <div className="mt-2 h-2 w-16 rounded-full bg-realestate-cold/20">
                      <div 
                        className="h-full rounded-full bg-realestate-cold" 
                        style={{ width: `${coldLeads / myLeads.length * 100 || 0}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-realestate-warm">{warmLeads}</div>
                    <div className="text-sm text-muted-foreground">Warm</div>
                    <div className="mt-2 h-2 w-16 rounded-full bg-realestate-warm/20">
                      <div 
                        className="h-full rounded-full bg-realestate-warm" 
                        style={{ width: `${warmLeads / myLeads.length * 100 || 0}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-realestate-hot">{hotLeads}</div>
                    <div className="text-sm text-muted-foreground">Hot</div>
                    <div className="mt-2 h-2 w-16 rounded-full bg-realestate-hot/20">
                      <div 
                        className="h-full rounded-full bg-realestate-hot" 
                        style={{ width: `${hotLeads / myLeads.length * 100 || 0}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`card-hover ${missedFollowUps > 0 ? 'border-l-4 border-l-realestate-danger' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Attention Required</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${missedFollowUps > 0 ? 'text-realestate-danger' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{missedFollowUps}</div>
                <p className="text-xs text-muted-foreground">
                  {missedFollowUps > 0 
                    ? 'Missed follow-ups that need attention' 
                    : 'No missed follow-ups - great job!'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isManager && (
          <TabsContent value="team" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Team Lead Distribution</CardTitle>
                  <CardDescription>
                    Current lead assignment across team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.map(employee => {
                      const stats = getEmployeeStats(employee.id);
                      return (
                        <div key={employee.id} className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-realestate-primary text-white flex items-center justify-center mr-2">
                            {employee.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{employee.name}</h4>
                              <span className="text-sm text-muted-foreground">{stats.assignedLeads} leads</span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                              <div className="flex h-full rounded-full">
                                <div 
                                  className="h-full rounded-l-full bg-realestate-cold" 
                                  style={{ width: `${stats.coldLeads / stats.assignedLeads * 100 || 0}%` }} 
                                />
                                <div 
                                  className="h-full bg-realestate-warm" 
                                  style={{ width: `${stats.warmLeads / stats.assignedLeads * 100 || 0}%` }} 
                                />
                                <div 
                                  className="h-full rounded-r-full bg-realestate-hot" 
                                  style={{ width: `${stats.hotLeads / stats.assignedLeads * 100 || 0}%` }} 
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Property Distribution</CardTitle>
                  <CardDescription>
                    Current property assignment across team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employees.map(employee => {
                      const stats = getEmployeeStats(employee.id);
                      return (
                        <div key={employee.id} className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-realestate-primary text-white flex items-center justify-center mr-2">
                            {employee.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{employee.name}</h4>
                              <span className="text-sm text-muted-foreground">{stats.assignedFlats} properties</span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-secondary/50">
                              <div 
                                className="h-full rounded-full bg-realestate-primary" 
                                style={{ width: `${stats.assignedFlats / flats.length * 100 || 0}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>
                  Overview of team activity and follow-up compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {employees.map(employee => {
                      const stats = getEmployeeStats(employee.id);
                      return (
                        <Card key={employee.id} className={`card-hover ${stats.missedFollowUps > 0 ? 'border-l-4 border-l-realestate-danger' : ''}`}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{employee.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Leads:</span>
                              <span className="text-xs font-medium">{stats.assignedLeads}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Properties:</span>
                              <span className="text-xs font-medium">{stats.assignedFlats}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Hot Leads:</span>
                              <span className="text-xs font-medium">{stats.hotLeads}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Missed Follow-ups:</span>
                              <span className={`text-xs font-medium ${stats.missedFollowUps > 0 ? 'text-realestate-danger' : ''}`}>
                                {stats.missedFollowUps}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Leads</CardTitle>
              <CardDescription>
                {myLeads.length > 0 
                  ? 'Click on a lead to view details and update status'
                  : 'No leads assigned to you yet'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myLeads.map(lead => (
                  <div 
                    key={lead.id} 
                    className={`p-4 rounded-md border ${lead.missed ? 'missed-followup' : ''} card-hover cursor-pointer`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{lead.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        <p className="text-xs text-muted-foreground">Inquiry: {new Date(lead.inquiryTime).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full status-${lead.status}`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {lead.followUpDate && (
                      <div className="mt-2 text-xs">
                        <span className="text-muted-foreground">
                          Follow-up: {new Date(lead.followUpDate).toLocaleString()}
                          {lead.missed && <span className="ml-2 text-realestate-danger font-semibold">MISSED</span>}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Properties</CardTitle>
              <CardDescription>
                {myFlats.length > 0 
                  ? 'Properties available for showing to clients'
                  : 'No properties assigned to you yet'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myFlats.map(flat => (
                  <div 
                    key={flat.id} 
                    className="p-4 rounded-md border card-hover cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs bg-realestate-primary/10 text-realestate-primary px-2 py-1 rounded-full">
                          {flat.flatType}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {flat.flatId}
                        </span>
                      </div>
                      <h4 className="font-medium">{flat.builderName}</h4>
                      <p className="text-sm">{flat.flatNumber}</p>
                      <p className="text-xs text-muted-foreground">{flat.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
