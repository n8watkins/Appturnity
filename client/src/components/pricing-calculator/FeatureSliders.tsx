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
    <div className="bg-slate-50 p-2.5 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border border-slate-200 mb-4 sm:mb-6">
      {/* Mobile: 2-column grid layout */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {/* Number of Pages */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">Pages</label>
          <span className="text-lg font-bold text-slate-900 block mb-1.5">{pages}</span>
          <Slider
            value={[pages]}
            onValueChange={(value) => onPagesChange(value[0])}
            min={1}
            max={20}
            step={1}
          />
        </div>

        {/* Number of Users */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">Users</label>
          <span className="text-lg font-bold text-slate-900 block mb-1.5">{users}</span>
          <Slider
            value={[users]}
            onValueChange={(value) => onUsersChange(value[0])}
            min={1}
            max={20}
            step={1}
          />
        </div>
      </div>

      {/* Desktop: Original stacked layout */}
      <div className="hidden sm:block space-y-3 lg:space-y-4">
        {/* Number of Pages Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm lg:text-base font-semibold text-slate-700">
              Number of Pages
            </label>
            <span className="text-xl lg:text-2xl font-bold text-slate-900">{pages}</span>
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
            <label className="text-sm lg:text-base font-semibold text-slate-700">
              Number of Users
            </label>
            <span className="text-xl lg:text-2xl font-bold text-slate-900">{users}</span>
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
    </div>
  );
}
