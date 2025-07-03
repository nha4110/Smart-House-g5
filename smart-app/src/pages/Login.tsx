import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Home, RefreshCw, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { DeviceService } from '@/lib/device-service';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: DeviceService.createUser,
    onSuccess: (user) => {
      localStorage.setItem('currentUser', user.username);
      toast({
        title: "Login Successful",
        description: `Welcome to SmartHome Control, ${user.username}`,
      });
      setLocation('/dashboard');
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Failed to create user session",
        variant: "destructive",
      });
    },
  });

  const generateRandomName = () => {
    const adjectives = ['Smart', 'Quick', 'Silent', 'Bright', 'Swift', 'Cool', 'Safe', 'Wise'];
    const nouns = ['User', 'Home', 'Guest', 'Owner', 'Admin', 'Client', 'Resident'];
    const numbers = Math.floor(Math.random() * 9999) + 1000;

    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}_${numbers}`;
    setUsername(randomName);
  };

  const handleLogin = () => {
    if (!username.trim()) {
      generateRandomName();
      return;
    }
    createUserMutation.mutate(username);
  };

  // Initialize with random name on mount
  useEffect(() => {
    generateRandomName();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto p-4">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Home className="mx-auto text-5xl text-primary mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to SmartHome
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your intelligent home automation system
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Anonymous User ID
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={generateRandomName}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Your privacy is protected with anonymous access
                </p>
              </div>

              <Button
                onClick={handleLogin}
                disabled={createUserMutation.isPending}
                className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {createUserMutation.isPending ? 'Connecting...' : 'Access Control Center'}
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Features: Climate Control • Security • Automation • Energy Management</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
