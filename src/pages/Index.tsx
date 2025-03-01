
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, ShieldCheck, DollarSign } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Data Marketplace for <span className="text-blue-600">Everyone</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-10">
            Buy and sell high-quality datasets securely. From spreadsheets to PDFs,
            find the data you need or monetize your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              onClick={() => navigate("/datasets")}
              className="text-lg"
            >
              Explore Datasets
            </Button>
            {!user ? (
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg"
              >
                Sign Up Free
              </Button>
            ) : (
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/upload-dataset")}
                className="text-lg"
              >
                Sell Your Data
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DataHubX</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Datasets</h3>
              <p className="text-gray-600">
                Access a wide range of structured and unstructured data in various formats.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Buy and sell with confidence through our secure payment system.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Preview</h3>
              <p className="text-gray-600">
                Preview samples before purchasing to ensure quality and relevance.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Monetize Your Data</h3>
              <p className="text-gray-600">
                Turn your valuable data into a passive income stream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">For Buyers</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Browse our marketplace for datasets
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Preview samples to ensure quality
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Purchase and download instantly
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Leave reviews to help others
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">For Sellers</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Upload your datasets in multiple formats
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Set competitive pricing
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Provide samples to attract buyers
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Earn passive income from sales
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Platform Benefits</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Secure transactions and data transfer
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  User ratings and reviews for trust
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Category filtering for easy discovery
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">•</span>
                  Automated AI pricing suggestions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Join our growing community of data buyers and sellers today.
            Find the data you need or monetize your existing datasets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate("/datasets")}
              className="text-lg"
            >
              Explore Datasets
            </Button>
            {!user ? (
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent border-white hover:bg-white/10 text-lg"
                onClick={() => navigate("/auth")}
              >
                Create Account
              </Button>
            ) : (
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent border-white hover:bg-white/10 text-lg"
                onClick={() => navigate("/profile")}
              >
                Go to Profile
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">DataHubX</h2>
              <p className="text-gray-400 mt-2">The marketplace for all your data needs</p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <a href="#" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DataHubX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
