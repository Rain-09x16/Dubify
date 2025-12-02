'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Loader2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Phone,
  FileText,
  Sparkles,
} from 'lucide-react';
import type { SafetyCheckResponse } from '@/lib/types';

const SAMPLE_LOCATIONS = [
  { name: 'Dubai Marina', lat: 25.0805, lng: 55.141 },
  { name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
  { name: 'Jumeirah Beach', lat: 25.2185, lng: 55.2386 },
  { name: 'Gold Souk', lat: 25.2681, lng: 55.2984 },
  { name: 'Palm Jumeirah', lat: 25.1124, lng: 55.139 },
];

export default function SafetyPage() {
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SafetyCheckResponse | null>(null);

  const handleCheck = async (sampleLocation?: { name: string; lat: number; lng: number }) => {
    let lat: number;
    let lng: number;
    let name: string;

    if (sampleLocation) {
      lat = sampleLocation.lat;
      lng = sampleLocation.lng;
      name = sampleLocation.name;
      setLocationName(name);
      setLatitude(lat.toString());
      setLongitude(lng.toString());
    } else {
      lat = parseFloat(latitude);
      lng = parseFloat(longitude);
      name = locationName;

      if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid coordinates');
        return;
      }
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Call backend safety API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/safety`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_name: name || 'Unknown Location',
          coordinates: { lat, lng },
          time_of_day: 'current',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || 'Safety check failed');
      }
    } catch (error) {
      console.error('Safety check error:', error);
      alert('Failed to perform safety check. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="h-12 w-12 text-yellow-600" />;
      case 'high':
        return <AlertTriangle className="h-12 w-12 text-orange-600" />;
      case 'critical':
        return <AlertTriangle className="h-12 w-12 text-red-600" />;
      default:
        return <Shield className="h-12 w-12 text-gray-600" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold mb-1 text-foreground">Safety Alert Workflow</h1>
        <p className="text-sm text-muted-foreground">
          Automated 5-stage safety assessment powered by AI
        </p>
      </div>

      {/* Input Form */}
      <Card className="flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-primary" />
            Check Location Safety
          </CardTitle>
          <CardDescription className="text-sm">
            Enter a location to get real-time safety assessment with AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Location name (optional)"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
            <Input
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              type="number"
              step="any"
            />
            <Input
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              type="number"
              step="any"
            />
          </div>

          <Button
            onClick={() => handleCheck()}
            disabled={!latitude || !longitude || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Safety Workflow...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Check Safety
              </>
            )}
          </Button>

          {/* Sample Locations */}
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Or try these popular locations:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_LOCATIONS.map((location, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCheck(location)}
                  disabled={isLoading}
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="flex-1 overflow-y-auto min-h-0 mt-4 pr-1">
          <div className="space-y-4 animate-slide-up">
            {/* Risk Assessment */}
            <Card className={`border-2 ${getRiskColor(result.riskLevel)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {getRiskIcon(result.riskLevel)}
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {result.riskLevel.toUpperCase()} RISK
                    </h3>
                    <p className="text-sm opacity-80">
                      Risk Score: {result.riskScore}/100
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Workflow ID: {result.workflowId.slice(0, 12)}...
                </Badge>
              </div>

              <div className="mt-4 p-4 bg-white/50 rounded-lg">
                <p className="text-sm font-medium">{result.message}</p>
              </div>
            </CardContent>
          </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Safety Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

            {/* Emergency Contacts */}
            {result.auditReport.jsonData.emergencyContacts && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-4 w-4 text-primary" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.auditReport.jsonData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{contact.name}</p>
                        <p className="text-primary font-semibold">{contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

            {/* Audit Trail */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Workflow Audit Trail
                </CardTitle>
                <CardDescription className="text-sm">
                  5-stage automated workflow execution log
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
              <div className="space-y-3">
                {result.auditReport.jsonData.workflowStages?.map((stage, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {stage.stage}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{stage.name}</p>
                      {stage.note && (
                        <p className="text-xs text-muted-foreground mt-1">{stage.note}</p>
                      )}
                    </div>
                    <Badge
                      variant={
                        stage.status === 'completed'
                          ? 'default'
                          : stage.status === 'required'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {stage.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Assessed by:</span>{' '}
                  {result.auditReport.jsonData.assessedBy}
                </p>
                <p className="text-sm text-foreground mt-1">
                  <span className="font-medium">Assessment time:</span>{' '}
                  {new Date(result.checkedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Info Cards */}
      {!result && !isLoading && (
        <div className="flex-1 overflow-y-auto min-h-0 mt-4 pr-1">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  5-Stage Workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p><strong className="text-foreground">Data Intake:</strong> Collect location coordinates and context</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p><strong className="text-foreground">AI Understanding:</strong> Gemini analyzes safety factors</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p><strong className="text-foreground">Decision Logic:</strong> Determine if human review is needed</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p><strong className="text-foreground">Human Review:</strong> Optional manual verification for high risk</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  5
                </div>
                <p><strong className="text-foreground">Delivery & Audit:</strong> Generate report and recommendations</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" />
                Dubai Safety Facts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Dubai is consistently ranked among the world&apos;s safest cities</p>
              <p>✓ Very low crime rate compared to global standards</p>
              <p>✓ 24/7 police presence in tourist areas</p>
              <p>✓ Advanced CCTV surveillance throughout the city</p>
              <p>✓ Tourist police available for assistance and guidance</p>
              <p className="pt-2 font-medium text-foreground">
                Emergency Number: 999 (Police, Ambulance, Fire)
              </p>
            </CardContent>
          </Card>
          </div>
        </div>
      )}
    </div>
  );
}
