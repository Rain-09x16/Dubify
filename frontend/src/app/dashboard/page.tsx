'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Search,
  Shield,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getFeaturedLocations, sampleQueries } from '@/lib/data/locations';

export default function DashboardPage() {
  const featuredLocations = getFeaturedLocations(3);

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Header */}
      <div className="flex-shrink-0 mb-3">
        <h1 className="text-2xl font-bold mb-1 text-foreground">Welcome to Dubify</h1>
        <p className="text-sm text-muted-foreground">
          Your intelligent companion for exploring Dubai. Try our AI-powered features below.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-3 flex-shrink-0 mb-3">
        <Link href="/dashboard/chat">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">AI Chat Assistant</CardTitle>
              <CardDescription className="text-xs">Ask me anything about Dubai</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="ghost" className="w-full justify-between group h-8 text-sm">
                Start Chatting
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/search">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Vibe-Based Search</CardTitle>
              <CardDescription className="text-xs">Find places by feeling & mood</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="ghost" className="w-full justify-between group h-8 text-sm">
                Explore Locations
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/safety">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Safety Check</CardTitle>
              <CardDescription className="text-xs">Get real-time safety assessment</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="ghost" className="w-full justify-between group h-8 text-sm">
                Check Safety
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-3 flex-shrink-0 mb-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Locations</p>
                <p className="text-2xl font-bold text-foreground">500+</p>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">AI Responses</p>
                <p className="text-2xl font-bold text-foreground">&lt;3s</p>
              </div>
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-foreground">4.8</p>
              </div>
              <Star className="h-6 w-6 text-primary fill-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Content Section */}
      <div className="grid lg:grid-cols-2 gap-3 flex-1 overflow-y-auto min-h-0">
        {/* Sample Queries */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              Try These Searches
            </CardTitle>
            <CardDescription className="text-xs">
              Sample vibe-based queries to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleQueries.slice(0, 6).map((query, index) => (
                <Link key={index} href={`/dashboard/search?q=${encodeURIComponent(query)}`}>
                  <div className="p-2 bg-secondary hover:bg-primary/10 rounded-lg cursor-pointer transition-colors flex items-center justify-between group">
                    <span className="text-xs text-foreground">{query}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Locations */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-primary" />
              Featured Locations
            </CardTitle>
            <CardDescription className="text-xs">
              Top-rated places in Dubai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {featuredLocations.map((location) => (
                <div
                  key={location.id}
                  className="p-2 border border-border rounded-lg hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-sm text-foreground">{location.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {location.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span className="text-xs font-medium text-foreground">{location.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {location.priceRange}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Info */}
      {/* <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Powered by Advanced AI</h3>
              <p className="text-sm text-gray-700">
                This demo showcases Google Gemini 2.0 Flash for chat and Qdrant vector database for
                semantic search.
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
