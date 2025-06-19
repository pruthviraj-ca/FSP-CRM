
export type UserRole = 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type LeadStatus = 'cold' | 'warm' | 'hot';

export interface Lead {
  id: string;
  clientId: string;
  clientName: string;
  phoneNumber: string;
  email: string;
  inquiryTime: string;
  status: LeadStatus;
  assignedTo: string;
  followUpDate?: string;
  notes?: string;
  missed?: boolean;
}

export interface Flat {
  id: string;
  flatId: string;
  flatType: '2BHK' | '3BHK' | string;
  builderName: string;
  flatNumber: string;
  address: string;
  assignedTo: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  assignedLeads: number;
  assignedFlats: number;
  coldLeads: number;
  warmLeads: number;
  hotLeads: number;
  siteVisits: number;
  settlements: number;
  missedFollowUps: number;
}

export interface FollowUp {
  id: string;
  leadId: string;
  clientName: string;
  dateTime: string;
  notes?: string;
  completed: boolean;
}

export interface Settlement {
  id: string;
  leadId: string;
  flatId: string;
  clientName: string;
  flatDetails: string;
  amount: number;
  date: string;
  employeeId: string;
}
