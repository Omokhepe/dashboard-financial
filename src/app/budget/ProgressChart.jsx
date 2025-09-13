import React, { useMemo } from 'react';
import { Progress } from '@components/ui/progress';

const ProgressChart = ({ transactions, budgets }) => {
  const categorySums = useMemo(() => {
    if (!transactions || !budgets) return {};

    return budgets.reduce((acc, budget) => {
      const total = transactions
        .filter((tx) => tx.category === budget.category)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      acc[budget.category] = total;
      return acc;
    }, {});
  }, [transactions, budgets]);

  return (
    <div className="grid gap-6">
      {budgets.map((b) => {
        const used = categorySums[b.category] || 0;
        const percent = Math.min((used / b.maximum) * 100, 100);

        return (
          <div
            key={b.category}
            className="p-4 rounded-xl shadow-md border bg-white space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: b.theme }}>
                {b.category}
              </span>
              <span className="text-sm text-gray-600">
                ${used.toFixed(2)} of ${b.maximum}
              </span>
            </div>
            <Progress
              value={percent}
              className="h-5 bg-beige500"
              style={{ backgroundColor: b.theme }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProgressChart;
