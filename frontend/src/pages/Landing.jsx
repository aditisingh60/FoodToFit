import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import Button from '../components/ui/Button'

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
    <div className="min-h-svh bg-slate-50 flex flex-col justify-between overflow-x-hidden text-slate-800">
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
          <span className="rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
            📊 Complete Calorie & Macro Tracker
          </span>
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

        <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
          {[
            {
              cat: 'Exercise Science',
              title: 'The Science of Muscle Hypertrophy',
              desc: 'Learn how mechanical tension, muscle damage, and metabolic stress dictate muscle growth.',
              read: '6 min read',
            },
            {
              cat: 'Nutrition Science',
              title: 'Circadian Rhythm & Meal Timing',
              desc: 'Why when you eat might be just as crucial as what you eat for metabolic health.',
              read: '5 min read',
            },
            {
              cat: 'Metabolic Health',
              title: 'The Thermic Effect of Food (TEF)',
              desc: 'How your body burns calories during the digestion of different macronutrients.',
              read: '4 min read',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
              <div>
                <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block">{item.cat}</span>
                <h3 className="font-bold text-slate-900 text-lg mt-3 leading-snug">{item.title}</h3>
                <p className="text-slate-500 text-xs mt-2.5 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <span className="text-[11px] font-bold text-slate-400">{item.read}</span>
                <button onClick={() => navigate(user ? '/blog' : '/login')} className="text-xs font-bold text-brand-650 hover:underline">
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold tracking-widest text-brand-450 uppercase">Success Stories</span>
          <h2 className="text-3xl font-extrabold text-white">Join Thousands of Healthy Achievers</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
            {[
              {
                name: 'Courtney',
                text: "I've lost just over 40lbs. It's still a process, but I've learned so much about what I put into my body and am truly so proud of how far I've come.",
              },
              {
                name: 'Rebekah',
                text: "The combination of calorie counting and the macro tracker, as well as walking and running a lot more, helped me to lose over 50 pounds in 9 months.",
              },
              {
                name: 'Arjun',
                text: "Using the tracker to manage my macro balance and logging my meals has completely transformed my daily energy levels. Satiety is easy to manage now.",
              },
            ].map((review, i) => (
              <div key={i} className="bg-slate-800 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                <p className="text-slate-350 text-xs italic leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                  <span className="text-amber-450 text-xs">★★★★★</span>
                  <span className="font-bold text-slate-200 text-xs">— {review.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <h3 className="text-xl font-bold text-emerald-450">Ready to personalize your nutrition?</h3>
            <button
              onClick={() => navigate(user ? '/home' : '/login')}
              className="mt-4 rounded-xl bg-white px-8 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-100 transition shadow-lg cursor-pointer"
            >
              {user ? 'Go to Dashboard' : 'Get Started for Free'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-center text-slate-400 text-xs">
        <p className="font-medium">© {new Date().getFullYear()} FoodToFit. All rights reserved.</p>
        <p className="mt-1">Designed for precision nutrition, fitness habits, and active health.</p>
      </footer>
    </div>
  )
}
