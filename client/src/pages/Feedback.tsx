import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { MessageSquare, Star, Send, Sparkles } from "lucide-react";

const feedbackSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  rating: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function Feedback() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in to submit feedback.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      subject: "",
      message: "",
      rating: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      await apiRequest("POST", "/api/feedback", {
        subject: data.subject,
        message: data.message,
        rating: data.rating ? parseInt(data.rating) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We appreciate your input.",
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
        description: "Could not submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 mb-4">
          <MessageSquare className="w-8 h-8 text-neon-purple" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Share Your <span className="gradient-neon-text">Feedback</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          We value your thoughts! Help us improve NuxBox by sharing your experience.
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6 sm:p-8 bg-card/80 border-border/50">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's your feedback about?"
                      className="bg-background border-border/50 focus:border-neon-purple focus:ring-neon-purple/20"
                      data-testid="input-feedback-subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Rating (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className="bg-background border-border/50"
                        data-testid="select-feedback-rating"
                      >
                        <SelectValue placeholder="How would you rate your experience?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm">
                              {rating === 5
                                ? "Excellent"
                                : rating === 4
                                ? "Good"
                                : rating === 3
                                ? "Average"
                                : rating === 2
                                ? "Poor"
                                : "Very Poor"}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you think..."
                      className="min-h-[150px] bg-background border-border/50 focus:border-neon-purple focus:ring-neon-purple/20 resize-none"
                      data-testid="input-feedback-message"
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
              className="w-full bg-neon-purple text-foreground hover:bg-neon-purple/90 neon-glow-purple font-display font-semibold"
              disabled={mutation.isPending}
              data-testid="button-submit-feedback"
            >
              {mutation.isPending ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 p-6 bg-neon-cyan/5 border-neon-cyan/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h3 className="font-display font-semibold mb-1">Your Input Matters</h3>
            <p className="text-sm text-muted-foreground">
              Every piece of feedback helps us make NuxBox better. We read and
              consider all suggestions for future updates.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
