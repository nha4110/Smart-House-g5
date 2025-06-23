import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home as HomeIcon,
  Shield,
  Zap,
  Brain,
  Smartphone,
  Leaf,
  Star,
  Heart,
  Wind,
  Moon,
  Activity,
  Clock,
  Camera,
  Phone,
  Lock,
  Lightbulb,
  Thermometer,
  ChevronDown,
  Check,
  ArrowUp,
  Mic,
  Gauge,
  Battery,
  Wifi,
  Settings,
} from "lucide-react";

export default function Features() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [counters, setCounters] = useState({ devices: 0, savings: 0, monitoring: 0 });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const hasAnimated = useRef(false);
  const navigate = useNavigate();

  // Counter animation
  useEffect(() => {
    if (!hasAnimated.current) {
      const timer = setTimeout(() => {
        const duration = 2000;
        const targets = { devices: 500, savings: 98, monitoring: 24 };
        const steps = 60;
        let currentStep = 0;

        const interval = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;
          
          setCounters({
            devices: Math.floor(targets.devices * progress),
            savings: Math.floor(targets.savings * progress),
            monitoring: Math.floor(targets.monitoring * progress),
          });

          if (currentStep >= steps) {
            clearInterval(interval);
            setCounters(targets);
          }
        }, duration / steps);

        hasAnimated.current = true;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setActiveSection(index);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-900">
      {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
            <button
                className="flex items-center space-x-3 focus:outline-none"
                onClick={() => navigate("/")}
                aria-label="Go to Home"
                type="button"
            >
                <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
                </span>
                <span className="text-white font-bold text-xl">SmartHome</span>
            </button>
            <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
                <a href="#solutions" className="text-white/80 hover:text-white transition-colors">Solutions</a>
                <a href="#faq" className="text-white/80 hover:text-white transition-colors">FAQ</a>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                Get Started
            </Button>
            </div>
        </div>
        </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Next-Generation{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Smart Home
              </span>{" "}
              Features
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto font-medium">
              Experience the future of intelligent living with AI-powered automation, advanced security, and seamless connectivity that anticipates your every need.
            </p>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 animate-float hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-white mb-2">{counters.devices}</div>
                <div className="text-purple-200">Smart Devices Supported</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 animate-float hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-white mb-2">{counters.savings}%</div>
                <div className="text-purple-200">Energy Savings</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 animate-float hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-white mb-2">{counters.monitoring}</div>
                <div className="text-purple-200">Hours Security Monitoring</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Revolutionary Smart Features</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover how our advanced AI and IoT technologies transform your home into an intelligent, responsive environment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AI-Powered Intelligence */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 animate-slide-up">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI-Powered Intelligence</h3>
                    <p className="text-purple-200">Learns and adapts to your lifestyle</p>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" alt="Modern smart home living room with AI controls" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Predictive climate control based on weather and occupancy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Automated lighting that follows your circadian rhythm</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Smart appliance scheduling for optimal energy usage</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Security */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Advanced Security</h3>
                    <p className="text-purple-200">Multi-layered protection system</p>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" alt="Smart home security system with cameras and sensors" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Biometric authentication and facial recognition</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">AI-powered threat detection and instant alerts</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Automated emergency response protocols</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Energy Optimization */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Energy Optimization</h3>
                    <p className="text-purple-200">Sustainable living made simple</p>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" alt="Solar panels and energy management system" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Real-time carbon footprint tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Solar panel integration and battery management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Smart grid connectivity and peak-hour optimization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice & Gesture Control */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-500 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Voice & Gesture Control</h3>
                    <p className="text-purple-200">Natural interaction technology</p>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" alt="Smart speaker and voice control interface" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Natural language processing for complex commands</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Hand gesture recognition and air-touch controls</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/90">Multi-language support and voice profiles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Health & Wellness Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Health & Wellness Integration</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Monitor and optimize your health with intelligent environmental controls and biometric tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Air Quality Monitoring */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Air Quality Monitoring</h3>
                <p className="text-white/70 mb-4">Real-time air quality assessment with automatic purification.</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-white/80">PM2.5, CO2, and allergen detection</span>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Optimization */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sleep Optimization</h3>
                <p className="text-white/70 mb-4">Smart bedroom environment for better sleep quality.</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-white/80">Temperature, lighting, and sound control</span>
                </div>
              </CardContent>
            </Card>

            {/* Fitness Integration */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Fitness Integration</h3>
                <p className="text-white/70 mb-4">Sync with wearables for comprehensive health tracking.</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-white/80">Heart rate, activity, and recovery metrics</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Smart Solutions Section */}
      <section id="solutions" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Real-World Smart Solutions</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              See how our technology transforms everyday scenarios into intelligent, automated experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Morning Routine */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 animate-slide-up">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-white mb-6">Perfect Morning Routine</h3>
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" alt="Modern bedroom with smart lighting and automated curtains" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <span className="text-white font-bold text-sm">6:30</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Gradual Wake-Up</h4>
                      <p className="text-white/70 text-sm">Smart lights slowly brighten, curtains open automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <span className="text-white font-bold text-sm">6:45</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Climate Optimization</h4>
                      <p className="text-white/70 text-sm">Temperature adjusts to your preference, air purifier activates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <span className="text-white font-bold text-sm">7:00</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Kitchen Ready</h4>
                      <p className="text-white/70 text-sm">Coffee maker starts, kitchen lights on, news briefing begins</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Response */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-white mb-6">Intelligent Security Response</h3>
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" alt="Smart home security cameras and monitoring system" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Motion Detection</h4>
                      <p className="text-white/70 text-sm">AI analyzes movement patterns, distinguishes between residents and intruders</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Instant Alerts</h4>
                      <p className="text-white/70 text-sm">Push notifications, emergency contacts, and local authorities contacted</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Automatic Lockdown</h4>
                      <p className="text-white/70 text-sm">Doors lock, lights activate, recording begins, deterrent measures deployed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Energy Saving */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-white mb-6">Smart Energy Management</h3>
                <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" alt="Smart energy dashboard showing consumption metrics" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">47%</div>
                      <div className="text-sm text-white/70">Energy Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">$180</div>
                      <div className="text-sm text-white/70">Monthly Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">2.3T</div>
                      <div className="text-sm text-white/70">CO2 Reduced</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">98%</div>
                      <div className="text-sm text-white/70">Efficiency</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Away Mode */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-white mb-6">Intelligent Away Mode</h3>
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300" alt="Smart home interface showing automated systems" className="rounded-xl mb-6 w-full h-48 object-cover" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white">All lights turned off</span>
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white">Thermostat set to eco mode</span>
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="text-white">Security system activated</span>
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-white/80">
              Everything you need to know about our smart home solutions.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'faq-1',
                question: 'How long does installation take?',
                answer: 'Most installations are completed in 4-6 hours by our certified technicians. We handle everything from device setup to network configuration, ensuring your system is fully operational before we leave.'
              },
              {
                id: 'faq-2',
                question: 'Is my data secure and private?',
                answer: 'Absolutely. We use end-to-end encryption, local data processing where possible, and never sell your personal information. Your privacy is our priority, and you maintain full control over your data.'
              },
              {
                id: 'faq-3',
                question: 'What happens if my internet goes down?',
                answer: 'Our systems continue to operate locally with offline capabilities. Essential functions like security, lighting, and climate control remain functional. When connectivity returns, everything syncs automatically.'
              },
              {
                id: 'faq-4',
                question: 'Can I integrate with existing smart devices?',
                answer: 'Yes! We support over 500 popular smart home devices and platforms including Google, Amazon Alexa, Apple HomeKit, Philips Hue, Nest, and many more. Our system acts as a central hub for all your devices.'
              }
            ].map((faq) => (
              <Card key={faq.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
                      <ChevronDown 
                        className={`w-6 h-6 text-white transition-transform duration-200 ${
                          openFaq === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 animate-glow">
            <CardContent className="p-0">
              <h2 className="text-5xl font-bold text-white mb-6">Ready to Transform Your Home?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of families already enjoying the benefits of intelligent living. Get started today with our comprehensive smart home solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Start Free Consultation
                </Button>
                <Button variant="outline" className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                  Schedule Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center space-x-8 text-white/60">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Free Installation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Money-Back Guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20 mt-20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-xl">SmartHome</span>
              </div>
              <p className="text-white/70 mb-4">
                Transforming homes with intelligent technology for a better tomorrow.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Smart Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Energy Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Assistant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Monitoring</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Installation Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Troubleshooting</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2025 SmartHome. All rights reserved. Powered by AI and IoT Innovation.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg hover:scale-110 transition-all duration-300 z-50"
      >
        <ArrowUp className="w-6 h-6" />
      </Button>
    </div>
  );
}
