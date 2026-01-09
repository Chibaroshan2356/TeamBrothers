import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Users, MapPin, Route, ArrowRight, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { useApp } from '@/context/AppContext';
import { recommendVehicle, TripType, tripTypeLabels, calculateTripCost } from '@/data/vehicles';

/**
 * Smart Recommendation Page
 * 
 * Rule-based vehicle recommendation system:
 * 1. User inputs passengers, trip type, and distance
 * 2. System calculates scores based on:
 *    - Capacity utilization (prefer optimal fit)
 *    - Trip type suitability
 *    - Distance optimization (comfort vs economy)
 *    - Cost efficiency per person
 *    - Environmental impact
 * 3. Returns ranked recommendations with explanations
 */
const Recommend = () => {
  const [searchParams] = useSearchParams();
  const { vehicles } = useApp();
  
  // Form state
  const [passengers, setPassengers] = useState<number>(4);
  const [tripType, setTripType] = useState<TripType>('family');
  const [distance, setDistance] = useState<number>(100);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<ReturnType<typeof recommendVehicle>>([]);

  // Initialize from URL params
  useEffect(() => {
    const tripTypeParam = searchParams.get('tripType') as TripType;
    if (tripTypeParam && tripTypeLabels[tripTypeParam]) {
      setTripType(tripTypeParam);
    }
  }, [searchParams]);

  const handleRecommend = () => {
    const results = recommendVehicle(passengers, tripType, distance);
    setRecommendations(results);
    setShowResults(true);
  };

  const bestMatch = recommendations[0];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="text-secondary-foreground font-medium">AI-Powered Recommendations</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Smart Vehicle Finder
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tell us about your trip, and our intelligent system will recommend the perfect vehicle with a detailed explanation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Passengers */}
              <div className="space-y-2">
                <Label htmlFor="passengers" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Number of Passengers
                </Label>
                <Input
                  id="passengers"
                  type="number"
                  min={1}
                  max={30}
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  placeholder="e.g., 8"
                />
                <p className="text-xs text-muted-foreground">
                  Include all travelers in your group
                </p>
              </div>

              {/* Trip Type */}
              <div className="space-y-2">
                <Label htmlFor="tripType">Trip Type</Label>
                <Select value={tripType} onValueChange={(v) => setTripType(v as TripType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(tripTypeLabels) as TripType[]).map(type => (
                      <SelectItem key={type} value={type}>
                        {tripTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Helps us match comfort and features
                </p>
              </div>

              {/* Distance */}
              <div className="space-y-2">
                <Label htmlFor="distance" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Estimated Distance (km)
                </Label>
                <Input
                  id="distance"
                  type="number"
                  min={10}
                  max={2000}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  placeholder="e.g., 200"
                />
                <p className="text-xs text-muted-foreground">
                  Total round-trip distance
                </p>
              </div>

              <Button 
                onClick={handleRecommend} 
                className="w-full" 
                size="lg"
                disabled={passengers < 1 || distance < 10}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Recommendations
              </Button>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border-border/50 bg-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-secondary" />
                How Our Algorithm Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our smart recommendation engine analyzes multiple factors to find your ideal vehicle:
              </p>
              <ul className="space-y-3">
                {[
                  { title: 'Capacity Optimization', desc: 'Matches passenger count to vehicle size' },
                  { title: 'Trip Suitability', desc: 'Filters by family, friends, or office needs' },
                  { title: 'Distance Analysis', desc: 'Recommends comfort vs economy based on journey length' },
                  { title: 'Cost Efficiency', desc: 'Calculates value per person' },
                  { title: 'Environmental Impact', desc: 'Considers carbon footprint' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  💡 This explainable AI approach is great for viva discussions about rule-based systems vs machine learning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="mt-12 animate-slide-up">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              Recommended Vehicles for You
            </h2>

            {recommendations.length > 0 ? (
              <>
                {/* Top Recommendation */}
                {bestMatch && (
                  <div className="max-w-3xl mx-auto mb-8">
                    <Card className="border-2 border-primary bg-primary/5 overflow-hidden">
                      <CardHeader className="bg-primary text-primary-foreground">
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Best Match: {bestMatch.vehicle.name}
                          </span>
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            Score: {bestMatch.score}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src={bestMatch.vehicle.image}
                              alt={bestMatch.vehicle.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <h3 className="font-heading text-xl font-bold mb-3">
                              Why This Vehicle?
                            </h3>
                            <ul className="space-y-2">
                              {bestMatch.reasons.map((reason, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 p-3 bg-accent rounded-lg">
                              <p className="text-sm text-muted-foreground">Estimated Cost</p>
                              <p className="font-heading text-2xl font-bold text-foreground">
                                ₹{calculateTripCost(bestMatch.vehicle, distance).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                For {distance}km journey
                              </p>
                            </div>
                            <Link to={`/booking?vehicle=${bestMatch.vehicle.id}&distance=${distance}`}>
                              <Button className="w-full mt-4">
                                Book This Vehicle
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Other Recommendations */}
                {recommendations.length > 1 && (
                  <div className="max-w-6xl mx-auto">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                      Other Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.slice(1).map((rec, index) => (
                        <div key={rec.vehicle.id} className="relative">
                          <Badge className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground">
                            Score: {rec.score}
                          </Badge>
                          <VehicleCard vehicle={rec.vehicle} distance={distance} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card className="max-w-xl mx-auto text-center py-12">
                <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">
                  No Available Vehicles Found
                </h3>
                <p className="text-muted-foreground mb-4">
                  No vehicles match your requirements or all suitable vehicles are currently unavailable.
                </p>
                <Link to="/contact">
                  <Button variant="outline">Contact Us for Alternatives</Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommend;
