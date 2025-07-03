import { Home, Twitter, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Home className="text-2xl text-primary" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">SmartHome Control</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Intelligent home automation for the modern lifestyle. Control your environment with precision and peace of mind.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Climate Control</li>
              <li>Security System</li>
              <li>Smart Lighting</li>
              <li>Window Automation</li>
              <li>Voice Control</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>User Guide</li>
              <li>API Documentation</li>
              <li>Troubleshooting</li>
              <li>Device Setup</li>
              <li>Contact Support</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 SmartHome Control Center. Enhancing quality of life through intelligent automation.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
            IoT • Automation • Energy Efficiency • Security
          </p>
        </div>
      </div>
    </footer>
  );
}
