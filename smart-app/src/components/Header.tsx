import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Bell, Menu, Mic, User, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

interface UserType {
  firstName?: string;
  profileImageUrl?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const safeUser = user as UserType || {};
  const [showDropdown, setShowDropdown] = useState(false);
  const [, navigate] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-neutral-200 p-4 lg:p-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-neutral-600 hover:text-primary"
          >
            <Menu className="text-xl" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">{title}</h2>
            {subtitle && (
              <p className="text-neutral-500">
                {subtitle.includes("Welcome back") && safeUser?.firstName
                  ? `Welcome back, ${safeUser.firstName}`
                  : subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* Voice Status (Static text) */}
          <div className="hidden md:flex items-center space-x-2 bg-neutral-100 rounded-lg px-3 py-2">
            <Mic className="text-secondary" />
            <span className="text-sm text-neutral-600">Voice Control Active</span>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-neutral-600 hover:text-primary"
          >
            <Bell className="text-xl" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
              3
            </Badge>
          </Button>

          {/* Avatar Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="w-10 h-10 smart-home-gradient rounded-full flex items-center justify-center cursor-pointer">
              {safeUser?.profileImageUrl ? (
                <img
                  src={safeUser.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="text-white" />
              )}
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
