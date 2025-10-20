import { motion } from "framer-motion";
import { Clock, DollarSign, CheckCircle2, ArrowRight, RotateCcw, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/lib/quizRecommendations";
import { ALWAYS_INCLUDED_FEATURES } from "@/lib/pricing";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onContinue: () => void;
  onRetake: () => void;
}

export default function RecommendationCard({
  recommendation,
  onContinue,
  onRetake,
}: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-white via-primary/5 to-purple-50">
        <CardContent className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-semibold mb-2">
              {recommendation.tierName} Tier
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
              {recommendation.solutionName}
            </h3>
            <p className="text-sm md:text-base text-slate-600">{recommendation.description}</p>
          </div>

          {/* Timeline & Investment */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-slate-600">Timeline</span>
              </div>
              <p className="text-base md:text-lg font-bold text-slate-900">
                {recommendation.timeline}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 relative overflow-hidden">
              {recommendation.quizDiscount.applied && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-1.5 py-0.5 text-xs font-bold rounded-bl-lg">
                  -{recommendation.quizDiscount.percent}%
                </div>
              )}
              <div className="flex items-center gap-1.5 mb-0.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-slate-600">Investment</span>
              </div>
              <p className="text-base md:text-lg font-bold text-slate-900">
                {recommendation.investmentRange}
              </p>
            </div>
          </div>

          {/* Always Included */}
          <div className="mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                  Always Included
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {ALWAYS_INCLUDED_FEATURES.map((feature) => (
                  <div
                    key={feature.id}
                    className="text-xs text-blue-800 flex items-start gap-1.5 font-medium"
                  >
                    <span className="text-slate-600 mt-0.5 font-bold">✓</span>
                    <span>{feature.shortName || feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2">
            <Button onClick={onContinue} size="lg" className="w-full gap-2 group">
              View My Custom Pricing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={onRetake}
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
