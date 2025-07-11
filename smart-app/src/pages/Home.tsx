import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home as HomeIcon, Shield, Zap, Brain, Smartphone, Leaf, Star } from "lucide-react";
import Footer from "@/components/footer";
import styles from "./Home.module.css";

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

  const getSectionStyle = (index: number) =>
    activeSection === index ? styles.sectionActive : styles.sectionDefault;

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.mainContainer}>
      {/* Section 1: Hero Section */}
      <section className={styles.heroSection}>
        <p className={styles.heroTagline}>
          Discover Intelligent Living
        </p>
        <div className={styles.heroIcon}>
          <HomeIcon className="text-white text-4xl" />
        </div>
        <h1 className={styles.heroTitle}>
          Welcome to the Future of Living
        </h1>
        <p className={styles.heroDescription}>
          Smart Homes for a Better Tomorrow. Experience intelligent comfort, safety, and energy efficiency in every room with cutting-edge AI and IoT technology.
        </p>
        <div
          className={styles.heroButtonContainer}
          onMouseLeave={() => setActiveSection(null)}
        >
          <div
            className={`${styles.heroButtonSlider} ${
              activeSection === 0 ? styles.heroButtonSliderActive : ""
            }`}
          />
          <button
            onClick={handleLogin}
            className={`${styles.heroButtonLeft} ${
              activeSection === 0
                ? styles.heroButtonLeftActive
                : styles.heroButtonLeftDefault
            } ${styles.heroButtonLeftHover}`}
            onMouseEnter={() => setActiveSection(null)}
          >
            Get Started
          </button>
          <button
            className={`${styles.heroButtonRight} ${
              activeSection === 0
                ? styles.heroButtonRightActive
                : styles.heroButtonRightDefault
            } ${styles.heroButtonRightHover}`}
            onMouseEnter={() => setActiveSection(0)}
            onClick={() => navigate("/feature")}
          >
            Explore Features
          </button>
        </div>
        <div className={styles.heroWave}>
          <svg
            className={styles.heroWaveSvg}
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 100 C360 50 1080 50 1440 100 L1440 100 L0 100 Z"
              fill="url(#wave-gradient)"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
                <stop offset="100%" stopColor="rgba(30, 64, 175, 0.3)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Section 2: Combined Smart Living + Features */}
      <section
        data-index="1"
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className={getSectionStyle(1)}
      >
        <Card className={styles.smartLivingCard}>
          <CardContent className={styles.smartLivingContent}>
            <div className={styles.smartLivingTextContent}>
              <div className={styles.smartLivingTextSection}>
                <h2 className={styles.smartLivingTitle}>
                  Industry 4.0 Smart Living
                </h2>
                <p className={styles.smartLivingDescription}>
                  Industry 4.0 transforms your home into an intelligent ecosystem powered by AI, IoT, and advanced automation. From adaptive lighting to predictive climate control, your space anticipates your needs.
                </p>
                <p className={styles.smartLivingDescription}>
                  Enjoy enhanced comfort, reduced energy costs, and robust security with systems that learn and evolve with your lifestyle, delivering a seamless and sustainable living experience.
                </p>
              </div>
              <div className={styles.smartLivingImageSection}>
                <img
                  src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2x4cmc1b214c2E5NXllMWJnbzlhd2w3NHpza3FnazN0eWZsemY2MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZdOfhOXsOxG8ck7TJ8/giphy.gif"
                  alt="Smart Living Animation"
                  className={styles.smartLivingImage}
                />
              </div>
            </div>

            <div className={styles.featuresGrid}>
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
                  className={`${styles.featureCard} ${styles.animateSlideIn} bg-gradient-to-br ${gradient}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className={styles.featureCardContent}>
                    <div className={styles.featureIcon}>
                      {icon}
                    </div>
                    <h3 className={styles.featureTitle}>{title}</h3>
                    <p className={styles.featureDescription}>{text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Animated Icon Strip */}
      <section
        data-index="2"
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className={`${styles.iconStripSection} group`}
      >
        <h2 className={styles.iconStripTitle}>
          Seamlessly Integrates with Your Favorite Brands
        </h2>
        <p className={styles.iconStripDescription}>
          Our platform ensures effortless compatibility with leading smart home ecosystems, delivering a unified and intuitive experience.
        </p>
        <div className={styles.iconStripContainer}>
          <div className={`${styles.iconStripScroll} ${styles.animateScrollX} group-hover:${styles.pauseAnimation}`}>
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
                className={styles.iconStripIcon}
              >
                {icon}
              </div>
            ))}
          </div>
          <div className={styles.iconStripOverlay} />
        </div>
      </section>

      {/* Section 4: CTA */}
      <section
        data-index="3"
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        className={getSectionStyle(3)}
      >
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>
            Ready to Transform Your Home?
          </h2>
          <p className={styles.ctaDescription}>
            Join thousands of homeowners who have already embraced intelligent living.
          </p>
          <div className={styles.ctaButtonContainer}>
            <Button
              onClick={handleLogin}
              variant="secondary"
              size="lg"
              className={styles.ctaButton}
            >
              Start Your Smart Home Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Section 5: Testimonials */}
      <section
        data-index="4"
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        className={getSectionStyle(4)}
      >
        <div className={styles.testimonialsSection}>
          <h2 className={styles.testimonialsTitle}>
            What Our Users Say
          </h2>
          <div className={styles.testimonialsGrid}>
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
                className={styles.testimonialCard}
              >
                <CardContent className={styles.testimonialContent}>
                  <div className={styles.testimonialStars}>
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`${styles.testimonialStar} ${
                          j < rating ? styles.testimonialStarFilled : styles.testimonialStarEmpty
                        }`}
                      />
                    ))}
                  </div>
                  <p className={styles.testimonialQuote}>{quote}</p>
                  <p className={styles.testimonialName}>{name}</p>
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