import { Home, Twitter, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Home className="text-purple-400 w-6 h-6" />
              <h3 className="text-xl font-bold tracking-wide">SmartHome Control</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Intelligent automation for a smarter, more connected home. Elevate your daily living with secure, real-time control.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-base font-semibold text-purple-300 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Climate Control</li>
              <li>Security System</li>
              <li>Smart Lighting</li>
              <li>Window Automation</li>
              <li>Voice Control</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-semibold text-purple-300 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>User Guide</li>
              <li>API Docs</li>
              <li>Troubleshooting</li>
              <li>Device Setup</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© 2025 SmartHome Control. Empowering lifestyle through automation.</p>
          <p>IoT • Automation • Energy • Security • AI</p>
        </div>
      </div>
    </footer>
  );
}
