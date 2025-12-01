import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppCard } from "@/components/AppCard";
import { AppCardSkeleton } from "@/components/LoadingSpinner";
import {
  Package,
  Download,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import type { App, Download as DownloadType, Feedback, Report } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: recentApps, isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ["/api/apps", "recent"],
  });

  const { data: userStats } = useQuery<{
    downloads: number;
    feedback: number;
    reports: number;
  }>({
    queryKey: ["/api/user/stats"],
  });

  const stats = [
    {
      label: "Downloads",
      value: userStats?.downloads || 0,
      icon: Download,
      color: "neon-cyan",
      href: "/activities",
    },
    {
      label: "Feedback",
      value: userStats?.feedback || 0,
      icon: MessageSquare,
      color: "neon-purple",
      href: "/activities",
    },
    {
      label: "Reports",
      value: userStats?.reports || 0,
      icon: AlertTriangle,
      color: "neon-pink",
      href: "/activities",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Welcome back,{" "}
          <span className="gradient-neon-text">
            {user?.firstName || "User"}
          </span>
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your NuxBox account.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="p-5 bg-card/80 border-border/50 hover:border-neon-cyan/30 transition-all duration-300 hover-elevate cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className={`font-display text-3xl font-bold text-${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 border border-${stat.color}/30 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Link href="/browse">
          <Card className="p-4 bg-card/80 border-border/50 hover:border-neon-cyan/30 transition-all duration-300 hover-elevate cursor-pointer text-center">
            <Package className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
            <span className="text-sm font-medium">Browse Apps</span>
          </Card>
        </Link>
        <Link href="/feedback">
          <Card className="p-4 bg-card/80 border-border/50 hover:border-neon-purple/30 transition-all duration-300 hover-elevate cursor-pointer text-center">
            <MessageSquare className="w-8 h-8 text-neon-purple mx-auto mb-2" />
            <span className="text-sm font-medium">Give Feedback</span>
          </Card>
        </Link>
        <Link href="/report">
          <Card className="p-4 bg-card/80 border-border/50 hover:border-neon-pink/30 transition-all duration-300 hover-elevate cursor-pointer text-center">
            <AlertTriangle className="w-8 h-8 text-neon-pink mx-auto mb-2" />
            <span className="text-sm font-medium">Report Issue</span>
          </Card>
        </Link>
        <Link href="/activities">
          <Card className="p-4 bg-card/80 border-border/50 hover:border-neon-green/30 transition-all duration-300 hover-elevate cursor-pointer text-center">
            <TrendingUp className="w-8 h-8 text-neon-green mx-auto mb-2" />
            <span className="text-sm font-medium">Activities</span>
          </Card>
        </Link>
      </div>

      {/* Recent Apps */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-display text-xl font-semibold">Recently Added</h2>
          </div>
          <Link href="/browse">
            <Button variant="ghost" className="text-neon-cyan hover:text-neon-cyan/80">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appsLoading ? (
            <>
              <AppCardSkeleton />
              <AppCardSkeleton />
              <AppCardSkeleton />
            </>
          ) : recentApps && recentApps.length > 0 ? (
            recentApps.slice(0, 6).map((app) => (
              <AppCard key={app.id} app={app} />
            ))
          ) : (
            <Card className="col-span-full p-12 text-center bg-card/50 border-dashed">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">No Apps Yet</h3>
              <p className="text-muted-foreground mb-4">
                Check back soon for new Linux apps and tools!
              </p>
              <Link href="/browse">
                <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90">
                  Browse Apps
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
