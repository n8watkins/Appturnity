import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingComparisonProps {
  children: React.ReactNode;
  className?: string;
}

export default function PricingComparison({ children, className }: PricingComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn("my-8 overflow-x-auto", className)}
    >
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-xl ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">{children}</table>
        </div>
      </div>
      <style jsx>{`
        table thead tr {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        table thead th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.875rem;
        }
        table tbody tr:nth-child(odd) {
          background-color: #f9fafb;
        }
        table tbody tr:nth-child(even) {
          background-color: white;
        }
        table tbody td {
          padding: 1rem;
          color: #374151;
          font-size: 0.938rem;
        }
        table tbody tr:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </motion.div>
  );
}
