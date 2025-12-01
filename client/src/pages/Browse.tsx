import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppCard } from "@/components/AppCard";
import { AppCardSkeleton } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  Package,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Terminal,
  Cpu,
  HardDrive,
  Shield,
  Palette,
  Globe,
} from "lucide-react";
import type { App } from "@shared/schema";

const categories = [
  { value: "all", label: "All Categories", icon: Grid3X3 },
  { value: "utilities", label: "Utilities", icon: Terminal },
  { value: "development", label: "Development", icon: Cpu },
  { value: "system", label: "System", icon: HardDrive },
  { value: "security", label: "Security", icon: Shield },
  { value: "multimedia", label: "Multimedia", icon: Palette },
  { value: "networking", label: "Networking", icon: Globe },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "name", label: "Name A-Z" },
];

export default function Browse() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: apps, isLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const downloadMutation = useMutation({
    mutationFn: async (appId: string) => {
      if (!isAuthenticated) {
        window.location.href = "/api/login";
        return;
      }
      await apiRequest("POST", `/api/downloads`, { appId });
    },
    onSuccess: (_, appId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      const app = apps?.find((a) => a.id === appId);
      if (app) {
        window.open(`/api/apps/${appId}/download`, "_blank");
        toast({
          title: "Download Started",
          description: `${app.name} is downloading...`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Could not start download. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredApps = useMemo(() => {
    if (!apps) return [];

    let filtered = [...apps];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (app) => app.category.toLowerCase() === selectedCategory
      );
    }

    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
    }

    return filtered;
  }, [apps, searchQuery, selectedCategory, sortBy]);

  const handleDownload = (app: App) => {
    downloadMutation.mutate(app.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Browse <span className="gradient-neon-text">Apps</span>
        </h1>
        <p className="text-muted-foreground">
          Discover free Linux applications and tools
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50 focus:border-neon-cyan focus:ring-neon-cyan/20"
            data-testid="input-search"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-card border-border/50" data-testid="select-category">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {cat.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-card border-border/50" data-testid="select-sort">
              <SortAsc className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border border-border/50 rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Badge
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            className={`cursor-pointer transition-all ${
              selectedCategory === cat.value
                ? "bg-neon-cyan text-background"
                : "hover:border-neon-cyan/50"
            }`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Badge>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredApps.length} {filteredApps.length === 1 ? "app" : "apps"} found
        </p>
      </div>

      {/* Apps Grid/List */}
      {isLoading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredApps.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onDownload={handleDownload} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-card/50 border-dashed">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">No Apps Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No apps match "${searchQuery}"`
              : "No apps available in this category yet."}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
}
