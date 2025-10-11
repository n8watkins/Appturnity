import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Download, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export default function PremiumFeatureModal({
  isOpen,
  onClose,
  featureName = "Data Export"
}: PremiumFeatureModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-primary via-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                  className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4"
                  >
                    <Lock className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Premium Feature
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-white/90 text-sm"
                  >
                    {featureName} requires an account
                  </motion.p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Guest Mode Limitations
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-slate-500">✗</span>
                      </div>
                      <p className="text-sm">No data export or download</p>
                    </div>

                    <div className="flex items-start gap-3 text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-slate-500">✗</span>
                      </div>
                      <p className="text-sm">Results aren't saved permanently</p>
                    </div>

                    <div className="flex items-start gap-3 text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-slate-500">✗</span>
                      </div>
                      <p className="text-sm">Limited history and tracking</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 via-purple-50 to-blue-50 rounded-lg p-5 mb-6 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-slate-900">With an Account</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Download className="w-4 h-4 text-primary" />
                        <span>Export data as PDF, CSV, or JSON</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>Track your progress over time</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>Secure cloud storage & backup</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-primary via-purple-600 to-blue-600 hover:opacity-90 transition-opacity"
                      onClick={() => {
                        // TODO: Navigate to sign up
                        window.location.href = '#contact';
                        onClose();
                      }}
                    >
                      Create Free Account
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={onClose}
                    >
                      Continue in Guest Mode
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
