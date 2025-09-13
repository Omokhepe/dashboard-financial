import React from 'react';

const OverviewBill = ({ transactions }) => {
  const recurringBills = transactions.filter((item) => item.recurring);

  const groupRecurringBills = recurringBills.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = 0;

    acc[item.category] += item.amount;
    return acc;
  }, {});
  // console.log(groupRecurringBills);
  return (
    <div className="flex flex-col w-full">
      {Object.entries(groupRecurringBills)
        .slice(0, 3)
        // .filter(([_, total]) => total > 0)
        .map(([category, total], index) => {
          console.log(total, category);
          return (
            <div
              key={index}
              className="flex gap-y-2 justify-between p-5 bg-beige500 rounded-md mb-4"
            >
              <h5>{category}</h5>
              <h6 className="font-bold">${Math.abs(total).toFixed(2)}</h6>
            </div>
          );
        })}
    </div>
  );
};

export default OverviewBill;
