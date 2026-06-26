import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 bg-white/70 backdrop-blur-md py-16 mt-24 text-slate-600 font-sans relative z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Main Columns Grid */}
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-5">
          {/* Logo & App Info */}
          <div className="space-y-6 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-base text-white">🥗</span>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">FoodToFit</span>
            </Link>
            
            {/* Store Buttons */}
            <div className="space-y-2">
              {/* App Store */}
              <a
                href="#app-store"
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-white hover:bg-slate-800 transition"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.97.08 2.14-.52 2.81-1.33z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Download on the</span>
                  <span className="text-xs font-bold font-sans">App Store</span>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="#google-play"
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-white hover:bg-slate-800 transition"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3.25c-.28 0-.5.22-.5.5v16.5c0 .28.22.5.5.5h.34l9.16-9.16L5.34 3.25H5zm10.06 8.75l3.22-3.22c.2-.2.2-.51 0-.71l-3.22-3.22-1.07 1.07 2.15 2.15-2.15 2.15 1.07 1.07zm-1.89-6.31l-7.25 7.25h14.5l-7.25-7.25z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Get it on</span>
                  <span className="text-xs font-bold font-sans">Google Play</span>
                </div>
              </a>
            </div>

            {/* App Store Ratings */}
            <div className="space-y-1.5 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500">★</span>
                <span>4.8 App Store</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500">★</span>
                <span>4.7 Google Play</span>
              </div>
            </div>
          </div>

          {/* Column 1: App Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">App Features</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/home" className="text-slate-500 hover:text-brand-600 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-slate-500 hover:text-brand-600 transition">
                  Meal Tracker
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-slate-500 hover:text-brand-600 transition">
                  Water Logger
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="text-slate-500 hover:text-brand-600 transition">
                  Weekly Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Weight Loss Science */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Science & Nutrition</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/blog" className="text-slate-500 hover:text-brand-600 transition">
                  Fitness Blog
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-500 hover:text-brand-600 transition">
                  Hypertrophy Science
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-500 hover:text-brand-600 transition">
                  Circadian Timing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-500 hover:text-brand-600 transition">
                  Microbiome Gut Axis
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Connect</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#community" className="text-slate-500 hover:text-brand-600 transition">
                  Community Hub
                </a>
              </li>
              <li>
                <a href="#support" className="text-slate-500 hover:text-brand-600 transition">
                  Dietitian Team
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-500 hover:text-brand-600 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#feedback" className="text-slate-500 hover:text-brand-600 transition">
                  Send Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#about" className="text-slate-500 hover:text-brand-600 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#press" className="text-slate-500 hover:text-brand-600 transition">
                  Press Room
                </a>
              </li>
              <li>
                <a href="#careers" className="text-slate-500 hover:text-brand-600 transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-500 hover:text-brand-600 transition">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Socials */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-5">
            {/* Facebook */}
            <a href="#fb" className="text-slate-400 hover:text-brand-600 transition" aria-label="Facebook">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#linkedin" className="text-slate-400 hover:text-brand-600 transition" aria-label="LinkedIn">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#instagram" className="text-slate-400 hover:text-brand-600 transition" aria-label="Instagram">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#x" className="text-slate-400 hover:text-brand-600 transition" aria-label="X">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="#yt" className="text-slate-400 hover:text-brand-600 transition" aria-label="YouTube">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.518 12 3.518 12 3.518s-7.52 0-9.388.537a3.003 3.003 0 0 0-2.11 2.108C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.482 12 20.482 12 20.482s7.52 0 9.388-.537a3.003 3.003 0 0 0 2.11-2.108C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Copyright & Legal */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-450">
            <span>&copy; Copyright FoodToFit 2026.</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-brand-600 transition">
                Privacy Notice
              </a>
              <a href="#terms" className="hover:text-brand-600 transition">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
