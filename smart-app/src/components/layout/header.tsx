import { Moon, Sun, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  currentUser?: string;
}

export function Header({ currentUser }: HeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Home className="text-2xl text-primary" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SmartHome Control</h1>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {currentUser}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
