// src/components/public/Footer.jsx
import { Zap, Mail, Phone, MapPin, Linkedin, Twitter, Github, ArrowRight } from 'lucide-react';

const links = {
  Services: ['Web Development', 'Mobile Apps', 'UI/UX Design', 'ERP / CRM', 'AI Integration', 'Cloud Hosting'],
  Company: ['About Us', 'Our Work', 'Careers', 'Blog', 'Press'],
  Industries: ['Education', 'Healthcare', 'Finance', 'Manufacturing', 'Real Estate', 'Retail'],
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      {/* CTA band */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
                Ready to Build Something Great?
              </h3>
              <p className="text-slate-400">
                Let's talk about how AetherSolve can become your long-term tech partner.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="mailto:hello@aethersolve.com"
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-500 transition-colors"
              >
                <Mail size={16} /> Get In Touch
              </a>
              <a
                href="#careers"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
              >
                View Openings <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Zap size={15} className="text-white" fill="white" />
              </div>
              <div>
                <div className="text-white font-display font-bold text-base">AetherSolve</div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase">Technologies</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              Building digital infrastructure that compounds over time. 
              We build, host, maintain, grow, and add AI to your business — permanently.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={13} className="text-brand-400" />
                <a href="mailto:hello@aethersolve.com" className="hover:text-white transition-colors">hello@aethersolve.com</a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone size={13} className="text-brand-400" />
                <a href="tel:+918800000000" className="hover:text-white transition-colors">+91 88000 00000</a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={13} className="text-brand-400" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon size={14} className="text-slate-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
