import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ServiceQuiz from '@/components/ServiceQuiz';
import RecommendationCard from '@/components/RecommendationCard';
import { getRecommendation, type Recommendation } from '@/lib/quizRecommendations';
import { saveQuizResults, clearQuizResults } from '@/lib/quizStorage';

export default function Quiz() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [quizKey, setQuizKey] = useState(0);
  const [autoStart, setAutoStart] = useState(false);

  // Listen for startQuiz event from navbar
  useEffect(() => {
    const handleStartQuiz = () => {
      setAutoStart(true);
      setQuizKey(prev => prev + 1); // Force quiz to remount with autoStart=true
    };

    window.addEventListener('startQuiz', handleStartQuiz);

    return () => {
      window.removeEventListener('startQuiz', handleStartQuiz);
    };
  }, []);

  // Handle quiz completion
  const handleQuizComplete = (results: Record<string, string | string[]>) => {
    // Generate recommendation
    const rec = getRecommendation(results);
    setRecommendation(rec);

    // Store results in localStorage with 15-minute expiration
    saveQuizResults(results);

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
    setAutoStart(false);
    setQuizKey(prev => prev + 1);
    clearQuizResults();
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
        {/* Heading - Only show if no recommendation */}
        {!recommendation && (
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
              Answer 12 quick questions to get a personalized recommendation with instant pricing and timeline estimates.
            </p>
          </motion.div>
        )}

        {/* Service Quiz - Only show if no recommendation */}
        {!recommendation && (
          <motion.div
            className="max-w-5xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ServiceQuiz key={quizKey} onComplete={handleQuizComplete} autoStart={autoStart} />
          </motion.div>
        )}

        {/* Recommendation Card - Only show when quiz is complete */}
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
