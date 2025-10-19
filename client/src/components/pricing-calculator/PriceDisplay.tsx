/**
 * Price Display Component
 *
 * Reusable component for displaying prices with optional discount/strikethrough
 */

import { motion } from "framer-motion";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  showDiscount?: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  showDiscount = false,
  size = "md",
  color = "text-green-900",
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-baseline gap-2">
      {showDiscount && originalPrice && originalPrice > price && (
        <span className="text-sm text-slate-500 line-through">
          ${originalPrice.toLocaleString()}
        </span>
      )}
      <motion.span
        key={`price-${price}`}
        initial={{ scale: 1.1, color: "#15803d" }}
        animate={{ scale: 1, color: "#14532d" }}
        transition={{ duration: 0.3 }}
        className={`font-bold ${sizeClasses[size]} ${color}`}
      >
        ${price.toLocaleString()}
      </motion.span>
    </div>
  );
}
