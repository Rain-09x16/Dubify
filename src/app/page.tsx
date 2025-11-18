'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  Search,
  Shield,
  MapPin,
  Sparkles,
  Zap,
  Globe,
  Users,
  Star,
  ArrowRight,
  Check,
} from 'lucide-react';

function AnimatedHeroSection() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ['Amazing', 'Intelligent', 'Wonderful', 'Beautiful', 'Smart'],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#1A73E8]/20 shadow-lg rounded-full text-sm font-medium relative backdrop-blur-md text-[#1F2937]">
          <Sparkles className="h-4 w-4 text-[#1A73E8]" />
          Powered by Google Gemini & Qdrant
        </div>

        <div className="flex gap-4 flex-col items-center">
          <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-bold leading-tight">
            <span className="block text-[#1F2937]">Your</span>
            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-bold text-primary"
                  initial={{ opacity: 0, y: -100 }}
                  transition={{ type: 'spring', stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? {
                          y: 0,
                          opacity: 1,
                        }
                      : {
                          y: titleNumber > index ? -150 : 150,
                          opacity: 0,
                        }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
            <span className="block text-[#1F2937]">Dubai Tourism Companion</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your Dubai experience with AI-powered assistance. Get instant answers, discover
            hidden gems through semantic search, and stay safe with proactive alerts—all in one app.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              Try Demo Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            Watch Video
          </Button>
        </div>

        <div className="flex gap-8 justify-center text-sm text-[#6B7280] pt-4">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>Free to try</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>Instant access</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="border-b border-[#1A73E8]/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-[#1A73E8]" />
            <span className="text-2xl font-bold text-[#1A73E8]">
              Dubify
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm text-[#1F2937] hover:text-[#1A73E8] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-[#1F2937] hover:text-[#1A73E8] transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm text-[#1F2937] hover:text-[#1A73E8] transition-colors">
              Reviews
            </a>
          </nav>
          <Link href="/dashboard">
            <Button>Try Demo</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <AnimatedHeroSection />

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#1F2937]">Powered by Cutting-Edge AI</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            Four revolutionary features that transform how you experience Dubai
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-shadow border-2 hover:border-[#1A73E8]/30">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Tourism Chatbot</CardTitle>
              <CardDescription>Google Gemini 2.0 Flash</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">
                Ask anything about Dubai in natural language. Get instant, culturally-aware answers
                from our AI trained on Dubai tourism knowledge.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Cultural awareness built-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Responds in seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Context-aware conversations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow border-2 hover:border-[#1A73E8]/30">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Vibe-Based Search</CardTitle>
              <CardDescription>Qdrant Vector Database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">
                Search by feelings, not keywords. Find &quot;romantic sunset spots&quot; or
                &quot;authentic local experiences&quot; using semantic understanding.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Understands intent, not just words</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Vector embeddings for accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Similarity scoring</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow border-2 hover:border-[#1A73E8]/30">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Safety Alert Workflow</CardTitle>
              <CardDescription>AI-Powered Automation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">
                Proactive safety checks with automated 5-stage workflow. Get risk assessments and
                recommendations with full audit trail.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Real-time risk assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Automated workflow execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Emergency contact info</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow border-2 hover:border-[#1A73E8]/30">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Cultural Intelligence</CardTitle>
              <CardDescription>Respect Local Customs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">
                Navigate Dubai&apos;s unique cultural landscape with confidence. Learn about dress
                codes, prayer times, and local etiquette.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Ramadan awareness</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Halal dining filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Prayer time integration</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow border-2 hover:border-[#1A73E8]/30">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Optimized Performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">
                Built on Next.js 14 and deployed on Vercel Edge Network for blazing-fast global
                performance.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>&lt;3s page load times</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Edge network CDN</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Serverless architecture</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow border-2 hover:border-[#1A73E8]/30">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Personalized Experience</CardTitle>
              <CardDescription>AI-Powered Recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[#6B7280] mb-4">
                Get tailored suggestions based on your preferences, budget, and travel style. The more
                you use it, the smarter it gets.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Budget-aware suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Family-friendly filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Learns your preferences</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#1F2937]">How It Works</h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-[#1A73E8] to-[#1565C0] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#1A73E8]/30">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1F2937]">Try the Demo</h3>
              <p className="text-[#6B7280]">
                Click &quot;Try Demo&quot; to access the full application instantly. No sign-up required
                for the demo version.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-[#1A73E8] to-[#1565C0] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#1A73E8]/30">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1F2937]">Explore Features</h3>
              <p className="text-[#6B7280]">
                Chat with the AI, search for locations, check safety alerts—experience all features in
                action.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-[#1A73E8] to-[#1565C0] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#1A73E8]/30">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1F2937]">Plan Your Trip</h3>
              <p className="text-[#6B7280]">
                Use insights from the app to plan your perfect Dubai experience with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#1F2937]">Loved by Tourists</h2>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            See what travelers are saying about Dubai Navigator AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#6B7280] mb-4">
                &quot;The vibe-based search is incredible! I searched for &apos;romantic sunset
                spots&apos; and found the perfect place for my proposal. The AI understood exactly what
                I wanted.&quot;
              </p>
              <div className="font-semibold">Sarah M.</div>
              <div className="text-sm text-[#6B7280]">London, UK</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#6B7280] mb-4">
                &quot;As a solo female traveler, the safety alerts gave me peace of mind. The cultural
                guide helped me respect local customs. This app is a game-changer!&quot;
              </p>
              <div className="font-semibold">Priya K.</div>
              <div className="text-sm text-[#6B7280]">Mumbai, India</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#6B7280] mb-4">
                &quot;The AI chatbot answered all my questions instantly. Way better than scrolling
                through travel blogs. Saved me hours of research!&quot;
              </p>
              <div className="font-semibold">Marcus T.</div>
              <div className="text-sm text-[#6B7280]">New York, USA</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#3B82F6] via-[#1A73E8] to-[#1565C0] py-20 shadow-2xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Dubify Your Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
            Join thousands of tourists using AI to make their Dubai trips unforgettable
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-[#1F2937] hover:bg-white/95 shadow-xl hover:shadow-2xl transition-all">
              Try Demo Now - It&apos;s Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#1A73E8]/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-[#1A73E8]" />
                <span className="text-[#1F2937] font-bold">Dubify</span>
              </div>
              <p className="text-sm text-[#6B7280]">
                Your intelligent companion for exploring Dubai with confidence and cultural awareness.
              </p>
            </div>

            <div>
              <h3 className="text-[#1F2937] font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-[#6B7280] hover:text-[#1A73E8] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-[#6B7280] hover:text-[#1A73E8] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6B7280] hover:text-[#1A73E8] transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#1F2937] font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-[#6B7280] hover:text-[#1A73E8] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6B7280] hover:text-[#1A73E8] transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#6B7280] hover:text-[#1A73E8] transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#1F2937] font-semibold mb-4">Technologies</h3>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li>Google Gemini 2.0</li>
                <li>Qdrant Vector DB</li>
                <li>Next.js 14</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A73E8]/20 pt-8 text-center text-sm">
            <p className="text-[#6B7280]">&copy; 2025 Dubify. Built for Demo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
