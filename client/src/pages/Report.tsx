import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  AlertTriangle,
  Bug,
  Download,
  FileWarning,
  Shield,
  Send,
  HelpCircle,
} from "lucide-react";
import type { App } from "@shared/schema";

const issueTypes = [
  { value: "bug", label: "Bug / Error", icon: Bug },
  { value: "download", label: "Download Issue", icon: Download },
  { value: "security", label: "Security Concern", icon: Shield },
  { value: "broken", label: "Broken / Not Working", icon: FileWarning },
  { value: "other", label: "Other", icon: HelpCircle },
];

const reportSchema = z.object({
  appId: z.string().min(1, "Please select an app"),
  issueType: z.string().min(1, "Please select an issue type"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function Report() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const params = new URLSearchParams(location.split("?")[1]);
  const preselectedApp = params.get("app");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in to report a problem.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: apps, isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      appId: preselectedApp || "",
      issueType: "",
      description: "",
    },
  });

  useEffect(() => {
    if (preselectedApp && apps) {
      form.setValue("appId", preselectedApp);
    }
  }, [preselectedApp, apps, form]);

  const mutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      await apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting this issue. We'll look into it.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Submission Failed",
        description: "Could not submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportFormData) => {
    mutation.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-neon-pink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 mb-4">
          <AlertTriangle className="w-8 h-8 text-neon-pink" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Report a <span className="text-neon-pink">Problem</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Found an issue with an app? Let us know and we'll work to fix it.
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6 sm:p-8 bg-card/80 border-border/50">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* App Selection */}
            <FormField
              control={form.control}
              name="appId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Select App</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className="bg-background border-border/50"
                        data-testid="select-report-app"
                      >
                        <SelectValue placeholder="Which app are you reporting?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading apps...
                        </SelectItem>
                      ) : apps && apps.length > 0 ? (
                        apps.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No apps available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issue Type */}
            <FormField
              control={form.control}
              name="issueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Issue Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className="bg-background border-border/50"
                        data-testid="select-report-type"
                      >
                        <SelectValue placeholder="What type of issue is this?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issueTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe the issue in detail. Include steps to reproduce if applicable..."
                      className="min-h-[150px] bg-background border-border/50 focus:border-neon-pink focus:ring-neon-pink/20 resize-none"
                      data-testid="input-report-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-neon-pink text-foreground hover:bg-neon-pink/90 neon-glow-pink font-display font-semibold"
              disabled={mutation.isPending}
              data-testid="button-submit-report"
            >
              {mutation.isPending ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 p-6 bg-neon-pink/5 border-neon-pink/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-neon-pink/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h3 className="font-display font-semibold mb-1">We Take Issues Seriously</h3>
            <p className="text-sm text-muted-foreground">
              All reports are reviewed by our team. For security issues, we
              prioritize and respond as quickly as possible.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
