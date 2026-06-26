import { useEffect, useRef, useState } from 'react'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

const IMAGES = [
  '/landing_food_1.png',
  '/landing_food_2.png',
  '/landing_food_3.png',
  '/landing_food_4.png',
  '/landing_food_5.png',
  '/landing_food_6.png',
]

const BLOGS = [
  {
    id: 1,
    title: 'The Science of Muscle Hypertrophy',
    subtitle: 'How mechanical tension, muscle damage, and metabolic stress dictate muscle growth.',
    category: 'Exercise Science',
    readTime: '6 min read',
    image: '/blog_hypertrophy.png',
    author: 'Dr. Marcus Vance, PhD',
    date: 'June 21, 2026',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          Muscle hypertrophy—the growth of muscle cells—is not a simple consequence of lifting heavy objects. It is a highly coordinated physiological response triggered by cellular stress. Exercise science identifies three primary drivers that stimulate muscle adaptations: mechanical tension, muscle damage, and metabolic stress.
        </p>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">1. Mechanical Tension</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          Mechanical tension is widely considered the most critical driver of hypertrophy. It occurs when a muscle is forced to produce force against a load through a range of motion. Mechanoreceptors on muscle fibers detect this stretch-tension state and convert mechanical force into biochemical signals (a process known as mechanotransduction), initiating protein synthesis.
        </p>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">2. Microscopic Muscle Damage</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          When lifting heavy or executing slow eccentric actions, microscopic tears occur within the muscle fibers (sarcomeres). This damage triggers an inflammatory response, activating immune cells like macrophages and satellite cells. These satellite cells fuse to the damaged fibers, donating their nuclei and facilitating structural repair and hypertrophy.
        </p>
        <blockquote className="border-l-4 border-brand-500 pl-6 py-2.5 italic text-slate-650 text-base bg-brand-50/60 rounded-r-2xl my-6">
          "Progressive overload—continually increasing the mechanical load over time—remains the golden rule for triggering long-term hypertrophic changes."
        </blockquote>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">3. Metabolic Stress</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          Metabolic stress is the result of anaerobic glycolysis during high-repetition workouts (typically 8–12 reps to failure). The accumulation of metabolites like lactate, hydrogen ions, and inorganic phosphate leads to cellular swelling, acute hormonal release (growth hormone and IGF-1), and activation of hypertrophic signaling pathways (like mTOR).
        </p>
        <div className="mt-10 border-t border-slate-100 pt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scientific References</span>
          <ol className="list-decimal pl-5 text-xs text-slate-500 mt-3 space-y-1.5">
            <li>Schoenfeld, B. J. (2010). The mechanisms of muscle hypertrophy and their application to resistance training. Journal of Strength and Conditioning Research.</li>
            <li>Rhea, M. R., et al. (2003). A meta-analysis to determine the dose response for strength development. Medicine & Science in Sports & Exercise.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: 'Circadian Rhythm & Meal Timing',
    subtitle: 'Why when you eat might be just as crucial as what you eat for metabolic health.',
    category: 'Nutrition Science',
    readTime: '5 min read',
    image: '/blog_meal_timing.png',
    author: 'Sarah Chen, MS, RD',
    date: 'June 18, 2026',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          Your body operates on a master clock—the circadian rhythm—controlled by the suprachiasmatic nucleus in the brain. This master clock synchronizes peripheral clocks in organs like the liver, pancreas, and gut. Ingestion of food acts as a major cue that adjusts these peripheral clocks, meaning meal timing directly governs digestion, hormone secretion, and insulin sensitivity.
        </p>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">Morning vs. Evening Insulin Sensitivity</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          Evolutionarily, humans are optimized to process nutrients during daylight hours. Research shows that glucose tolerance and insulin sensitivity peak in the morning and decrease as the day progresses. When you consume large, carb-heavy meals late at night, the pancreas produces insulin less efficiently, leading to prolonged elevated blood glucose levels and increased fat storage.
        </p>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">Time-Restricted Feeding (TRF)</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          Aligning food intake with an 8 to 10-hour window during daytime hours (e.g., 9:00 AM to 6:00 PM) allows the body to spend 14–16 hours in a fasted state. This fasting period triggers autophagy (cellular cleanup), reduces systemic inflammation, improves lipid profiles, and optimizes gut health by allowing the gut lining to repair overnight.
        </p>
        <blockquote className="border-l-4 border-brand-500 pl-6 py-2.5 italic text-slate-650 text-base bg-brand-50/60 rounded-r-2xl my-6">
          "Eating in sync with your circadian rhythm improves metabolic flexibility, reducing the risk of insulin resistance and type-2 diabetes."
        </blockquote>
        <div className="mt-10 border-t border-slate-100 pt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scientific References</span>
          <ol className="list-decimal pl-5 text-xs text-slate-500 mt-3 space-y-1.5">
            <li>Panda, S. (2016). Circadian physiology of metabolism. Science Translational Medicine.</li>
            <li>Garaulet, M., et al. (2013). Timing of food intake predicts weight loss effectiveness. International Journal of Obesity.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: 'The Thermic Effect of Food (TEF)',
    subtitle: 'How your body burns calories during the digestion of different macronutrients.',
    category: 'Metabolic Health',
    readTime: '4 min read',
    image: '/blog_thermic_effect.png',
    author: 'Dr. David Foster, MD',
    date: 'June 15, 2026',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          When we calculate daily calorie expenditure, we often focus on BMR (Basal Metabolic Rate) and exercise. However, another crucial factor is the Thermic Effect of Food (TEF)—the energy required to digest, absorb, transport, and store nutrients from the foods we consume.
        </p>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">Macronutrient Differences in TEF</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          Not all calories are processed the same way. The molecular structure of different macronutrients determines how much energy is spent breaking them down:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 space-y-3 mt-3">
          <li><strong>Protein:</strong> Has the highest TEF, ranging from <strong>20% to 30%</strong>. This means if you eat 100 calories of protein, your body uses 20–30 calories just to digest it.</li>
          <li><strong>Carbohydrates:</strong> Have a TEF of <strong>5% to 15%</strong>. Fibrous carbs have a higher TEF than processed sugars.</li>
          <li><strong>Fats:</strong> Have the lowest TEF of <strong>0% to 3%</strong> because they are extremely easy for the digestive tract to process and store.</li>
        </ul>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">Metabolic Advantage of High Protein</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          Due to protein's high thermic effect, a high-protein diet offers a metabolic advantage. Consuming a higher protein ratio increases your daily metabolic rate, preserves lean muscle mass during a calorie deficit, and triggers satiety hormones (like PYY and GLP-1) to reduce hunger signals.
        </p>
        <div className="mt-10 border-t border-slate-100 pt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scientific References</span>
          <ol className="list-decimal pl-5 text-xs text-slate-500 mt-3 space-y-1.5">
            <li>Westerterp, K. R. (2004). Diet induced thermogenesis. Nutrition & Metabolism.</li>
            <li>Halton, T. L., & Hu, F. B. (2004). The effects of high protein diets on thermogenesis, satiety and weight loss: a critical review. Journal of the American College of Nutrition.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: 'The Microbiome Gut-Brain Axis',
    subtitle: 'The bidirectional communication network linking your digestive tract and mental fitness.',
    category: 'Cognitive Health',
    readTime: '7 min read',
    image: '/blog_gut_brain.png',
    author: 'Prof. Elena Rostova',
    date: 'June 10, 2026',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          Have you ever felt "butterflies" in your stomach when nervous? This is the gut-brain axis in action. Your gastrointestinal tract and your brain are constantly communicating through a complex highway involving the vagus nerve, immune chemicals, and neurotransmitters.
        </p>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">The Second Brain in Your Gut</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          The gut is lined with the Enteric Nervous System (ENS), containing over 100 million neurons. In fact, approximately <strong>90% of the body's serotonin</strong>—the neurotransmitter responsible for mood stability, sleep, and happiness—is synthesized in the gut, facilitated by beneficial gut bacteria.
        </p>
        <h4 className="text-xl font-bold text-slate-900 mt-8 mb-3">Microbiome Diversity and Mood</h4>
        <p className="text-base text-slate-600 leading-relaxed">
          A diverse microbiome (rich in Lactobacillus, Bifidobacterium, and other gut strains) produces short-chain fatty acids (SCFAs) like butyrate, which maintain the gut barrier and cross the blood-brain barrier to promote brain plasticity and reduce neuroinflammation. Diets high in ultra-processed foods damage this diversity, while whole foods, prebiotics (garlic, onions, oats), and fermented foods (yogurt, kimchi) nourish it.
        </p>
        <blockquote className="border-l-4 border-brand-500 pl-6 py-2.5 italic text-slate-650 text-base bg-brand-50/60 rounded-r-2xl my-6">
          "What we feed our gut bacteria directly dictates the chemical balances in our brain, influencing anxiety levels, focus, and long-term cognitive health."
        </blockquote>
        <div className="mt-10 border-t border-slate-100 pt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scientific References</span>
          <ol className="list-decimal pl-5 text-xs text-slate-500 mt-3 space-y-1.5">
            <li>Cryan, J. F., & Dinan, T. G. (2012). Mind-altering microorganisms: the impact of the gut microbiota on brain and behaviour. Journal of Scientific Research.</li>
            <li>Foster, J. A., & Neufeld, K. A. M. (2013). Gut-brain axis: how the microbiome influences anxiety and depression. Trends in Neurosciences.</li>
          </ol>
        </div>
      </div>
    )
  }
]

const REVIEWS = [
  {
    id: 1,
    name: 'Courtney',
    rating: 5,
    avatar: '/avatar_courtney.png',
    text: "I've lost just over 40lbs. It's still a process, but I've learned so much about what I put into my body and am truly so proud of how far I've come."
  },
  {
    id: 2,
    name: 'Karen',
    rating: 5,
    avatar: '/avatar_karen.png',
    text: "I have lost 34 lbs and though I'm not at my weight goal yet, I am feeling so much healthier! This app is easy to use and has made calorie counting a breeze."
  },
  {
    id: 3,
    name: 'Rebekah',
    rating: 5,
    avatar: '/avatar_rebekah.png',
    text: "The combination of calorie counting and the macro tracker, as well as walking and running a lot more, helped me to lose over 50 pounds in 9 months. My family members notice the change and ask how I did it, and I always point them to FoodToFit!"
  },
  {
    id: 4,
    name: 'Arjun',
    rating: 5,
    avatar: '/avatar_arjun.png',
    text: "Using the tracker to manage my macro balance and logging my meals has completely transformed my daily energy levels. The science-backed blog has also helped me understand the 'why' behind my fitness plan."
  }
]

// Custom scroll reveal element component
function ScrollRevealSection({ children }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const elementRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const current = elementRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-out transform ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
    >
      {children}
    </div>
  )
}

export default function Blog() {
  const [activeBlog, setActiveBlog] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  // Autoplay slider every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % REVIEWS.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
  }

  const visibleReviews = [
    REVIEWS[activeIndex],
    REVIEWS[(activeIndex + 1) % REVIEWS.length],
    REVIEWS[(activeIndex + 2) % REVIEWS.length]
  ]

  // Smooth scroll to top when mounting the page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-svh bg-transparent">
      <Navbar />

      {/* Banner / Parallax Header */}
      <section className="relative overflow-hidden py-36 sm:py-44 text-center text-white shadow-inner">
        {/* Background slider */}
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
          {/* Dark overlay to ensure text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/65 via-slate-950/75 to-slate-900/65 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <span className="rounded-full bg-white/15 px-5 py-2 text-xs font-extrabold uppercase tracking-widest text-brand-100 ring-1 ring-white/20 backdrop-blur-md">
            SCIENCE & NUTRITION BLOG
          </span>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-lg leading-none">
            Discover Nutrition & Beyond
          </h1>
          <p className="mt-8 text-base sm:text-lg md:text-xl text-brand-50/90 leading-relaxed max-w-3xl mx-auto font-medium">
            Your daily source for science-backed health insights, exercise physiology, and the clinical science of balanced living.
          </p>
        </div>
      </section>

      {/* Main Articles Grid */}
      <main className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['All', 'Exercise Science', 'Nutrition Science', 'Metabolic Health', 'Cognitive Health'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-350 cursor-pointer shadow-sm ${selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 scale-105 border border-brand-600'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-16 md:grid-cols-2">
          {BLOGS.filter(blog => selectedCategory === 'All' || blog.category === selectedCategory).map((blog) => (
            <ScrollRevealSection key={blog.id}>
              <article
                onClick={() => setActiveBlog(blog)}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-4 hover:ring-brand-500/10 cursor-pointer h-full"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute left-6 top-6 rounded-xl bg-slate-900/80 backdrop-blur-md px-3.5 py-2 text-xxs font-extrabold uppercase tracking-widest text-white ring-1 ring-white/10">
                    {blog.category}
                  </span>
                </div>

                {/* Article Info */}
                <div className="flex flex-1 flex-col p-8 sm:p-10">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-semibold tracking-wider uppercase">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-300 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="mt-3.5 text-base text-slate-500 leading-relaxed flex-1">
                    {blog.subtitle}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-sm font-semibold text-slate-700">By {blog.author}</span>
                    <span className="text-sm font-bold text-brand-600 group-hover:text-brand-700 transition-colors duration-300 flex items-center gap-1.5">
                      Read Article <span className="transform transition-transform group-hover:translate-x-1 duration-300">➔</span>
                    </span>
                  </div>
                </div>
              </article>
            </ScrollRevealSection>
          ))}
        </div>
      </main>

      {/* Floating Reading Modal Overlay */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Header Image */}
            <div className="relative h-80 bg-slate-200">
              <img
                src={activeBlog.image}
                alt={activeBlog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
              <button
                onClick={() => setActiveBlog(null)}
                className="absolute right-6 top-6 rounded-full bg-slate-950/70 backdrop-blur-md p-3 text-white hover:bg-slate-950 hover:scale-105 transition-all cursor-pointer"
                aria-label="Close article"
              >
                ✕
              </button>
              <div className="absolute bottom-8 left-10 right-10 text-white">
                <span className="rounded bg-brand-500/35 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-brand-200 ring-1 ring-brand-300/30">
                  {activeBlog.category}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 leading-tight drop-shadow-sm">{activeBlog.title}</h2>
              </div>
            </div>

            {/* Author info */}
            <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 px-10 py-5 bg-slate-50/70 text-sm text-slate-500 font-medium">
              <span>Published: <strong className="text-slate-700">{activeBlog.date}</strong></span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Author: <strong className="text-slate-700">{activeBlog.author}</strong></span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Read Time: <strong className="text-slate-700">{activeBlog.readTime}</strong></span>
            </div>

            {/* Content Body */}
            <div className="px-10 py-8 sm:px-12 sm:py-10 max-h-[55vh] overflow-y-auto leading-relaxed text-slate-600">
              {activeBlog.content}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end border-t border-slate-100 px-10 py-5 bg-slate-50">
              <button
                onClick={() => setActiveBlog(null)}
                className="rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:shadow-lg transition-all cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* What Users Say Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-slate-200/40 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            What Users Say
          </h2>
          {/* Arrow Buttons */}
          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-800 shadow-sm cursor-pointer"
              aria-label="Previous review"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-800 shadow-sm cursor-pointer"
              aria-label="Next review"
            >
              →
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {visibleReviews.map((review, index) => (
            <div
              key={review.id}
              className={`group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full ${index > 0 ? 'hidden md:flex' : 'flex'
                }`}
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="h-14 w-14 rounded-full object-cover border border-slate-100"
                    />
                    <span className="font-extrabold text-slate-800 text-base">{review.name}</span>
                  </div>
                  {/* Stars */}
                  <div className="flex text-amber-500 text-lg">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                {/* Review Text */}
                <p className="mt-6 text-sm text-slate-600 leading-relaxed font-medium italic">
                  "{review.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators/Dots */}
        <div className="flex justify-center gap-2.5 mt-10">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${activeIndex === idx
                  ? 'bg-brand-600 w-6 h-2.5'
                  : 'bg-slate-300 w-2.5 h-2.5 hover:bg-slate-400'
                }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
