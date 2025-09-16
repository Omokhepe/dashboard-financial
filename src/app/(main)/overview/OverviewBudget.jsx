import React, { useEffect, useMemo, useState } from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@components/ui/card';
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@components/ui/chart';
import { generateChartConfig } from '@/utils/formatData';

const OverviewBudget = ({ budgets }) => {
  const total = useMemo(() => {
    return budgets.reduce((sum, item) => sum + item.maximum, 0);
  }, [budgets]);

  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    if (budgets && budgets.length > 0) {
      const config = generateChartConfig(budgets, 'maximum');
      setChartConfig(config);
    }
  }, [budgets]);

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
