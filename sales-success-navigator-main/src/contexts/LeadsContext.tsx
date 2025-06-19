
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, LeadStatus, Flat } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Mock data for leads
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    clientId: 'C1001',
    clientName: 'John Doe',
    phoneNumber: '123-456-7890',
    email: 'john@example.com',
    inquiryTime: '2023-06-10T09:30:00',
    status: 'warm',
    assignedTo: '2',
    followUpDate: '2025-04-15T10:00:00',
    notes: 'Interested in 3BHK properties'
  },
  {
    id: '2',
    clientId: 'C1002',
    clientName: 'Alice Smith',
    phoneNumber: '234-567-8901',
    email: 'alice@example.com',
    inquiryTime: '2023-06-11T14:20:00',
    status: 'hot',
    assignedTo: '2',
    followUpDate: '2025-04-13T15:30:00',
    notes: 'Ready to visit properties this weekend'
  },
  {
    id: '3',
    clientId: 'C1003',
    clientName: 'Robert Johnson',
    phoneNumber: '345-678-9012',
    email: 'robert@example.com',
    inquiryTime: '2023-06-12T11:15:00',
    status: 'cold',
    assignedTo: '2',
    followUpDate: '2025-04-11T14:00:00',
    notes: 'Just exploring options',
    missed: true
  },
  {
    id: '4',
    clientId: 'C1004',
    clientName: 'Emily Brown',
    phoneNumber: '456-789-0123',
    email: 'emily@example.com',
    inquiryTime: '2023-06-13T16:45:00',
    status: 'warm',
    assignedTo: '3'
  },
  {
    id: '5',
    clientId: 'C1005',
    clientName: 'Michael Wilson',
    phoneNumber: '567-890-1234',
    email: 'michael@example.com',
    inquiryTime: '2023-06-14T10:30:00',
    status: 'cold',
    assignedTo: '3'
  }
];

// Mock data for flats
const MOCK_FLATS: Flat[] = [
  {
    id: '1',
    flatId: 'F2001',
    flatType: '2BHK',
    builderName: 'Prestige Builders',
    flatNumber: 'A-101',
    address: '123 Main St, Downtown',
    assignedTo: '2'
  },
  {
    id: '2',
    flatId: 'F3001',
    flatType: '3BHK',
    builderName: 'Prestige Builders',
    flatNumber: 'B-202',
    address: '123 Main St, Downtown',
    assignedTo: '2'
  },
  {
    id: '3',
    flatId: 'F2002',
    flatType: '2BHK',
    builderName: 'Luxury Homes',
    flatNumber: 'C-303',
    address: '456 Park Ave, Uptown',
    assignedTo: '2'
  },
  {
    id: '4',
    flatId: 'F3002',
    flatType: '3BHK',
    builderName: 'Luxury Homes',
    flatNumber: 'D-404',
    address: '456 Park Ave, Uptown',
    assignedTo: '3'
  },
  {
    id: '5',
    flatId: 'F2003',
    flatType: '2BHK',
    builderName: 'Urban Dwellings',
    flatNumber: 'E-505',
    address: '789 Elm St, Midtown',
    assignedTo: '3'
  }
];

interface LeadsContextType {
  leads: Lead[];
  flats: Flat[];
  getLeadById: (id: string) => Lead | undefined;
  getFlatById: (id: string) => Flat | undefined;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLeadFollowUp: (id: string, followUpDate: string, notes?: string) => void;
  markFollowUpComplete: (id: string) => void;
  recordSettlement: (leadId: string, flatId: string, amount: number) => void;
  uploadLeads: (leads: Lead[]) => void;
  uploadFlats: (flats: Flat[]) => void;
  distributeLeads: (employeeIds: string[], leadIds: string[]) => void;
  distributeFlats: (employeeIds: string[], flatIds: string[]) => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [flats, setFlats] = useState<Flat[]>(MOCK_FLATS);
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would be an API call to get leads and flats
    // Check for missed follow-ups
    const now = new Date();
    const updatedLeads = leads.map(lead => {
      if (lead.followUpDate && new Date(lead.followUpDate) < now && !lead.missed) {
        return { ...lead, missed: true };
      }
      return lead;
    });
    
    if (JSON.stringify(updatedLeads) !== JSON.stringify(leads)) {
      setLeads(updatedLeads);
    }
  }, [leads]);

  const getLeadById = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  const getFlatById = (id: string) => {
    return flats.find(flat => flat.id === id);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      )
    );
    toast({
      title: "Status updated",
      description: `Lead status has been updated to ${status}`,
    });
  };

  const updateLeadFollowUp = (id: string, followUpDate: string, notes?: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, followUpDate, notes: notes || lead.notes, missed: false } : lead
      )
    );
    toast({
      title: "Follow-up scheduled",
      description: `Follow-up has been scheduled for ${new Date(followUpDate).toLocaleString()}`,
    });
  };

  const markFollowUpComplete = (id: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, missed: false } : lead
      )
    );
    toast({
      title: "Follow-up completed",
      description: "The follow-up has been marked as completed",
    });
  };

  const recordSettlement = (leadId: string, flatId: string, amount: number) => {
    // In a real app, this would create a settlement record in the database
    // and then remove the lead and flat
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    setFlats(prevFlats => prevFlats.filter(flat => flat.id !== flatId));
    toast({
      title: "Settlement recorded",
      description: `Settlement for ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been successfully recorded`,
      variant: "default",
    });
  };

  const uploadLeads = (newLeads: Lead[]) => {
    // In a real app, this would upload leads to the database
    const newLeadsWithIds = newLeads.map((lead, index) => ({
      ...lead,
      id: `new-${Date.now()}-${index}`,
    }));
    
    setLeads(prevLeads => [...prevLeads, ...newLeadsWithIds]);
    toast({
      title: "Leads uploaded",
      description: `${newLeadsWithIds.length} new leads have been uploaded successfully`,
    });
  };

  const uploadFlats = (newFlats: Flat[]) => {
    // In a real app, this would upload flats to the database
    const newFlatsWithIds = newFlats.map((flat, index) => ({
      ...flat,
      id: `new-${Date.now()}-${index}`,
    }));
    
    setFlats(prevFlats => [...prevFlats, ...newFlatsWithIds]);
    toast({
      title: "Properties uploaded",
      description: `${newFlatsWithIds.length} new properties have been uploaded successfully`,
    });
  };

  const distributeLeads = (employeeIds: string[], leadIds: string[]) => {
    // In a real app, this would distribute leads to employees
    // For now, we'll just update the assignedTo field
    if (employeeIds.length === 0 || leadIds.length === 0) {
      toast({
        title: "Distribution failed",
        description: "Please select at least one employee and one lead",
        variant: "destructive",
      });
      return;
    }

    const leadsPerEmployee = Math.ceil(leadIds.length / employeeIds.length);
    let distributedCount = 0;

    const updatedLeads = leads.map(lead => {
      if (leadIds.includes(lead.id)) {
        const employeeIndex = Math.floor(distributedCount / leadsPerEmployee);
        distributedCount++;
        return {
          ...lead,
          assignedTo: employeeIds[Math.min(employeeIndex, employeeIds.length - 1)],
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
    toast({
      title: "Leads distributed",
      description: `${leadIds.length} leads have been distributed to ${employeeIds.length} employees`,
    });
  };

  const distributeFlats = (employeeIds: string[], flatIds: string[]) => {
    // Similar to distributeLeads but for flats
    if (employeeIds.length === 0 || flatIds.length === 0) {
      toast({
        title: "Distribution failed",
        description: "Please select at least one employee and one property",
        variant: "destructive",
      });
      return;
    }

    const flatsPerEmployee = Math.ceil(flatIds.length / employeeIds.length);
    let distributedCount = 0;

    const updatedFlats = flats.map(flat => {
      if (flatIds.includes(flat.id)) {
        const employeeIndex = Math.floor(distributedCount / flatsPerEmployee);
        distributedCount++;
        return {
          ...flat,
          assignedTo: employeeIds[Math.min(employeeIndex, employeeIds.length - 1)],
        };
      }
      return flat;
    });

    setFlats(updatedFlats);
    toast({
      title: "Properties distributed",
      description: `${flatIds.length} properties have been distributed to ${employeeIds.length} employees`,
    });
  };

  return (
    <LeadsContext.Provider value={{
      leads,
      flats,
      getLeadById,
      getFlatById,
      updateLeadStatus,
      updateLeadFollowUp,
      markFollowUpComplete,
      recordSettlement,
      uploadLeads,
      uploadFlats,
      distributeLeads,
      distributeFlats,
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
