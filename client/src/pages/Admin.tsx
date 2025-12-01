import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Package,
  Trash2,
  Plus,
  FileArchive,
  ShieldAlert,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { App } from "@shared/schema";

const categories = [
  "utilities",
  "development",
  "system",
  "security",
  "multimedia",
  "networking",
];

const appSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  version: z.string().optional(),
  iconUrl: z.string().url().optional().or(z.literal("")),
});

type AppFormData = z.infer<typeof appSchema>;

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: apps, isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ["/api/admin/apps"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const form = useForm<AppFormData>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      version: "",
      iconUrl: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: AppFormData) => {
      if (!selectedFile) {
        throw new Error("Please select a file");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      if (data.version) formData.append("version", data.version);
      if (data.iconUrl) formData.append("iconUrl", data.iconUrl);

      const response = await fetch("/api/admin/apps", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/apps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "App Uploaded",
        description: "The app has been added successfully.",
      });
      form.reset();
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please sign in again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (appId: string) => {
      await apiRequest("DELETE", `/api/admin/apps/${appId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/apps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "App Deleted",
        description: "The app has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ appId, isActive }: { appId: string; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/admin/apps/${appId}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/apps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".zip")) {
        setSelectedFile(file);
        toast({
          title: "File Selected",
          description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
        });
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a ZIP file.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".zip")) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a ZIP file.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (data: AppFormData) => {
    uploadMutation.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-neon-purple rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center">
            <Upload className="w-5 h-5 text-neon-purple" />
          </div>
          <h1 className="font-display text-3xl font-bold">
            Admin <span className="text-neon-purple">Panel</span>
          </h1>
        </div>
        <p className="text-muted-foreground">
          Upload and manage Linux apps and tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <Card className="p-6 bg-card/80 border-border/50">
          <h2 className="font-display font-semibold text-xl mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-neon-cyan" />
            Upload New App
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? "border-neon-cyan bg-neon-cyan/10"
                    : selectedFile
                    ? "border-neon-green bg-neon-green/5"
                    : "border-border hover:border-neon-cyan/50"
                }`}
                onDrag={handleDrag}
                onDragStart={handleDrag}
                onDragEnd={handleDragOut}
                onDragOver={handleDragIn}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  data-testid="input-file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileArchive className="w-12 h-12 text-neon-green mx-auto" />
                      <p className="font-medium text-neon-green">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="font-medium">
                        Drag & drop a ZIP file here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </div>
                  )}
                </label>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., File Manager Pro"
                        className="bg-background"
                        data-testid="input-app-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="bg-background"
                          data-testid="select-app-category"
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 1.0.0"
                        className="bg-background"
                        data-testid="input-app-version"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the app..."
                        className="min-h-[100px] bg-background resize-none"
                        data-testid="input-app-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        className="bg-background"
                        data-testid="input-app-icon"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-neon-purple text-foreground hover:bg-neon-purple/90"
                disabled={uploadMutation.isPending || !selectedFile}
                data-testid="button-upload-app"
              >
                {uploadMutation.isPending ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload App
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Card>

        {/* Apps List */}
        <Card className="p-6 bg-card/80 border-border/50">
          <h2 className="font-display font-semibold text-xl mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-neon-cyan" />
            Manage Apps ({apps?.length || 0})
          </h2>

          {appsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : apps && apps.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{app.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {app.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {app.downloadCount} downloads
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          appId: app.id,
                          isActive: !app.isActive,
                        })
                      }
                      data-testid={`button-toggle-${app.id}`}
                    >
                      {app.isActive ? (
                        <CheckCircle className="w-4 h-4 text-neon-green" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(app.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${app.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No apps uploaded yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
