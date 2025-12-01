import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Package,
  Download,
  Shield,
  Zap,
  Users,
  Star,
  ArrowRight,
  Terminal,
  Cpu,
  HardDrive,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Curated Collection",
    description: "Hand-picked Linux apps and tools, tested for quality and security.",
    color: "neon-cyan",
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description: "One-click downloads with no registration required for basic access.",
    color: "neon-purple",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All apps are scanned and verified before being listed.",
    color: "neon-green",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized delivery for quick downloads anywhere in the world.",
    color: "neon-pink",
  },
];

const categories = [
  { name: "Utilities", icon: Terminal, count: 50 },
  { name: "Development", icon: Cpu, count: 35 },
  { name: "System", icon: HardDrive, count: 28 },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-cyan/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-purple/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-neon-cyan font-medium">
              100% Free Linux Apps & Tools
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-in-up">
            <span className="block text-foreground">Your Gateway to</span>
            <span className="block gradient-neon-text neon-text-cyan mt-2">
              Free Linux Apps
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            Discover, download, and power up your Linux experience with our 
            curated collection of essential apps and utilities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/browse">
              <Button
                size="lg"
                className="bg-neon-cyan text-background hover:bg-neon-cyan/90 neon-glow-cyan font-display font-semibold px-8 animate-pulse-glow"
                data-testid="button-browse-apps"
              >
                <Package className="w-5 h-5 mr-2" />
                Browse Apps
              </Button>
            </Link>
            <a href="/api/login">
              <Button
                size="lg"
                variant="outline"
                className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 font-display font-semibold px-8"
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-neon-cyan">500+</div>
              <div className="text-sm text-muted-foreground">Apps</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-neon-purple">10K+</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-neon-pink">5K+</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-neon-cyan rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-neon-text">NuxBox</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make finding and downloading Linux software simple, safe, and fast.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="p-6 bg-card/50 border-border/50 hover:border-neon-cyan/30 transition-all duration-300 hover-elevate group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 border border-${feature.color}/30 flex items-center justify-center mb-4 group-hover:neon-glow-${feature.color.split('-')[1]} transition-all`}>
                    <Icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">
                Popular Categories
              </h2>
              <p className="text-muted-foreground">
                Explore apps by category
              </p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const colors = ["neon-cyan", "neon-purple", "neon-pink"];
              const color = colors[index % colors.length];
              return (
                <Link key={category.name} href={`/browse?category=${category.name.toLowerCase()}`}>
                  <Card className={`p-6 bg-card/50 border-border/50 hover:border-${color}/50 transition-all duration-300 hover-elevate cursor-pointer group`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-${color}/10 border border-${color}/30 flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 text-${color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg group-hover:text-neon-cyan transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} apps available
                        </p>
                      </div>
                      <ArrowRight className={`w-5 h-5 text-muted-foreground group-hover:text-${color} transition-colors`} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-neon opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-purple/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-6">
            <Users className="w-4 h-4 text-neon-purple" />
            <span className="text-sm text-neon-purple font-medium">
              Join thousands of Linux users
            </span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Ready to Enhance Your Linux Experience?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Create an account to track your downloads, save favorites, and get personalized recommendations.
          </p>
          
          <a href="/api/login">
            <Button
              size="lg"
              className="bg-neon-purple text-foreground hover:bg-neon-purple/90 neon-glow-purple font-display font-semibold px-10"
              data-testid="button-join-now"
            >
              Join Now - It's Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
