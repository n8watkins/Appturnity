import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface VSComparisonProps {
  leftTitle: string;
  rightTitle: string;
  leftItems: { label: string; value: string; bad?: boolean }[];
  rightItems: { label: string; value: string; good?: boolean }[];
  conclusion?: string;
}

export default function VSComparison({
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  conclusion
}: VSComparisonProps) {
  return (
    <div className="my-12">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-slate-700 mb-4 pb-3 border-b-2 border-slate-200">
            {leftTitle}
          </h3>
          <div className="space-y-4">
            {leftItems.map((item, idx) => (
              <div key={idx}>
                <div className="text-sm text-slate-500 mb-1">{item.label}</div>
                <div className={`text-lg font-semibold ${item.bad ? 'text-red-600' : 'text-slate-900'}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl border-2 border-primary/30 p-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <h3 className="text-xl font-bold text-primary mb-4 pb-3 border-b-2 border-primary/30">
            {rightTitle}
          </h3>
          <div className="space-y-4">
            {rightItems.map((item, idx) => (
              <div key={idx}>
                <div className="text-sm text-slate-600 mb-1">{item.label}</div>
                <div className={`text-lg font-semibold ${item.good ? 'text-green-600' : 'text-slate-900'}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {conclusion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-r from-primary/10 to-blue-100/50 border-l-4 border-primary rounded-r-lg p-4"
        >
          <p className="text-slate-800 font-medium">{conclusion}</p>
        </motion.div>
      )}
    </div>
  );
}
