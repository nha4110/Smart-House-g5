// src/components/sidebar.tsx

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="border-r bg-muted/40 min-h-screen w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Dashboard</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavItem to="/" icon={<Home className="h-4 w-4" />} label="Home" />
            <NavItem
              to="/analytics"
              icon={<LineChart className="h-4 w-4" />}
              label="Analytics"
            />
            <NavItem
              to="/orders"
              icon={<ShoppingCart className="h-4 w-4" />}
              label="Orders"
            />
            <NavItem
              to="/products"
              icon={<Package className="h-4 w-4" />}
              label="Products"
            />
            <NavItem
              to="/customers"
              icon={<Users2 className="h-4 w-4" />}
              label="Customers"
            />
            <NavItem
              to="/settings"
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
            />
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button className="w-full">
            <PanelLeft className="mr-2 h-4 w-4" />
            Collapse
          </Button>
        </div>
      </div>
    </div>
  );
}

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
