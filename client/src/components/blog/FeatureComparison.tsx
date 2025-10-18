import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureComparisonProps {
  features: {
    name: string;
    column1: boolean | string;
    column2: boolean | string;
    column3?: boolean | string;
  }[];
  headers: [string, string, string?];
  className?: string;
}

export default function FeatureComparison({
  features,
  headers,
  className,
}: FeatureComparisonProps) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-6 h-6 text-green-600 mx-auto" />
      ) : (
        <X className="w-6 h-6 text-red-400 mx-auto" />
      );
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn("my-8 overflow-x-auto", className)}
    >
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-primary to-blue-600">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Feature
                </th>
                {headers.map(
                  (header, index) =>
                    header && (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-4 text-center text-sm font-semibold text-white"
                      >
                        {header}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    {renderCell(feature.column1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                    {renderCell(feature.column2)}
                  </td>
                  {feature.column3 !== undefined && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                      {renderCell(feature.column3)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
