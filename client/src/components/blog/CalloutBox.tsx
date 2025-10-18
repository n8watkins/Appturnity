import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutBoxProps {
  type?: "info" | "success" | "warning" | "danger";
  title?: string;
  children: React.ReactNode;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const styles = {
  info: "bg-blue-50 border-blue-200 text-blue-900",
  success: "bg-green-50 border-green-200 text-green-900",
  warning: "bg-orange-50 border-orange-200 text-orange-900",
  danger: "bg-red-50 border-red-200 text-red-900",
};

const iconStyles = {
  info: "text-blue-600",
  success: "text-green-600",
  warning: "text-orange-600",
  danger: "text-red-600",
};

export default function CalloutBox({ type = "info", title, children }: CalloutBoxProps) {
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={cn("my-6 p-6 rounded-xl border-2", styles[type])}
    >
      <div className="flex items-start gap-4">
        <Icon className={cn("w-6 h-6 flex-shrink-0 mt-0.5", iconStyles[type])} />
        <div className="flex-1">
          {title && <h4 className="font-bold text-lg mb-2">{title}</h4>}
          <div className="prose prose-sm max-w-none">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
