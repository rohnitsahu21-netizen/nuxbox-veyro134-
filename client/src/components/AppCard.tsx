import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Package, ArrowRight } from "lucide-react";
import type { App } from "@shared/schema";

interface AppCardProps {
  app: App;
  onDownload?: (app: App) => void;
}

const categoryColors: Record<string, string> = {
  utilities: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  development: "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
  multimedia: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  networking: "bg-neon-green/20 text-neon-green border-neon-green/30",
  security: "bg-destructive/20 text-destructive border-destructive/30",
  system: "bg-secondary/50 text-secondary-foreground border-secondary/30",
};

export function AppCard({ app, onDownload }: AppCardProps) {
  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "N/A";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const categoryClass = categoryColors[app.category.toLowerCase()] || categoryColors.system;

  return (
    <Card
      className="group relative overflow-visible border-border/50 bg-card/80 hover:border-neon-cyan/50 transition-all duration-300 hover-elevate"
      data-testid={`card-app-${app.id}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-border/50 flex items-center justify-center flex-shrink-0 group-hover:neon-glow-cyan transition-all duration-300">
            {app.iconUrl ? (
              <img
                src={app.iconUrl}
                alt={app.name}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <Package className="w-7 h-7 text-neon-cyan" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-base truncate group-hover:text-neon-cyan transition-colors">
              {app.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge
                variant="outline"
                className={`text-[10px] uppercase tracking-wider border ${categoryClass}`}
              >
                {app.category}
              </Badge>
              {app.version && (
                <span className="text-xs text-muted-foreground font-mono">
                  v{app.version}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
          {app.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {app.downloadCount?.toLocaleString() || 0}
            </span>
            <span>{formatFileSize(app.fileSize)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/app/${app.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-neon-cyan"
                data-testid={`button-view-${app.id}`}
              >
                View
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-neon-cyan text-background hover:bg-neon-cyan/90"
              onClick={() => onDownload?.(app)}
              data-testid={`button-download-${app.id}`}
            >
              <Download className="w-3 h-3 mr-1" />
              Get
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
