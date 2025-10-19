/**
 * Quiz Start Screen Component
 *
 * Welcome screen shown before quiz begins
 */

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizStartScreenProps {
  onStart: () => void;
}

export function QuizStartScreen({ onStart }: QuizStartScreenProps) {
  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <CardContent className="p-8 md:p-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
          >
            Find Your Perfect Solution
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-600 mb-6 max-w-lg mx-auto"
          >
            Answer 12 quick questions to get a personalized recommendation with instant pricing and
            timeline estimates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-3 mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Takes less than 60 seconds</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Get custom pricing estimate</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>See what's included in your solution</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button onClick={onStart} size="lg" className="gap-2 group h-12 px-8">
              Start Quiz Now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
