import { Link } from "react-router-dom";
import { Mail, Phone, Linkedin, Twitter } from "lucide-react";
import logo from "@/assets/jtech-logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-background border-2 border-primary-foreground/20">
                <img src={logo} alt="JTech Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold">JTECH</span>
            </div>
            <p className="text-sm opacity-90">
              Your Agile Tech Partner for Growing Businesses
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="opacity-90 hover:opacity-100 transition-opacity">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="opacity-90 hover:opacity-100 transition-opacity">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/about" className="opacity-90 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-90 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="opacity-90">Ongoing Software Development</li>
              <li className="opacity-90">Custom Software Solutions</li>
              <li className="opacity-90">Cloud Infrastructure</li>
              <li className="opacity-90">Technical Consulting</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 opacity-90">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@jtech.com" className="hover:opacity-100 transition-opacity">
                  hello@jtech.com
                </a>
              </li>
              <li className="flex items-center gap-2 opacity-90">
                <Phone className="h-4 w-4" />
                <a href="tel:+1234567890" className="hover:opacity-100 transition-opacity">
                  (123) 456-7890
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} JTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
