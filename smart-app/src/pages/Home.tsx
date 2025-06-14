import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home as HomeIcon, Shield, Zap, Brain, Smartphone, Leaf } from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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
    `transition-all duration-700 ease-in-out w-full mx-auto max-w-7xl my-20 ${
      activeSection === index ? "scale-105 shadow-2xl z-10" : "scale-95 opacity-80"
    }`;

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden flex flex-col items-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjc2cWQyZ2NpNmc4dHZwNGprMTAzZnhwbnA2d2FnbHl1eWx0aGN2OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6Ztrs0GnTt4GkFO0/giphy.gif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Section 1: Hero */}
      <section className="transition-all duration-1000 ease-in-out flex flex-col items-center justify-center text-center rounded-[2rem] shadow-2xl mx-4 mt-32 w-full max-w-[1600px] backdrop-blur-2xl bg-white/70 py-56 px-24">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl flex items-center justify-center mb-6">
          <HomeIcon className="text-white text-3xl" />
        </div>
        <h1 className="text-6xl font-extrabold text-neutral-900 mb-6 leading-tight">
          Welcome to the Future of Living
        </h1>
        <p className="text-2xl text-neutral-700 mb-10 max-w-3xl">
          Smart Homes for a Better Tomorrow. Experience intelligent comfort, safety, and energy efficiency in every room.
        </p>
        <div
          className="relative w-[340px] h-16 rounded-full border-2 border-blue-500 flex overflow-hidden mb-4"
          onMouseLeave={() => setActiveSection(null)}
        >
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-blue-500 transition-transform duration-300 rounded-full ${
              activeSection === 0 ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={handleLogin}
            className={`relative w-1/2 z-10 text-lg font-medium transition-colors duration-300 ${
              activeSection === 0 ? "text-blue-500 bg-transparent" : "text-white"
            }`}
            onMouseEnter={() => setActiveSection(null)}
          >
            Get Started
          </button>
          <button
            className={`relative w-1/2 z-10 text-lg font-medium transition-colors duration-300 ${
              activeSection === 0 ? "text-white" : "text-blue-500 bg-transparent"
            }`}
            onMouseEnter={() => setActiveSection(0)}
          >
            Explore Features
          </button>
        </div>
      </section>
      {/* Section 2: Smart Living */}
      <section
        data-index="1"
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className={sectionStyle(1)}
      >
        <Card className="w-full bg-gradient-to-r from-sky-100 to-blue-50 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl">
          <CardContent className="p-12 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Industry 4.0 Smart Living
              </h2>
              <p className="text-base text-blue-800 mb-3 leading-relaxed">
                In the era of Industry 4.0, smart homes redefine how we live, manage energy, and ensure security.
              </p>
              <p className="text-base text-blue-800 leading-relaxed">
                With IoT, AI, and automation, Smart Homes empower homeowners with real-time control and sustainable living.
              </p>
            </div>
            <div className="flex-1 max-w-[420px]">
              <img
                src="/model.png"
                alt="Smart Home Model"
                className="rounded-xl w-full h-auto object-contain shadow-lg"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Features */}
      <section
        data-index="2"
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className={sectionStyle(2)}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-8">
          {[
            {
              icon: <Shield />,
              title: "Advanced Security",
              gradient: "from-indigo-500 via-purple-500 to-pink-500",
              text: "24/7 monitoring and smart alerts keep your home safe and secure.",
            },
            {
              icon: <Zap />,
              title: "Energy Efficiency",
              gradient: "from-green-400 via-green-500 to-teal-500",
              text: "Automated systems optimize energy usage and reduce costs.",
            },
            {
              icon: <Brain />,
              title: "AI Automation",
              gradient: "from-purple-500 via-violet-600 to-indigo-600",
              text: "Intelligent routines adapt to your lifestyle for ultimate convenience.",
            },
            {
              icon: <Smartphone />,
              title: "Remote Control",
              gradient: "from-yellow-400 via-orange-500 to-red-500",
              text: "Manage your home from anywhere using your smartphone.",
            },
            {
              icon: <Leaf />,
              title: "Eco Friendly",
              gradient: "from-teal-400 via-cyan-500 to-blue-500",
              text: "Sustainable solutions for a greener, smarter home.",
            },
            {
              icon: <HomeIcon />,
              title: "Personalized Comfort",
              gradient: "from-pink-400 via-red-400 to-yellow-400",
              text: "Customizable settings for lighting, climate, and more.",
            },
          ].map(({ icon, title, gradient, text }, i) => (
            <Card
              key={i}
              className={`transition-transform duration-300 hover:scale-105 shadow-xl rounded-xl overflow-hidden border-2 border-white/20 bg-gradient-to-br ${gradient}`}
            >
              <CardContent className="p-6 text-white text-center">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 drop-shadow-md">{title}</h3>
                <p className="drop-shadow-sm">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full mt-12 px-6">
          <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-cyan-800 text-white shadow-xl p-12 border border-white/30 backdrop-blur-2xl">
            <h2 className="text-3xl font-bold mb-4 text-green-100 drop-shadow-xl text-center">
              Ready to Transform Your Home?
            </h2>
            <p className="text-xl mb-6 text-center text-white/90">
              Join thousands of homeowners who have already embraced intelligent living.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleLogin}
                variant="secondary"
                size="lg"
                className="bg-white text-green-700 hover:bg-white/90 px-8 py-3 text-lg rounded-full shadow-md"
              >
                Start Your Smart Home Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="w-full bg-neutral-900 mt-16">
        <Footer />
      </div>
    </div>
  );
}
