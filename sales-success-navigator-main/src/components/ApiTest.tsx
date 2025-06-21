import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface HelloResponse {
  message: string;
}

const ApiTest = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<HelloResponse>(API_ENDPOINTS.HELLO);
      if (response.data) {
        setMessage(`✅ Connection successful! ${response.data.message}`);
      } else {
        setMessage(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      setMessage(`❌ Connection failed: ${error}`);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Django Connection'}
        </Button>
        {message && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTest; 