import { ExternalLink, Mail, Phone, MapPin, Globe } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-university-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* University Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">BITS Pilani</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Work Integrated Learning Programmes (WILP) - Empowering working professionals with quality higher education.
              </p>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Globe className="w-4 h-4" />
                <span>www.bits-pilani.ac.in</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    Academic Calendar
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    Course Catalog
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    Student Handbook
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    Library Resources
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Student Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Student Services</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200"
                  >
                    Academic Support
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200"
                  >
                    Technical Help
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200"
                  >
                    Career Services
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200"
                  >
                    Alumni Network
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-white/80 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>BITS Pilani</p>
                    <p>Pilani - 333031</p>
                    <p>Rajasthan, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+91-1596-242210</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Mail className="w-4 h-4" />
                  <a 
                    href="mailto:mailadmin@wilp.bits-pilani.ac.in"
                    className="hover:text-white transition-colors duration-200"
                  >
                    mailadmin@wilp.bits-pilani.ac.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-white/70 text-sm text-center sm:text-left">
              © {currentYear} Birla Institute of Technology and Science, Pilani. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a 
                href="#" 
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
