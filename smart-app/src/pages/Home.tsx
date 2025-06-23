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
} from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const navigate = useNavigate();

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
      { threshold: 0.5 }
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

  const sectionStyle = (index: number) =>
    `transition-all duration-700 ease-in-out w-full mx-auto max-w-7xl my-8 ${
      activeSection === index ? "scale-105 shadow-2xl z-10" : "scale-95 opacity-90"
    }`;

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden flex flex-col items-center bg-fixed bg-gradient-to-b from-indigo-950 via-purple-950 to-blue-900"
      style={{
        backgroundImage:
          "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExenBzOGJnaTJhN2Z1YnNpaDVqNjlrZTZ5a3JrcDlia2R1NDc1NnY4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FpBO8EpaM3X0nIDeBH/giphy.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Section 1: Hero */}
      <section
        className="transition-all duration-1000 ease-in-out flex flex-col items-center justify-center text-center rounded-[2rem] mt-[2px] mx-2 w-full max-w-[1800px] bg-gradient-to-b from-purple-900 to-blue-900 py-56 px-24 mb-48 border-2 border-purple-400/30 shadow-2xl relative overflow-hidden animate-glow"
      >
        <p className="text-lg text-purple-200 font-semibold mb-4 tracking-wide">
          Discover Intelligent Living
        </p>
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
          <HomeIcon className="text-white text-4xl" />
        </div>
        <h1 className="text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
          Welcome to the Future of Living
        </h1>
        <p className="text-2xl text-white/90 mb-10 max-w-3xl font-medium">
          Smart Homes for a Better Tomorrow. Experience intelligent comfort, safety, and energy efficiency in every room with cutting-edge AI and IoT technology.
        </p>
        <div
          className="relative w-[360px] h-16 rounded-full border-2 border-purple-400 flex overflow-hidden mb-4 bg-gradient-to-r from-purple-500 to-cyan-400"
          onMouseLeave={() => setActiveSection(null)}
        >
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-purple-600 to-cyan-500 transition-transform duration-300 rounded-full ${
              activeSection === 0 ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={handleLogin}
            className={`relative w-1/2 z-10 text-lg font-semibold transition-all duration-300 
              ${
                activeSection === 0
                  ? "text-purple-300 bg-gradient-to-r from-cyan-500 to-purple-500"
                  : "text-white bg-gradient-to-r from-purple-600 to-cyan-600"
              }
              hover:from-purple-400 hover:to-cyan-400 hover:text-white shadow-md rounded-full h-full`}
            onMouseEnter={() => setActiveSection(null)}
            style={{
              borderRight: "1px solid rgba(192,132,252,0.3)",
              borderRadius: "9999px 0 0 9999px",
            }}
          >
            Get Started
          </button>
          <button
            className={`relative w-1/2 z-10 text-lg font-semibold transition-all duration-300 
              ${
                activeSection === 0
                  ? "text-white bg-gradient-to-r from-cyan-600 to-purple-600"
                  : "text-purple-300 bg-gradient-to-r from-purple-400 to-cyan-400"
              }
              hover:from-cyan-500 hover:to-purple-500 hover:text-white shadow-md rounded-full h-full`}
            onMouseEnter={() => setActiveSection(0)}
            onClick={() => navigate("/feature")}
            style={{
              borderLeft: "1px solid rgba(192,132,252,0.3)",
              borderRadius: "0 9999px 9999px 0",
            }}
          >
            Explore Features
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 100 C360 50 1080 50 1440 100 L1440 100 L0 100 Z"
              fill="url(#wave-gradient)"
              className="animate-wave"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
                <stop offset="100%" stopColor="rgba(30, 64, 175, 0.3)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <style>
          {`
            @keyframes glow {
              0% { box-shadow: 0 0 10px rgba(192, 132, 252, 0.5); }
              50% { box-shadow: 0 0 20px rgba(192, 132, 252, 0.7); }
              100% { box-shadow: 0 0 10px rgba(192, 132, 252, 0.5); }
            }
            .animate-glow {
              animation: glow 3s ease-in-out infinite;
            }
            @keyframes pulse-glow {
              0% { text-shadow: 0 0 5px rgba(192, 132, 252, 0.5); }
              50% { text-shadow: 0 0 10px rgba(192, 132, 252, 0.7); }
              100% { text-shadow: 0 0 5px rgba(192, 132, 252, 0.5); }
            }
            .animate-pulse-glow:hover {
              animation: pulse-glow 1.5s ease-in-out infinite;
            }
            @keyframes wave {
              0% { transform: translateY(0); }
              50% { transform: translateY(10px); }
              100% { transform: translateY(0); }
            }
            .animate-wave {
              animation: wave 4s ease-in-out infinite;
            }
          `}
        </style>
      </section>

      {/* Section 2: Combined Smart Living + Features */}
      <section
        data-index="1"
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className={sectionStyle(1)}
      >
        <Card className="w-full max-w-[95%] mx-auto bg-gradient-to-r from-purple-900 to-blue-900 border-[2px] border-purple-400/30 shadow-2xl rounded-3xl relative overflow-hidden">
          <CardContent className="py-16 px-12 flex flex-col items-center gap-12 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
              <div className="flex-1">
                <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
                  Industry 4.0 Smart Living
                </h2>
                <p className="text-lg text-white/90 mb-6 leading-relaxed font-medium">
                  Industry 4.0 transforms your home into an intelligent ecosystem powered by AI, IoT, and advanced automation. From adaptive lighting to predictive climate control, your space anticipates your needs.
                </p>
                <p className="text-lg text-white/90 leading-relaxed font-medium">
                  Enjoy enhanced comfort, reduced energy costs, and robust security with systems that learn and evolve with your lifestyle, delivering a seamless and sustainable living experience.
                </p>
              </div>
              <div className="flex-1 max-w-[420px]">
                <img
                  src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2x4cmc1b214c2E5NXllMWJnbzlhd2w3NHpza3FnazN0eWZsemY2MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZdOfhOXsOxG8ck7TJ8/giphy.gif"
                  alt="Smart Living Animation"
                  className="rounded-xl w-full h-auto object-contain shadow-xl border border-purple-400/30 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(192,132,252,0.5)]"
                />
              </div>
            </div>

            <div className="w-full my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="text-white" />,
                  title: "Advanced Security",
                  gradient: "from-purple-600 via-indigo-600 to-blue-600",
                  text: "24/7 monitoring with AI-driven alerts and smart locks ensures your home is always protected.",
                },
                {
                  icon: <Zap className="text-white" />,
                  title: "Energy Efficiency",
                  gradient: "from-purple-500 via-teal-500 to-cyan-500",
                  text: "Optimize energy use with automated lighting and climate control, saving costs sustainably.",
                },
                {
                  icon: <Brain className="text-white" />,
                  title: "AI Automation",
                  gradient: "from-purple-600 via-violet-600 to-indigo-600",
                  text: "AI learns your routines, automating tasks for convenience and efficiency tailored to you.",
                },
                {
                  icon: <Smartphone className="text-white" />,
                  title: "Remote Control",
                  gradient: "from-purple-500 via-pink-500 to-red-500",
                  text: "Control lights, locks, and more from anywhere using your smartphone or voice assistant.",
                },
                {
                  icon: <Leaf className="text-white" />,
                  title: "Eco Friendly",
                  gradient: "from-purple-500 via-cyan-500 to-blue-500",
                  text: "Green technology reduces your carbon footprint with energy-efficient, sustainable solutions.",
                },
                {
                  icon: <HomeIcon className="text-white" />,
                  title: "Personalized Comfort",
                  gradient: "from-purple-500 via-red-500 to-pink-500",
                  text: "Customize lighting, temperature, and ambiance to create your perfect living environment.",
                },
              ].map(({ icon, title, gradient, text }, index) => (
                <Card
                  key={index}
                  className={`transition-transform duration-500 hover:scale-105 hover:shadow-lg rounded-xl overflow-hidden border-2 border-purple-400/30 bg-gradient-to-br ${gradient} animate-slide-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-white text-center h-[180px] flex flex-col justify-center">
                    <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      {icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 drop-shadow-md">{title}</h3>
                    <p className="text-sm drop-shadow-sm px-2 font-medium">{text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <style>
            {`
              @keyframes slide-in {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .animate-slide-in {
                animation: slide-in 0.5s ease-out forwards;
              }
            `}
          </style>
        </Card>
      </section>

      {/* Section 3: Animated Icon Strip */}
      <section
        data-index="2"
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="w-screen border-y border-purple-400/30 py-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800 text-white shadow-2xl backdrop-blur-3xl my-8 relative overflow-hidden"
      >
        <h2 className="text-4xl font-extrabold mb-4 text-center tracking-tight">
          Seamlessly Integrates with Your Favorite Brands
        </h2>
        <p className="text-lg mb-12 text-center text-white/90 font-medium max-w-3xl mx-auto">
          Our platform ensures effortless compatibility with leading smart home ecosystems, delivering a unified and intuitive experience.
        </p>
        <div className="relative w-full overflow-hidden h-36 group">
          <div
            className="absolute flex gap-12 animate-scroll-x items-center h-full px-12 whitespace-nowrap group-hover:pause-animation"
            style={{ animationDelay: "-22.5s" }} // Start in the middle of the animation
          >
            {[
              "🍎", "📱", "🔒", "🌿", "📡",
              "💡", "🎛️", "📶", "🎧", "📷",
              "🛋️", "🎛️", "🧠", "🌐", "🔌",
              "🏠", "🔋", "🔔", "📱", "💻",
              "🖥️", "🔊", "🎥", "🛠️", "🌍",
              "🕰️", "🔧", "📲", "💨", "🖼️",
              "🍎", "📱", "🔒", "🌿", "📡",
              "💡", "🎛️", "📶", "🎧", "📷",
              "🛋️", "🎛️", "🧠", "🌐", "🔌",
              "🏠", "🔋", "🔔", "📱", "💻",
              "🖥️", "🔊", "🎥", "🛠️", "🌍",
              "🕰️", "🔧", "📲", "💨", "🖼️"
            ].map((icon, index) => (
              <div
                key={index}
                className="text-4xl bg-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md border border-purple-400/30 transform hover:scale-110 transition-all duration-300"
              >
                {icon}
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-900/50 via-transparent to-blue-800/50 pointer-events-none" />
        </div>
        <style>
          {`
            @keyframes scroll-x {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-scroll-x {
              animation: scroll-x 45s linear infinite;
            }
            .group:hover .pause-animation {
              animation-play-state: paused;
            }
            section[data-index="2"] {
              transform: translateY(0);
              transition: transform 0.3s ease-out;
            }
          `}
        </style>
      </section>

      {/* Section 4: CTA */}
      <section
        data-index="3"
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        className={sectionStyle(3)}
      >
        <div className="rounded-3xl bg-gradient-to-br from-purple-900 to-blue-800 text-white shadow-xl p-12 py-32 border border-purple-400/30 backdrop-blur-3xl min-h-[500px] flex flex-col justify-center relative overflow-hidden">
          <h2 className="text-4xl font-extrabold mb-4 text-purple-200 drop-shadow-xl text-center tracking-tight">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl mb-8 text-center text-white/90 font-medium max-w-2xl mx-auto">
            Join thousands of homeowners who have already embraced intelligent living.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={handleLogin}
              variant="secondary"
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 px-10 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Start Your Smart Home Journey
            </Button>
          </div>
          <style>
            {`
              @keyframes particle {
                0% { background-position: 0 0; }
                100% { background-position: 20px 20px; }
              }
              .animate-particle {
                animation: particle 10s linear infinite;
              }
            `}
          </style>
        </div>
      </section>

      {/* Section 5: Testimonials */}
      <section
        data-index="4"
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        className={sectionStyle(4)}
      >
        <div className="w-full max-w-[95%] mx-auto bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-2xl border-[2px] border-purple-400/30 shadow-2xl rounded-3xl py-16 px-12">
          <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                quote: "This smart home system has transformed my daily life. The AI automation is seamless and intuitive!",
                rating: 5,
              },
              {
                name: "Samantha Lee",
                quote: "I love the energy efficiency features. My bills are lower, and I feel good about being eco-friendly.",
                rating: 4,
              },
              {
                name: "Michael Chen",
                quote: "Controlling my home from my phone is a game-changer. The integration with my devices is flawless.",
                rating: 5,
              },
            ].map(({ name, quote, rating }, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 backdrop-blur-md border-2 border-purple-400/30 rounded-xl transition-transform duration-500 hover:scale-105"
              >
                <CardContent className="p-6 text-white flex flex-col items-center">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-5 h-5 ${
                          j < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-white/90 mb-4 text-center font-medium">{quote}</p>
                  <p className="text-lg font-semibold text-purple-200">{name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
