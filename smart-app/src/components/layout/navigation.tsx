import { Gauge, Settings, Wifi } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Gauge },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/iot-connection', label: 'IoT Connection', icon: Wifi },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} href={path}>
              <span
                className={`${
                  location === path
                    ? 'border-primary text-primary border-b-2'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                } py-4 px-1 text-sm font-medium flex items-center space-x-2 cursor-pointer`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
