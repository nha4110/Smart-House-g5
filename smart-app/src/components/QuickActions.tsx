import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { 
  CloudRain, 
  Leaf, 
  Shield, 
  LogOut, 
  Mic, 
  Lightbulb 
} from "lucide-react";

export default function QuickActions() {
  const { toast } = useToast();

  const executeActionMutation = useMutation({
    mutationFn: async (action: string) => {
      if (action === 'voice_control') {
        // This would open voice control modal
        return { success: true };
      }
      if (action === 'all_lights_off') {
        // This would be a special endpoint to turn off all lights
        return apiRequest("POST", "/api/automation/execute/all_lights_off", {});
      }
      return apiRequest("POST", `/api/automation/execute/${action}`, {});
    },
    onSuccess: (data, action) => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity"] });
      
      const actionNames: Record<string, string> = {
        'rainy_day': 'Rainy Day Mode',
        'healthy_air': 'Healthy Air Mode',
        'anti_theft': 'Anti-theft Mode',
        'leaving_home': 'Leaving Home Mode',
        'voice_control': 'Voice Control',
        'all_lights_off': 'All Lights Off'
      };
      
      toast({
        title: "Action Executed",
        description: `${actionNames[action]} has been activated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const quickActions = [
    {
      id: "rainy_day",
      name: "Rainy Day",
      icon: <CloudRain className="text-2xl" />,
      description: "Close windows and activate indoor lighting"
    },
    {
      id: "healthy_air",
      name: "Healthy Air",
      icon: <Leaf className="text-2xl" />,
      description: "Activate ventilation systems"
    },
    {
      id: "anti_theft",
      name: "Anti-theft",
      icon: <Shield className="text-2xl" />,
      description: "Lock all doors and arm security"
    },
    {
      id: "leaving_home",
      name: "Leaving Home",
      icon: <LogOut className="text-2xl" />,
      description: "Secure and optimize energy usage"
    },
    {
      id: "voice_control",
      name: "Voice Control",
      icon: <Mic className="text-2xl" />,
      description: "Activate voice assistant"
    },
    {
      id: "all_lights_off",
      name: "All Lights Off",
      icon: <Lightbulb className="text-2xl" />,
      description: "Turn off all lighting systems"
    }
  ];

  return (
    <Card className="status-card">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              onClick={() => executeActionMutation.mutate(action.id)}
              disabled={executeActionMutation.isPending}
              className="flex flex-col items-center p-4 h-auto border border-neutral-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              <div className="mb-2">
                {action.icon}
              </div>
              <span className="text-sm font-medium text-center">{action.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
