import { motion } from 'framer-motion';
import { useState } from 'react';
import ServiceQuiz from '@/components/ServiceQuiz';
import RecommendationCard from '@/components/RecommendationCard';
import { getRecommendation, type Recommendation } from '@/lib/quizRecommendations';

export default function Quiz() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  // Handle quiz completion
  const handleQuizComplete = (results: Record<string, string | string[]>) => {
    // Generate recommendation
    const rec = getRecommendation(results);
    setRecommendation(rec);

    // Store results in localStorage for calculator prefill
    localStorage.setItem('quizResults', JSON.stringify(results));

    // Dispatch event so other components know quiz was completed
    window.dispatchEvent(new CustomEvent('quizCompleted', { detail: results }));

    // Scroll to recommendation
    setTimeout(() => {
      document.getElementById('quiz-recommendation')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 300);
  };

  // Handle quiz retake
  const handleRetakeQuiz = () => {
    setRecommendation(null);
    setQuizKey(prev => prev + 1);
    localStorage.removeItem('quizResults');
    // Scroll to top of quiz
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle continue to calculator
  const handleContinue = () => {
    // Scroll to pricing calculator
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="quiz"
      className="py-20 bg-white scroll-mt-16"
      aria-label="Service quiz section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Find Your Perfect Solution
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Answer 11 quick questions to get a personalized recommendation with instant pricing and timeline estimates.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Takes less than 60 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Get custom pricing estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>See what's included in your solution</span>
            </div>
          </div>
        </motion.div>

        {/* Service Quiz */}
        <motion.div
          className="max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ServiceQuiz key={quizKey} onComplete={handleQuizComplete} autoStart={false} />
        </motion.div>

        {/* Recommendation Card */}
        {recommendation && (
          <motion.div
            id="quiz-recommendation"
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <RecommendationCard
              recommendation={recommendation}
              onContinue={handleContinue}
              onRetake={handleRetakeQuiz}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
