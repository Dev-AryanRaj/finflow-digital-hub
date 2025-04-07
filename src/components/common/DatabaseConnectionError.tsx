
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, RefreshCw } from 'lucide-react';

interface DatabaseConnectionErrorProps {
  message?: string;
  onRetry?: () => void;
}

const DatabaseConnectionError = ({ message, onRetry }: DatabaseConnectionErrorProps) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="mx-auto max-w-md border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Database className="h-6 w-6" />
            Database Connection Problem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>We're having trouble connecting to the database.</p>
            {message && (
              <pre className="mt-2 rounded bg-muted p-2 font-mono text-xs overflow-auto max-h-40">
                {message}
              </pre>
            )}
            <ul className="mt-4 list-inside list-disc space-y-2">
              <li>Check if MongoDB is running on your system</li>
              <li>Verify your MongoDB connection string in .env file</li>
              <li>Make sure your network can reach the MongoDB server</li>
              <li>Try restarting the application</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload App
          </Button>
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DatabaseConnectionError;
