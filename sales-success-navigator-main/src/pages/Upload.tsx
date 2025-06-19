
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload as UploadIcon, FileSpreadsheet, Users, Building2 } from 'lucide-react';
import { useLeads } from '@/contexts/LeadsContext';
import { toast } from '@/hooks/use-toast';
import { Lead, Flat } from '@/types';

const Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { uploadLeads, uploadFlats } = useLeads();

  const parseExcelToLeads = (data: any[]): Lead[] => {
    return data.map((row, index) => ({
      id: `excel-lead-${Date.now()}-${index}`,
      clientId: row['Client Unique ID'] || row['clientId'] || `C${Date.now()}${index}`,
      clientName: row['Client Name'] || row['clientName'] || '',
      phoneNumber: row['Phone Number'] || row['phoneNumber'] || '',
      email: row['Email ID'] || row['email'] || '',
      inquiryTime: row['Time of Inquiry'] || row['inquiryTime'] || new Date().toISOString(),
      status: 'cold',
      assignedTo: '',
      notes: row['Notes'] || row['notes'] || ''
    }));
  };

  const parseExcelToFlats = (data: any[]): Flat[] => {
    return data.map((row, index) => ({
      id: `excel-flat-${Date.now()}-${index}`,
      flatId: row['Flat Unique ID'] || row['flatId'] || `F${Date.now()}${index}`,
      flatType: row['Flat Type'] || row['flatType'] || '2BHK',
      builderName: row['Builder Name'] || row['builderName'] || '',
      flatNumber: row['Flat Number'] || row['flatNumber'] || '',
      address: row['Address'] || row['address'] || '',
      assignedTo: ''
    }));
  };

  const handleFileUpload = async (file: File, type: 'leads' | 'flats') => {
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast({
        title: "Invalid file format",
        description: "Please upload an Excel file (.xlsx, .xls) or CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // For demo purposes, we'll simulate Excel parsing
      // In a real app, you'd use a library like xlsx or papaparse
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          // Simulate parsing Excel data
          const mockData = generateMockDataFromFile(file.name, type);
          
          if (type === 'leads') {
            const leads = parseExcelToLeads(mockData);
            uploadLeads(leads);
          } else {
            const flats = parseExcelToFlats(mockData);
            uploadFlats(flats);
          }
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "Failed to parse the uploaded file",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const generateMockDataFromFile = (fileName: string, type: 'leads' | 'flats') => {
    // This simulates parsing an Excel file
    if (type === 'leads') {
      return Array.from({ length: 10 }, (_, i) => ({
        'Client Unique ID': `C${Date.now()}${i}`,
        'Client Name': `Client ${i + 1}`,
        'Phone Number': `555-000-${(i + 1).toString().padStart(4, '0')}`,
        'Email ID': `client${i + 1}@example.com`,
        'Time of Inquiry': new Date().toISOString(),
        'Notes': `Uploaded from ${fileName}`
      }));
    } else {
      return Array.from({ length: 8 }, (_, i) => ({
        'Flat Unique ID': `F${Date.now()}${i}`,
        'Flat Type': i % 2 === 0 ? '2BHK' : '3BHK',
        'Builder Name': `Builder ${Math.floor(i / 2) + 1}`,
        'Flat Number': `${String.fromCharCode(65 + Math.floor(i / 2))}-${(i % 2) + 1}01`,
        'Address': `${Math.floor(i / 2) + 1}23 Street ${i + 1}, City`
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Data</h1>
        <p className="text-muted-foreground">
          Upload client leads and property data using Excel files
        </p>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Client Leads
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Upload Client Leads
              </CardTitle>
              <CardDescription>
                Upload client lead data in Excel format. Required columns: Client Unique ID, Client Name, Phone Number, Email ID, Time of Inquiry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="leads-file">Excel File</Label>
                <Input
                  id="leads-file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, 'leads');
                    }
                  }}
                  disabled={isUploading}
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                Supported formats: .xlsx, .xls, .csv
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Required Excel Columns:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Client Unique ID</li>
                  <li>• Client Name</li>
                  <li>• Phone Number</li>
                  <li>• Email ID</li>
                  <li>• Time of Inquiry</li>
                  <li>• Notes (optional)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Upload Properties
              </CardTitle>
              <CardDescription>
                Upload property/flat data in Excel format. Required columns: Flat Unique ID, Flat Type, Builder Name, Flat Number, Address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="properties-file">Excel File</Label>
                <Input
                  id="properties-file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, 'flats');
                    }
                  }}
                  disabled={isUploading}
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                Supported formats: .xlsx, .xls, .csv
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Required Excel Columns:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Flat Unique ID</li>
                  <li>• Flat Type (2BHK/3BHK)</li>
                  <li>• Builder Name</li>
                  <li>• Flat Number</li>
                  <li>• Address</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isUploading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4 animate-spin" />
              <span>Uploading and processing file...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Upload;
