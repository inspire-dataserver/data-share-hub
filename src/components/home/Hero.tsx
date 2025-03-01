
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Database, Shield, Server } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background elements - decorative */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-50 dark:opacity-20">
        <div className="w-64 h-64 rounded-full bg-blue-50 dark:bg-blue-900/20 blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 opacity-50 dark:opacity-20">
        <div className="w-64 h-64 rounded-full bg-blue-50 dark:bg-blue-900/20 blur-3xl" />
      </div>
      
      <div className="relative container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-6 animate-fade-in">
            <span className="animate-pulse-light">●</span>
            <span className="ml-2">The marketplace for premium datasets</span>
          </div>
          
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Discover and exchange 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
              {" valuable data"}
            </span>
          </h1>
          
          <p 
            className={`text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            DataHubX is where data providers and consumers connect securely. Find, buy, or sell high-quality datasets for your business or research needs.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Explore Datasets</span>
            </Button>
          </div>
        </div>
        
        <div 
          className={`mt-16 max-w-5xl mx-auto relative transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative glass-card overflow-hidden p-4 sm:p-8">
            {/* Glass card with preview of dashboard/UI */}
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="DataHubX Dashboard" 
              className="rounded-lg shadow-lg w-full"
            />
            
            {/* Floating feature badges */}
            <div className="absolute -top-4 -left-4 transform rotate-6 animate-float">
              <div className="glass-morphism py-2 px-3 rounded-lg shadow-elevation-low flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">10K+ Datasets</span>
              </div>
            </div>
            
            <div className="absolute top-1/4 -right-4 transform -rotate-6 animate-float" style={{ animationDelay: "1s" }}>
              <div className="glass-morphism py-2 px-3 rounded-lg shadow-elevation-low flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Secure Transactions</span>
              </div>
            </div>
            
            <div className="absolute bottom-10 -left-4 transform -rotate-3 animate-float" style={{ animationDelay: "2s" }}>
              <div className="glass-morphism py-2 px-3 rounded-lg shadow-elevation-low flex items-center space-x-2">
                <Server className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">API Access</span>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className={`mt-12 flex justify-center space-x-8 opacity-70 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-70 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">10K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Datasets</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">5K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">98%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
