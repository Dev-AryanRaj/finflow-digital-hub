
import { useState, useEffect } from 'react';
import { checkDatabaseConnection } from '@/lib/mongodb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const HealthCheckPage = () => {
  const [health, setHealth] = useState<{
    status: 'checking' | 'connected' | 'disconnected';
    ping?: string;
    error?: string;
  }>({
    status: 'checking'
  });
  const [loading, setLoading] = useState(true);
  
  const checkHealth = async () => {
    setLoading(true);
    setHealth({ status: 'checking' });
    
    try {
      const result = await checkDatabaseConnection();
      setHealth(result);
    } catch (error) {
      setHealth({ 
        status: 'disconnected', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkHealth();
  }, []);
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">System Health</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Database Connection
              <Button
                variant="outline"
                size="sm"
                onClick={checkHealth}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              MongoDB connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {health.status === 'checking' ? (
              <div className="space-y-2">
                <p>Checking database connection...</p>
                <Progress value={50} className="w-full" />
              </div>
            ) : health.status === 'connected' ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Connected</span>
                {health.ping && <span className="ml-2 text-sm text-muted-foreground">(Ping: {health.ping})</span>}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  <span>Disconnected</span>
                </div>
                {health.error && (
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                    {health.error}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthCheckPage;
