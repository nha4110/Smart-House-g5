import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { 
  Lightbulb, 
  Snowflake, 
  Wind, 
  Lock, 
  Shield, 
  Activity,
  CloudRain,
  Brain
} from "lucide-react";

interface Device {
  id: number;
  name: string;
  type: string;
  isActive: boolean;
  properties?: any;
}

interface Room {
  id: string;
  name: string;
  image: string;
  status: string;
  devices: Device[];
}

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const { toast } = useToast();

  const updateDeviceMutation = useMutation({
    mutationFn: async ({ deviceId, updates }: { deviceId: number; updates: any }) => {
      return apiRequest("PATCH", `/api/devices/${deviceId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Device Updated",
        description: "Device settings have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light":
        return <Lightbulb className="text-yellow-500" />;
      case "ac":
        return <Snowflake className="text-blue-500" />;
      case "window":
        return <Wind className="text-neutral-500" />;
      case "door":
        return <Lock className="text-green-500" />;
      case "security":
        return <Shield className="text-blue-500" />;
      case "sensor":
        return <Activity className="text-purple-500" />;
      default:
        return <Activity className="text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-secondary/10 text-secondary";
      case "Monitoring":
        return "bg-secondary/10 text-secondary";
      case "Sleep Mode":
        return "bg-yellow-100 text-yellow-700";
      case "Weather Watch":
        return "bg-blue-100 text-blue-700";
      case "Secured":
        return "bg-secondary/10 text-secondary";
      case "AI Active":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const toggleDevice = (deviceId: number, currentState: boolean) => {
    updateDeviceMutation.mutate({
      deviceId,
      updates: { isActive: !currentState }
    });
  };

  const handleRoomAction = () => {
    // This would navigate to a detailed room control page
    toast({
      title: "Room Control",
      description: `Opening ${room.name} detailed controls...`,
    });
  };

  return (
    <Card className="room-card">
      <img 
        src={room.image} 
        alt={room.name} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">{room.name}</h3>
          <Badge className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(room.status)}`}>
            {room.status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {room.devices.slice(0, 3).map((device) => (
            <div key={device.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getDeviceIcon(device.type)}
                <span className="text-neutral-600">{device.name.replace(`${room.name} `, '')}</span>
              </div>
              
              {device.type === "sensor" ? (
                <span className="text-sm text-neutral-500">
                  {device.isActive ? "Active" : "Inactive"}
                </span>
              ) : device.type === "window" ? (
                <span className="text-sm text-neutral-500">
                  {device.isActive ? "Open" : "Closed"}
                </span>
              ) : (
                <Switch
                  checked={device.isActive}
                  onCheckedChange={() => toggleDevice(device.id, device.isActive)}
                  disabled={updateDeviceMutation.isPending}
                  className="toggle-switch"
                />
              )}
            </div>
          ))}
          
          {room.devices.length === 0 && (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">
                {room.id === 'automation' ? '🤖' : '📱'}
              </div>
              <p className="text-sm text-neutral-500">
                {room.id === 'automation' 
                  ? "AI learning and automation"
                  : "No devices configured"
                }
              </p>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleRoomAction}
          className="w-full mt-4 bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          {room.id === 'automation' ? 'Manage Rules' : 
           room.id === 'security' ? 'Security Panel' : 
           'Control Room'}
        </Button>
      </CardContent>
    </Card>
  );
}
