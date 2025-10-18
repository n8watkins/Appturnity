import { motion } from "framer-motion";
import { Sparkles, Clock, DollarSign, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/lib/quizRecommendations";

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
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-white via-primary/5 to-purple-50">
        <CardContent className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-2"
              >
                {recommendation.solutionName}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-sm text-primary font-semibold"
              >
                ✨ Your Recommended Solution
              </motion.p>
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-slate-600 mb-6 leading-relaxed"
          >
            {recommendation.description}
          </motion.p>

          {/* Best For */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Best for:</span> {recommendation.bestFor}
            </p>
          </motion.div>

          {/* Timeline & Investment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-slate-600 uppercase">Timeline</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{recommendation.timeline}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 relative overflow-hidden">
              {/* Quiz discount badge */}
              {recommendation.quizDiscount.applied && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-2 py-0.5 text-xs font-bold rounded-bl-lg">
                  -{recommendation.quizDiscount.percent}% OFF
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-slate-600 uppercase">Investment</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{recommendation.investmentRange}</p>
              {recommendation.quizDiscount.applied && (
                <p className="text-xs text-green-700 mt-1 font-medium">🎉 Quiz discount applied!</p>
              )}
            </div>
          </motion.div>

          {/* Includes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mb-6"
          >
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              What's Included
            </h4>
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
              {recommendation.includes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-primary/10 via-purple-50 to-primary/10 rounded-lg p-5 text-center">
              <p className="text-sm text-slate-700 mb-4">
                💡 <span className="font-semibold">Next Step:</span> Review your pre-filled pricing
                calculator below to see your exact cost breakdown.
              </p>
              <Button onClick={onContinue} size="lg" className="w-full gap-2 group h-12">
                View My Custom Pricing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="text-center">
              <Button
                onClick={onRetake}
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-4 h-4" />
                Take Quiz Again
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
