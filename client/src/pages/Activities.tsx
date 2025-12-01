import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingPage } from "@/components/LoadingSpinner";
import {
  Activity,
  Download,
  MessageSquare,
  AlertTriangle,
  Package,
  Clock,
  Star,
  ExternalLink,
} from "lucide-react";
import type { Download as DownloadType, Feedback, Report, App } from "@shared/schema";

interface DownloadWithApp extends DownloadType {
  app?: App;
}

interface ReportWithApp extends Report {
  app?: App;
}

export default function Activities() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in to view your activities.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: downloads, isLoading: downloadsLoading } = useQuery<DownloadWithApp[]>({
    queryKey: ["/api/user/downloads"],
    enabled: isAuthenticated,
  });

  const { data: feedbackList, isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/user/feedback"],
    enabled: isAuthenticated,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery<ReportWithApp[]>({
    queryKey: ["/api/user/reports"],
    enabled: isAuthenticated,
  });

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case "resolved":
      case "completed":
        return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "in_progress":
        return "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30";
      case "pending":
      case "open":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "closed":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-secondary/50 text-secondary-foreground border-secondary/30";
    }
  };

  if (authLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-neon-green" />
          </div>
          <h1 className="font-display text-3xl font-bold">
            My <span className="text-neon-green">Activities</span>
          </h1>
        </div>
        <p className="text-muted-foreground">
          Track your downloads, feedback, and reported issues.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="downloads" className="space-y-6">
        <TabsList className="bg-card border border-border/50 p-1">
          <TabsTrigger
            value="downloads"
            className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
            data-testid="tab-downloads"
          >
            <Download className="w-4 h-4 mr-2" />
            Downloads
            {downloads && downloads.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {downloads.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple"
            data-testid="tab-feedback"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback
            {feedbackList && feedbackList.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {feedbackList.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink"
            data-testid="tab-reports"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Reports
            {reports && reports.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {reports.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Downloads Tab */}
        <TabsContent value="downloads" className="space-y-4">
          {downloadsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 bg-card/80 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : downloads && downloads.length > 0 ? (
            downloads.map((download) => (
              <Card
                key={download.id}
                className="p-4 bg-card/80 border-border/50 border-l-4 border-l-neon-cyan hover-elevate"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {download.app?.name || "Unknown App"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(download.downloadedAt)}
                    </div>
                  </div>
                  {download.app && (
                    <Link href={`/app/${download.app.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center bg-card/50 border-dashed">
              <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">
                No Downloads Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start exploring and download your first app!
              </p>
              <Link href="/browse">
                <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90">
                  Browse Apps
                </Button>
              </Link>
            </Card>
          )}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {feedbackLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 bg-card/80 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : feedbackList && feedbackList.length > 0 ? (
            feedbackList.map((feedback) => (
              <Card
                key={feedback.id}
                className="p-4 bg-card/80 border-border/50 border-l-4 border-l-neon-purple"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-medium">{feedback.subject}</h3>
                  <Badge
                    variant="outline"
                    className={getStatusColor(feedback.status)}
                  >
                    {feedback.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {feedback.message}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {formatDate(feedback.createdAt)}
                  </div>
                  {feedback.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < feedback.rating!
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center bg-card/50 border-dashed">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">
                No Feedback Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Share your thoughts and help us improve!
              </p>
              <Link href="/feedback">
                <Button className="bg-neon-purple text-foreground hover:bg-neon-purple/90">
                  Give Feedback
                </Button>
              </Link>
            </Card>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {reportsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 bg-card/80 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            reports.map((report) => (
              <Card
                key={report.id}
                className="p-4 bg-card/80 border-border/50 border-l-4 border-l-neon-pink"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {report.app?.name || "Unknown App"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {report.issueType}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(report.status)}
                  >
                    {report.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDate(report.createdAt)}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center bg-card/50 border-dashed">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">
                No Reports Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Found an issue? Help us fix it by reporting.
              </p>
              <Link href="/report">
                <Button className="bg-neon-pink text-foreground hover:bg-neon-pink/90">
                  Report Issue
                </Button>
              </Link>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
