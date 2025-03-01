
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Search, ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Datasets", path: "/datasets" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 focus:outline-none"
          aria-label="DataHubX Home"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            D
          </div>
          <span className="text-xl font-semibold">DataHubX</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative group px-4 py-2">
            <button className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Resources <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 glass-morphism hidden group-hover:block animate-fade-in">
              <Link to="/blog" className="block px-4 py-2 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                Blog
              </Link>
              <Link to="/documentation" className="block px-4 py-2 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                Documentation
              </Link>
              <Link to="/api" className="block px-4 py-2 text-sm hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                API
              </Link>
            </div>
          </div>
        </nav>

        {/* Search and CTA - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm" className="group">
            <Search className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
            <span>Search</span>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out pt-20`}
      >
        <nav className="container px-4 mx-auto flex flex-col space-y-4 pb-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
            <div className="px-4 py-3 text-base font-medium">Resources</div>
            <Link to="/blog" className="px-8 py-3 rounded-md text-sm block hover:bg-gray-50 dark:hover:bg-gray-800/30">
              Blog
            </Link>
            <Link to="/documentation" className="px-8 py-3 rounded-md text-sm block hover:bg-gray-50 dark:hover:bg-gray-800/30">
              Documentation
            </Link>
            <Link to="/api" className="px-8 py-3 rounded-md text-sm block hover:bg-gray-50 dark:hover:bg-gray-800/30">
              API
            </Link>
          </div>
          <div className="flex flex-col space-y-3 mt-4">
            <Button variant="outline" className="justify-center">
              <Search className="h-4 w-4 mr-2" />
              <span>Search</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
