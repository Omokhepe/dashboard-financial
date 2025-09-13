import React, { useEffect, useMemo, useState } from 'react';
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { generateChartConfig } from '@/utils/formatData';

const OverviewBudget = ({ budgets, transactions }) => {
  const total = budgets.reduce((sum, item) => sum + item.maximum, 0);

  // const start = new Date('2024-08-01');
  // const end = new Date('2024-08-31T23:59:59');
  //
  // const total1 = transactions
  //   .filter((tx) => {
  //     const txDate = new Date(tx.date);
  //     return (
  //       tx.category === budgets.category && txDate >= start && txDate <= end
  //     );
  //   })
  //   .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  //
  // const sumTotal = useMemo(() => {
  //   if (!transactions || !budgets) return 0;
  //   console.log(transactions, budgets);
  //   const start = new Date('2024-08-01');
  //   const end = new Date('2024-08-31T23:59:59');
  //
  //   return transactions
  //     .filter((tx) => {
  //       const txDate = new Date(tx.date);
  //       return (
  //         tx.category === budgets.category && txDate >= start && txDate <= end
  //       );
  //     })
  //     .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  // }, [transactions]);
  //
  // console.log(total1, sumTotal);

  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      const config = generateChartConfig(budgets, 'maximum');
      setChartConfig(config);
    }
  }, [budgets]);

  // console.log({ chartConfig }, budgets);

  return (
    <Card className="flex w-2/3 flex-col shadow-none border-0">
      <CardContent className="flex-1 pb-0 px-3">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={budgets}
              dataKey="maximum"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              {budgets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.theme} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ${total.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OverviewBudget;
