import { LogOut, Leaf, Umbrella, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDeviceState } from '@/hooks/use-device-state';

export function AutomationControls() {
  const { toast } = useToast();
  const { updateDevice } = useDeviceState();

  const automations = [
    {
      id: 'leaving-home',
      name: 'Leaving Home',
      description: 'Turn off devices & lock doors',
      icon: LogOut,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'climate-control',
      name: 'Healthy Air',
      description: 'Auto climate optimization',
      icon: Leaf,
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 'rain-protection',
      name: 'Rain Protection',
      description: 'Auto weather response',
      icon: Umbrella,
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'security',
      name: 'Security Mode',
      description: 'Enhanced security protocols',
      icon: Shield,
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ];

  const handleAutomation = (automationId: string) => {
    switch (automationId) {
      case 'leaving-home':
        // Turn off lights, close windows, lock doors
        updateDevice('living-lights', 'relay', false);
        updateDevice('kitchen-lights', 'relay', false);
        updateDevice('ac', 'relay', false);
        updateDevice('living-window', 'servo', false);
        updateDevice('bedroom-window', 'servo', false);
        updateDevice('main-door', 'servo', false);
        break;
      
      case 'climate-control':
        // Optimize climate based on thresholds
        updateDevice('ac', 'relay', true);
        updateDevice('dehumidifier', 'relay', true);
        break;
      
      case 'rain-protection':
        // Close windows and activate rain cover
        updateDevice('roof', 'servo', true);
        updateDevice('living-window', 'servo', false);
        updateDevice('bedroom-window', 'servo', false);
        updateDevice('patio-door', 'servo', false);
        break;
      
      case 'security':
        // Enhanced security mode
        updateDevice('main-door', 'servo', false);
        updateDevice('living-window', 'servo', false);
        updateDevice('bedroom-window', 'servo', false);
        updateDevice('living-lights', 'relay', true);
        updateDevice('kitchen-lights', 'relay', true);
        break;
    }

    toast({
      title: "Automation Activated",
      description: `${automations.find(a => a.id === automationId)?.name} sequence has been initiated`,
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Smart Automation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {automations.map((automation) => {
            const Icon = automation.icon;
            return (
              <Button
                key={automation.id}
                variant="outline"
                className={`${automation.color} border p-4 text-left h-auto flex flex-col items-start transition-colors`}
                onClick={() => handleAutomation(automation.id)}
              >
                <Icon className={`${automation.iconColor} text-xl mb-2`} />
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {automation.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {automation.description}
                </p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
