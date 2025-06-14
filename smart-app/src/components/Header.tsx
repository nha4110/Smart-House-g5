import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Bell, Menu, Mic, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import VoiceControlModal from "./VoiceControlModal";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-neutral-200 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden p-2 text-neutral-600 hover:text-primary">
              <Menu className="text-xl" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">{title}</h2>
              {subtitle && (
                <p className="text-neutral-500">
                  {subtitle.includes("Welcome back") && user?.firstName 
                    ? `Welcome back, ${user.firstName}`
                    : subtitle
                  }
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Voice Control */}
            <div className="hidden md:flex items-center space-x-2 bg-neutral-100 rounded-lg px-3 py-2">
              <Mic className="text-secondary" />
              <span className="text-sm text-neutral-600">Voice Control Active</span>
            </div>
            
            {/* Voice Control Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVoiceModalOpen(true)}
              className="p-2 text-neutral-600 hover:text-primary"
            >
              <Mic className="text-xl" />
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2 text-neutral-600 hover:text-primary">
              <Bell className="text-xl" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                3
              </Badge>
            </Button>
            
            {/* User Avatar */}
            <div className="w-10 h-10 smart-home-gradient rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="text-white" />
              )}
            </div>
          </div>
        </div>
      </header>

      <VoiceControlModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </>
  );
}
