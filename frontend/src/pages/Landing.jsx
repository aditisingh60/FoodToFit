import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import Button from '../components/ui/Button'
import { BLOGS } from './Blog'

const IMAGES = [
  '/landing_food_1.png',
  '/landing_food_2.png',
  '/landing_food_3.png',
  '/landing_food_4.png',
  '/landing_food_5.png',
  '/landing_food_6.png',
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeArticle, setActiveArticle] = useState(null)

  // Autoplay slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleStart = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-svh bg-secondary flex flex-col justify-between overflow-x-hidden text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-lg">🥗</span>
            </div>
            <span className="text-lg font-bold text-slate-900">FoodToFit</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
              Features
            </a>
            <a href="#science" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
              Nutrition Science
            </a>
            <a href="#testimonials" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
              Success Stories
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/home')}
                className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-600/10 transition cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={handleStart}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-600/10 transition cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-20 lg:py-24 max-w-6xl mx-auto w-full grid md:grid-cols-12 gap-12 items-center flex-1">
        {/* Hero Copy (Left) */}
        <div className="md:col-span-6 space-y-6 text-left">

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            <span className="block animate-hero-title-1">Eat Smarter.</span>
            <span className="block animate-hero-title-2">
              Reach Your <span className="text-brand-600">Fitness Goals</span>.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed">
            FoodToFit automatically calculates your custom BMI, BMR, TDEE, and daily calorie targets. Track meals, log water intake, and build healthy habits with our science-backed tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {user ? (
              <Button onClick={() => navigate('/home')} className="!w-auto px-8 py-3.5 shadow-lg shadow-brand-600/20">
                Go to Dashboard →
              </Button>
            ) : (
              <Button onClick={handleStart} className="!w-auto px-8 py-3.5 shadow-lg shadow-brand-600/20">
                Start Free Trial →
              </Button>
            )}
            <button
              onClick={() => {
                const element = document.getElementById('features')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Explore Features
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-slate-200/60 pt-8 mt-4">
            <div>
              <p className="text-2xl font-black text-slate-900">10k+</p>
              <p className="text-xs text-slate-400 font-medium">Verified Foods</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">98%</p>
              <p className="text-xs text-slate-400 font-medium">Daily Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">Free</p>
              <p className="text-xs text-slate-400 font-medium">To Get Started</p>
            </div>
          </div>
        </div>

        {/* Hero Interactive Phone mockup + Carousel (Right) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-80 sm:w-85 aspect-[9/18.5] rounded-[3rem] border-[10px] border-slate-900 bg-slate-950 shadow-2xl shadow-slate-900/40 overflow-hidden ring-4 ring-slate-800/10">
            {/* Phone Speaker/Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30" />

            {/* Background slider (More than 5 photos) */}
            <div className="absolute inset-0 z-0 select-none">
              {IMAGES.map((img, i) => (
                <div
                  key={img}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                    i === activeSlide ? 'opacity-90' : 'opacity-0'
                  }`}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
              {/* Soft overlay gradient to ensure readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
            </div>

            {/* Dashboard Mockup content */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 pt-8 text-white">
              {/* Mockup Header */}
              <div className="flex items-center justify-between text-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Welcome Back</span>
                  <h4 className="text-sm font-bold text-white">Good Morning, John</h4>
                </div>
                <div className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs">
                  👤
                </div>
              </div>

              {/* Calorie graphic */}
              <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center mt-3">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="6"
                      strokeDasharray={263.8}
                      strokeDashoffset={263.8 * 0.4}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-xl font-black block leading-none">1,587</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block mt-1">kcal left</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 w-full text-center border-t border-white/10 pt-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Protein</span>
                    <span className="font-bold text-emerald-450">75g</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Carbs</span>
                    <span className="font-bold text-orange-400">140g</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Fat</span>
                    <span className="font-bold text-blue-400">42g</span>
                  </div>
                </div>
              </div>

              {/* Logged foods */}
              <div className="flex-1 flex flex-col justify-end gap-2 mt-4">
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-450 block">Logged Today</span>
                
                <div className="bg-slate-900/60 border border-white/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-100">Chicken Salad with Avocado</p>
                    <p className="text-[9px] text-slate-400">Lunch · 320g</p>
                  </div>
                  <span className="font-bold text-emerald-450">430 kcal</span>
                </div>

                <div className="bg-slate-900/60 border border-white/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-100">Berry Protein Shake</p>
                    <p className="text-[9px] text-slate-400">Snack · 450ml</p>
                  </div>
                  <span className="font-bold text-emerald-450">285 kcal</span>
                </div>
              </div>

              {/* Mockup Navigation Bar */}
              <div className="border-t border-white/15 pt-3 mt-4 flex justify-between items-center px-4 text-xs text-slate-400">
                <span className="text-emerald-500 font-bold">🏠</span>
                <span>📅</span>
                <span className="bg-emerald-500 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs">+</span>
                <span>📰</span>
                <span>⚙️</span>
              </div>
            </div>
          </div>

          {/* Carousel dots & thumbnails for selection (More than 5 photos) */}
          <div className="flex gap-2.5 mt-6 justify-center z-10">
            {IMAGES.map((img, idx) => (
              <button
                key={img}
                onClick={() => setActiveSlide(idx)}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeSlide === idx ? 'border-brand-500 scale-110 shadow-md' : 'border-white hover:border-slate-300'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="bg-white border-t border-b border-slate-200/50 py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-6">
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">Features Breakdown</span>
          <h2 className="text-3xl font-extrabold text-slate-950 mt-2">Everything You Need to Fit</h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">
            Our platform provides clean science-backed utilities to manage your food dairy and nutrition schedule.
          </p>
        </div>

        {/* Infinite Marquee Ticker */}
        <div className="relative mt-16 w-full overflow-hidden marquee-mask">
          <div className="animate-marquee-ltr flex gap-8 py-4">
            {[...Array(2)].flatMap(() => [
              {
                image: '/feature_metrics.png',
                title: 'Body Metrics calculator',
                desc: 'Calculate customized BMI, BMR, and TDEE based on age, weight, and fitness targets.',
              },
              {
                image: '/feature_diary.png',
                title: 'Calorie Diary Log',
                desc: 'Easily query foods and log meals. View summaries, carbs, fats, and protein details.',
              },
              {
                image: '/feature_water.png',
                title: 'Water Hydration Log',
                desc: 'Log daily water intake using glass or bottle size presets to hit your 2L target.',
              },
              {
                image: '/feature_trends.png',
                title: 'Weekly Intake Trends',
                desc: 'Check calorie and protein progress charts across the week to keep motivation high.',
              },
            ]).map((feature, i) => (
              <div
                key={i}
                className="group w-80 shrink-0 border border-slate-200/60 rounded-3xl bg-white overflow-hidden hover:border-brand-100 hover:shadow-2xl hover:shadow-brand-100/10 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Content Container */}
                <div className="p-6 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-650 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2.5 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science Blog Section */}
      <section id="science" className="py-20 px-6 max-w-6xl mx-auto w-full text-center">
        <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">Science & Nutrition</span>
        <h2 className="text-3xl font-extrabold text-slate-950 mt-2">Backed By Nutritional Science</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">
          Access high-quality reference guides written by nutritionists and exercise physiologists.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-stretch mt-16 md:-space-x-4 lg:-space-x-6 xl:-space-x-8 max-w-5xl mx-auto gap-y-6 md:gap-y-0 px-4">
          {BLOGS.map((blog, idx) => {
            const themes = [
              { image: '/sci_hypertrophy.png', bg: 'bg-[#2d4a43]' },
              { image: '/sci_meal_timing.png', bg: 'bg-[#dca442]' },
              { image: '/sci_thermic.png', bg: 'bg-[#c85a32]' },
              { image: '/sci_gut_brain.png', bg: 'bg-[#2a353c]' },
            ]
            const theme = themes[idx] || { image: blog.image, bg: 'bg-brand-600' }
            return (
              <div
                key={blog.id}
                onClick={() => setActiveArticle(blog)}
                className={`relative group flex-grow md:flex-1 min-w-[260px] md:min-w-0 rounded-[2rem] p-4 pb-6 transition-all duration-500 ease-out hover:-translate-y-6 hover:scale-[1.03] hover:z-20 hover:shadow-2xl hover:shadow-brand-950/20 cursor-pointer flex flex-col justify-between border border-white/10 shadow-lg ${theme.bg}`}
              >
                <div className="relative aspect-[3/3.8] w-full rounded-2xl overflow-hidden bg-white/5">
                  <img
                    src={theme.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 text-left px-2">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest block mb-2">
                    {blog.category}
                  </span>
                  <h3 className="text-white font-extrabold text-lg leading-snug tracking-tight">
                    {blog.title}
                  </h3>
                  <span className="text-[10px] text-white/55 font-bold block mt-3 uppercase tracking-wider">
                    {blog.readTime}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-[var(--color-secondary)] py-20 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-900 tracking-tight">Stories from our achievers.</h2>
          <p className="text-brand-600 font-medium max-w-2xl mx-auto">
            Every review below is from a real user who trusted us with their health, time, and goals.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[700px] marquee-mask-vertical overflow-hidden relative z-0">
          {/* Column 1 */}
          <div className="animate-marquee-btt flex flex-col gap-6" style={{ animationDuration: '35s' }}>
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex flex-col gap-6 pb-6">
                {[
                  { name: 'Courtney', text: "I've lost just over 40lbs. It's still a process, but I've learned so much about what I put into my body and am truly so proud of how far I've come." },
                  { name: 'Sarah L.', text: "The recipe suggestions are incredible. I've never eaten this well while losing weight." },
                  { name: 'Jason M.', text: "I love how the analytics break down my macro trends. It's incredibly insightful and easy to digest." },
                ].map((review, i) => (
                  <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-brand-100/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex text-amber-400 text-sm mb-4">★★★★★</div>
                    <p className="text-brand-800 leading-relaxed mb-6 font-medium">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{review.name[0]}</div>
                      <span className="font-bold text-brand-900 text-sm">{review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="animate-marquee-ttb flex flex-col gap-6" style={{ animationDuration: '45s' }}>
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex flex-col gap-6 pb-6">
                {[
                  { name: 'Rebekah', text: "The combination of calorie counting and the macro tracker, as well as walking and running a lot more, helped me to lose over 50 pounds in 9 months." },
                  { name: 'Emily R.', text: "FoodToFit's community features keep me accountable. The daily challenges are fun and motivating!" },
                  { name: 'Marcus T.', text: "Finally an app that doesn't feel like a chore. Scanning barcodes makes logging effortless and quick." },
                ].map((review, i) => (
                  <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-brand-100/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex text-amber-400 text-sm mb-4">★★★★★</div>
                    <p className="text-brand-800 leading-relaxed mb-6 font-medium">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{review.name[0]}</div>
                      <span className="font-bold text-brand-900 text-sm">{review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="animate-marquee-btt flex flex-col gap-6" style={{ animationDuration: '40s', animationDelay: '-10s' }}>
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex flex-col gap-6 pb-6">
                {[
                  { name: 'Arjun', text: "Using the tracker to manage my macro balance and logging my meals has completely transformed my daily energy levels. Satiety is easy to manage now." },
                  { name: 'Priya K.', text: "The progress photos feature really helped me see changes the scale wasn't showing. I feel so much healthier." },
                  { name: 'David W.', text: "Best nutrition tracker I've used. The interface is clean, fast, and doesn't push fad diets on you." },
                ].map((review, i) => (
                  <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-brand-100/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex text-amber-400 text-sm mb-4">★★★★★</div>
                    <p className="text-brand-800 leading-relaxed mb-6 font-medium">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{review.name[0]}</div>
                      <span className="font-bold text-brand-900 text-sm">{review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12 text-center flex flex-col items-center">
          <h3 className="text-xl font-bold text-brand-900">Ready to personalize your nutrition?</h3>
          <button
            onClick={() => navigate(user ? '/home' : '/login')}
            className="mt-6 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-extrabold text-white hover:bg-brand-700 transition shadow-lg cursor-pointer hover:-translate-y-1"
          >
            {user ? 'Go to Dashboard' : 'Get Started for Free'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-center text-slate-400 text-xs">
        <p className="font-medium">© {new Date().getFullYear()} FoodToFit. All rights reserved.</p>
        <p className="mt-1">Designed for precision nutrition, fitness habits, and active health.</p>
      </footer>

      {/* Floating Reading Modal Overlay */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Header Image */}
            <div className="relative h-48 bg-slate-200">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute right-6 top-6 rounded-full bg-slate-950/70 backdrop-blur-md p-3 text-white hover:bg-slate-950 hover:scale-105 transition-all cursor-pointer"
                aria-label="Close article"
              >
                ✕
              </button>
              <div className="absolute bottom-8 left-10 right-10 text-white">
                <span className="rounded bg-brand-500/35 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-brand-200 ring-1 ring-brand-300/30">
                  {activeArticle.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-4 leading-tight drop-shadow-sm">{activeArticle.title}</h2>
              </div>
            </div>

            {/* Author info */}
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-6 py-4 bg-slate-50/70 text-sm text-slate-500 font-medium">
              <span>Published: <strong className="text-slate-700">{activeArticle.date}</strong></span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Author: <strong className="text-slate-700">{activeArticle.author}</strong></span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Read Time: <strong className="text-slate-700">{activeArticle.readTime}</strong></span>
            </div>

            {/* Content Body */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 max-h-[55vh] overflow-y-auto leading-relaxed text-slate-650 text-left">
              {activeArticle.content}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end border-t border-slate-100 px-6 py-4 bg-slate-50">
              <button
                onClick={() => setActiveArticle(null)}
                className="rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg transition-all cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
