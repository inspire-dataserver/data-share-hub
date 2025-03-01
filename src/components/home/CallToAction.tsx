
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(document.getElementById("cta") as HTMLElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="cta" 
      className="py-20 relative overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 z-0" />
      
      <div className="container px-4 mx-auto relative z-10">
        <div 
          className={`max-w-4xl mx-auto glass-card p-8 md:p-12 transition-all duration-700 ${
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to unlock the value of data?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join DataHubX today and start discovering premium datasets or monetize your own data resources.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-blue-500/10 animate-pulse-light" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-indigo-500/10 animate-pulse-light" style={{ animationDelay: "1s" }} />
              
              <div className="relative p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-elevation-medium">
                <div className="flex justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$12,500</div>
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    +15.3%
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Dataset Sales</div>
                    <div className="text-sm font-medium">$8,640</div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">API Access</div>
                    <div className="text-sm font-medium">$3,860</div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
