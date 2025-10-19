/**
 * Feature Sliders Component
 *
 * Page and user count configuration sliders
 */

import { Slider } from "@/components/ui/slider";

interface FeatureSlidersProps {
  pages: number;
  users: number;
  onPagesChange: (value: number) => void;
  onUsersChange: (value: number) => void;
}

export function FeatureSliders({
  pages,
  users,
  onPagesChange,
  onUsersChange,
}: FeatureSlidersProps) {
  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 mb-6">
      {/* Number of Pages Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-base font-semibold text-slate-700">Number of Pages</label>
          <span className="text-2xl font-bold text-slate-900">{pages}</span>
        </div>
        <Slider
          value={[pages]}
          onValueChange={(value) => onPagesChange(value[0])}
          min={1}
          max={20}
          step={1}
          className="my-2"
        />
      </div>

      {/* Number of Users Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-base font-semibold text-slate-700">Number of Users</label>
          <span className="text-2xl font-bold text-slate-900">{users}</span>
        </div>
        <Slider
          value={[users]}
          onValueChange={(value) => onUsersChange(value[0])}
          min={1}
          max={20}
          step={1}
          className="my-2"
        />
      </div>
    </div>
  );
}
