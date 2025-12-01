import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingPage } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Package,
  Download,
  ArrowLeft,
  Calendar,
  HardDrive,
  Tag,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { App } from "@shared/schema";

const categoryColors: Record<string, string> = {
  utilities: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  development: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
  multimedia: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  networking: "bg-neon-green/20 text-neon-green border-neon-green/30",
  security: "bg-destructive/20 text-destructive border-destructive/30",
  system: "bg-secondary/50 text-secondary-foreground border-secondary/30",
};

export default function AppDetail() {
  const [, params] = useRoute("/app/:id");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const appId = params?.id;

  const { data: app, isLoading, error } = useQuery<App>({
    queryKey: ["/api/apps", appId],
    enabled: !!appId,
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        window.location.href = "/api/login";
        return;
      }
      await apiRequest("POST", `/api/downloads`, { appId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps", appId] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      window.open(`/api/apps/${appId}/download`, "_blank");
      toast({
        title: "Download Started",
        description: `${app?.name} is downloading...`,
      });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Could not start download. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "N/A";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !app) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">App Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The app you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/browse">
          <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  const categoryClass = categoryColors[app.category.toLowerCase()] || categoryColors.system;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/browse">
        <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>
      </Link>

      {/* App Header */}
      <Card className="p-6 sm:p-8 bg-card/80 border-border/50 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Icon */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-border/50 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            {app.iconUrl ? (
              <img
                src={app.iconUrl}
                alt={app.name}
                className="w-14 h-14 object-contain"
              />
            ) : (
              <Package className="w-12 h-12 text-neon-cyan" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                {app.name}
              </h1>
              {app.version && (
                <Badge variant="outline" className="w-fit mx-auto sm:mx-0 font-mono">
                  v{app.version}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
              <Badge
                variant="outline"
                className={`text-xs uppercase tracking-wider border ${categoryClass}`}
              >
                {app.category}
              </Badge>
              {app.isActive && (
                <Badge variant="outline" className="bg-neon-green/20 text-neon-green border-neon-green/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground">{app.description}</p>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-card/80 border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Downloads</p>
              <p className="font-display font-semibold">
                {app.downloadCount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="font-display font-semibold">
                {formatFileSize(app.fileSize)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/80 border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-pink/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-neon-pink" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Added</p>
              <p className="font-display font-semibold text-sm">
                {formatDate(app.createdAt)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Download Section */}
      <Card className="p-6 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border-neon-cyan/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-lg mb-1">
              Ready to Download?
            </h3>
            <p className="text-sm text-muted-foreground">
              {app.fileName} ({formatFileSize(app.fileSize)})
            </p>
          </div>
          <Button
            size="lg"
            className="bg-neon-cyan text-background hover:bg-neon-cyan/90 neon-glow-cyan font-display font-semibold px-8"
            onClick={() => downloadMutation.mutate()}
            disabled={downloadMutation.isPending}
            data-testid="button-download-app"
          >
            {downloadMutation.isPending ? (
              "Starting..."
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Now
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Report Issue */}
      <div className="mt-6 text-center">
        <Link href={`/report?app=${app.id}`}>
          <Button variant="ghost" className="text-muted-foreground hover:text-neon-pink">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report an issue with this app
          </Button>
        </Link>
      </div>
    </div>
  );
}
