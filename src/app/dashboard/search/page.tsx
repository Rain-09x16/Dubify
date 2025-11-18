'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Loader2, MapPin, Star, DollarSign, CheckCircle, Sparkles } from 'lucide-react';
import type { SearchResult } from '@/lib/types';
import { sampleQueries } from '@/lib/data/locations';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery?: string) => {
    const queryText = searchQuery || query.trim();
    if (!queryText) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data.results);
        setSearchTime(data.data.queryTimeMs);
      } else {
        throw new Error(data.error?.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold mb-1 text-foreground">Vibe-Based Semantic Search</h1>
        <p className="text-sm text-muted-foreground">
          Search by feeling, not just keywords - powered by Qdrant vector database
        </p>
      </div>

      {/* Search Bar */}
      <Card className="flex-shrink-0">
        <CardContent className="pt-4 pb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try: 'romantic sunset spots' or 'authentic cultural experiences'"
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button type="submit" disabled={!query.trim() || isLoading} className="h-12 px-6">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SearchIcon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Sample Queries */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try these vibe-based searches:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.slice(0, 6).map((sample, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(sample);
                      handleSearch(sample);
                    }}
                    disabled={isLoading}
                  >
                    {sample}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="flex-1 overflow-y-auto min-h-0 mt-4 pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Searching with AI semantic understanding...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results Header */}
              {results.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{results.length}</span> results
                    {searchTime !== null && (
                      <span className="ml-1">in {searchTime}ms</span>
                    )}
                  </p>
                </div>
              )}

              {/* Results Grid */}
              {results.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {results.map((result) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{result.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <MapPin className="h-3 w-3" />
                              {result.address || `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="secondary">
                              {Math.round(result.similarityScore * 100)}% match
                            </Badge>
                            {result.verified && (
                              <Badge variant="outline" className="gap-1 text-xs">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {result.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {result.category}
                          </Badge>
                          {result.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="font-medium text-foreground">{result.rating}</span>
                              <span className="text-muted-foreground">({result.reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              <span>{result.priceRange}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {result.halalCertified && (
                              <Badge variant="outline" className="text-xs">
                                Halal
                              </Badge>
                            )}
                            {result.familyFriendly && (
                              <Badge variant="outline" className="text-xs">
                                Family-Friendly
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="py-12 text-center">
                    <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-foreground mb-2">No results found</p>
                    <p className="text-sm text-muted-foreground">
                      Try a different search query or use one of the suggestions above
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      {!hasSearched && (
        <div className="flex-1 overflow-y-auto min-h-0 mt-4 pr-1">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p>Your query is converted to a vector embedding using Google Gemini</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p>Qdrant searches through vectorized Dubai locations for semantic matches</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p>Results are ranked by similarity score and relevance to your vibe</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <SearchIcon className="h-4 w-4 text-primary" />
                Search Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Use descriptive terms like &quot;romantic&quot;, &quot;authentic&quot;, &quot;luxury&quot;</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Combine mood with activity: &quot;peaceful beach for meditation&quot;</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Be specific about your preferences and requirements</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>The AI understands context and nuance, not just keywords</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
}
