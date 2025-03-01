
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, CreditCard, Download, Users } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  role: "seller" | "buyer";
}

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState<"seller" | "buyer">("buyer");
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

    observer.observe(document.getElementById("how-it-works") as HTMLElement);

    return () => observer.disconnect();
  }, []);

  const steps: Step[] = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload your datasets",
      description: "Easily upload your data files (CSV, Excel, PDF, JSON) and add metadata to help buyers find them.",
      color: "bg-blue-500 text-white",
      role: "seller",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Set pricing & access",
      description: "Choose flexible pricing options and access control levels that work for your data.",
      color: "bg-purple-500 text-white",
      role: "seller",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Receive payments",
      description: "Get paid securely through our platform every time someone purchases your dataset.",
      color: "bg-green-500 text-white",
      role: "seller",
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Search for datasets",
      description: "Easily find relevant datasets using our powerful search and filtering options.",
      color: "bg-blue-500 text-white",
      role: "buyer",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Preview before purchase",
      description: "Check sample data and verify quality before committing to purchase.",
      color: "bg-purple-500 text-white",
      role: "buyer",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Download & use",
      description: "Instantly access purchased datasets and integrate them into your workflows.",
      color: "bg-green-500 text-white",
      role: "buyer",
    },
  ];

  const filteredSteps = steps.filter((step) => step.role === activeRole);

  return (
    <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Seamless experience for both data providers and consumers
          </p>
          
          <div className="mt-8 inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeRole === "buyer"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveRole("buyer")}
            >
              For Buyers
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeRole === "seller"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveRole("seller")}
            >
              For Sellers
            </button>
          </div>
        </div>
        
        <div 
          className={`max-w-4xl mx-auto transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>
            
            {filteredSteps.map((step, index) => (
              <div 
                key={index} 
                className="relative z-10 flex items-start mb-12 last:mb-0"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`flex-shrink-0 w-24 h-24 rounded-2xl ${step.color} flex items-center justify-center shadow-lg`}>
                  {step.icon}
                </div>
                <div className="ml-8 pt-3">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <span>{activeRole === "buyer" ? "Find Datasets" : "Start Selling"}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
