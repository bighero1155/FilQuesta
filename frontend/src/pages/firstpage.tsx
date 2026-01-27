import React, { useEffect, useRef, useState, useCallback } from "react";
import FallingLeaves from "../styles/FallingLeaves";
import FilQuesta from "../styles/FilQuesta";
import EduQuestLandingCSS from "../styles/EduQuestLandingCSS";

const EduQuestLanding: React.FC = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const heroRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute("data-section");
          if (targetId) {
            setIsVisible((prev) => ({ ...prev, [targetId]: true }));
          }
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observerRef.current?.observe(section));

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;

          if (heroRef.current) {
            heroRef.current.style.transform = `translateY(${rate}px)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  const startAdventure = useCallback(() => {
    window.location.href = "/intro";
  }, []);

  const features = [
    {
      icon: "🎯",
      title: "Personalized Learning",
      description:
        "AI-powered adaptive learning paths that adjust to your pace and learning style, ensuring maximum retention and engagement.",
    },
    {
      icon: "🏆",
      title: "Gamified Experience",
      description:
        "Earn badges, complete quests, and level up your knowledge while having fun on your educational journey.",
    },
    {
      icon: "👥",
      title: "Community Learning",
      description:
        "Connect with fellow learners, join study groups, and collaborate on projects in our vibrant learning community.",
    },
    {
      icon: "📚",
      title: "Expert Content",
      description:
        "Access courses created by industry experts and renowned educators from top universities worldwide.",
    },
    {
      icon: "📱",
      title: "Learn Anywhere",
      description:
        "Seamless cross-platform experience. Continue your learning journey on any device, anytime, anywhere.",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Detailed analytics and insights help you understand your learning patterns and optimize your study time.",
    },
  ];

  const testimonials = [
    {
      text: "FilQuesta transformed my career! The personalized learning paths helped me master new skills in just 3 months.",
      author: "MR Manuel Dorde, Student",
    },
    {
      text: "The gamified approach made learning addictive. I found myself looking forward to each lesson!",
      author: "Tristan Vic, Student",
    },
    {
      text: "Incredible platform with top-notch content. I Can Access Ans Interact Using low Spec Devices!",
      author: "Rafael Ramos, Student",
    },
  ];

  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <EduQuestLandingCSS />

      <FallingLeaves />

      <section className="hero-section" ref={heroRef}>

        <FilQuesta />
        <br />
        <br />
        <button className="start-button floating" onClick={startAdventure}>
          Start Adventure
        </button>

        <div className="scroll-indicator">
          <p>Scroll down to explore</p>
          <div className="scroll-down-arrow"></div>
        </div>
      </section>

      {/* Everything else unchanged */}
      <section className="content-section">
        <div className="container">
          <h2 className="section-title">Why Choose FilQuesta?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${
                  isVisible[`feature-${index}`] ? "visible" : ""
                }`}
                data-section={`feature-${index}`}
              >
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Learners Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card ${
                  isVisible[`testimonial-${index}`] ? "visible" : ""
                }`}
                data-section={`testimonial-${index}`}
              >
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-author">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">
            Join thousands of learners who are already transforming their lives
          </p>
          <button className="start-button" onClick={startAdventure}>
            Begin Your Quest Today
          </button>
        </div>
      </section>

      <footer className="footer">
        {/* <div className="footer-links">
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Courses</a>
          <a href="#" className="footer-link">Community</a>
          <a href="#" className="footer-link">Support</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div> */}
        <p className="footer-text">
          &copy; 2025 FilQuesta. All rights reserved. Empowering learners worldwide.
        </p>
      </footer>
    </div>
  );
};

export default EduQuestLanding;
