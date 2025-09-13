'use client';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ellipsis, Plus } from 'lucide-react';
import { useFetchData } from '@hooks/useFetchData';
import OverviewBudget from '@/app/overview/OverviewBudget';
import { Progress } from '@components/ui/progress';
import Image from 'next/image';
import { formatDate } from '@/utils/formatData';
import DialogForm from '@components/Modal';
import { PopoverMenu } from '@components/PopoverMenu';
import { EditModal } from '@components/EditModal';

const Budget = () => {
  const { loading, error, data } = useFetchData('/data.json');
  const budgetData = data?.budgets || [];
  const transactions = data?.transactions || [];
  const color = data?.color || [];
  const [isOpen, setIsOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '' });
  const categories = [...new Set(transactions.map((t) => t.category))];
  const [openDialog, setOpenDialog] = useState();
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleSubmit = () => {
    console.log('Submitted:', formData);
    // API call or state update goes here
  };

  const augustSums = useMemo(() => {
    if (!transactions || !budgetData) return { sums: {}, lists: {} };

    // Get start and end of August 2024
    const start = new Date('2024-08-01');
    const end = new Date('2024-08-31T23:59:59');

    return budgetData.reduce(
      (acc, budget) => {
        // 1. Sum for August range
        const total = transactions
          .filter((tx) => {
            const txDate = new Date(tx.date);
            return (
              tx.category === budget.category &&
              txDate >= start &&
              txDate <= end
            );
          })
          .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        // 2. All transactions for this category (no date restriction)
        const txList = transactions.filter(
          (tx) => tx.category === budget.category
        );

        acc.sums[budget.category] = total;
        acc.lists[budget.category] = txList;

        return acc;
      },
      { sums: {}, lists: {} }
    );
  }, [transactions, budgetData]);

  // const budgetCat = useMemo(() => {
  //   if (!transactions || !budgetData) return [];
  //
  //   // return budgetData.map((budget) => ({
  //   //   // ...budget,
  //   //   transactions: transactions.filter(
  //   //     (tx) => tx.category === budget.category
  //   //   ),
  //   // }));
  //
  //   return transactions.filter((tx) =>
  //     budgetData.some((budget) => budget.category === tx.category)
  //   );
  // }, [transactions, budgetData]);
  //
  return (
    <div className="w-full bg-beige100 px-12 py-8">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-grey900 text-3xl font-bold">Budget</h2>
        {/*<AddModal isOpen={isOpen} setIsOpen={setIsOpen} />*/}
        {/*<Button*/}
        {/*  variant="secondary"*/}
        {/*  className="bg-navy-grey text-grey900 hover:bg-grey900 hover:text-beige100 h-12"*/}
        {/*  onClick={() => setIsOpen(true)}*/}
        {/*>*/}
        {/*  <Plus />*/}
        {/*  Add New Budget*/}
        {/*</Button>*/}

        <div>
          {/* Your existing button */}
          <Button
            variant="secondary"
            className="bg-navy-grey text-grey900 hover:bg-grey900 hover:text-beige100 h-12"
            onClick={() => setOpen(true)}
          >
            <Plus />
            Add New Budget
          </Button>

          {/* Reusable dialog */}
          <DialogForm
            open={open}
            setOpen={setOpen}
            title="Add New Budget"
            onSubmit={handleSubmit}
            subTitle="Budget Category"
            amtText="Maximum Spend"
            budgets={categories}
            spanText="Choose a category to set a spendig budget"
            colors={color}
          />
        </div>
      </div>
      {/*<OverviewBudget budgets={budgetData} />*/}
      <div className="flex">
        <div className="flex-1/3 bg-white m-5 rounded-lg card_wrap h-1/2">
          <div className="flex justify-center">
            <OverviewBudget budgets={budgetData} transactions={transactions} />
          </div>
          <div className="p-7">
            <h4 className="font-bold text-xl ">Spending Summary</h4>
            {budgetData.map((budget, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row justify-between p-2 text-sm border-l-3 "
                  style={{ borderColor: budget.theme }}
                >
                  <h5>{budget.category}</h5>
                  <h6>
                    <span className="font-bold">
                      ${augustSums.sums[budget.category]?.toFixed(2) || 0}{' '}
                    </span>
                    of ${budget.maximum.toFixed(2)}
                  </h6>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-3/5 my-5">
          <div className="grid gap-6 ">
            {budgetData.slice(0, 3).map((b, index) => {
              const used = augustSums.sums[b.category] || 0;
              const percent = Math.min((used / b.maximum) * 100, 100);
              const difference = Math.min(b.maximum - used);
              const arrayTrans = augustSums.lists[b.category];

              return (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-md border bg-white space-y-2"
                >
                  <div className="flex justify-between pt-5">
                    <div>
                      <span
                        className="h-3 w-3 rounded-full mr-2 inline-block"
                        style={{ backgroundColor: b.theme }}
                      />
                      <span className="font-medium" style={{ color: b.theme }}>
                        {b.category}
                      </span>
                    </div>

                    {/*<Ellipsis className="hover:scale-105 cursor-pointer hover:shadow-lg duration-200" />*/}
                    <PopoverMenu
                      onEdit={() => {
                        setSelectedBudget(b);
                        setOpenDialog(true);
                      }}
                      onDelete={() => alert('Delete clicked')}
                    />
                    <EditModal
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      initialValues={
                        selectedBudget
                          ? {
                              color: selectedBudget.theme,
                              category: selectedBudget.category,
                              amount: selectedBudget.maximum.toFixed(2),
                            }
                          : { color: '', category: '', amount: '' }
                      }
                      onSave={(values) => {
                        console.log('Updated values:', values);
                        setOpenDialog(false);
                      }}
                      categories={budgetData}
                      title="Budget"
                      color={color}
                      subTitle="Budget Category"
                      amtText="Maximum Spend"
                    />
                  </div>
                  <h5 className="text-sm text-gray-600">
                    {/*${used.toFixed(2)} of ${b.maximum}*/}
                    Maximum of ${b.maximum}
                  </h5>
                  {/*</div>*/}
                  <Progress
                    value={percent}
                    className="h-6 bg-beige500"
                    style={{ backgroundColor: b.theme }}
                  />

                  <div className="flex justify-evenly items-center">
                    <span style={{ color: b.theme }}>${used.toFixed(2)}</span>
                    <span>${difference.toFixed(2)}</span>
                  </div>

                  <div className="bg-beige100 rounded-lg border space-y-2">
                    {arrayTrans.slice(0, 3).map((item, index) => {
                      const { avatar, name, date, amount } = item;
                      return (
                        <div
                          key={index}
                          className="flex justify-between mb-3 p-3 border-b border-gray-200"
                        >
                          <span className="flex flex-row items-center gap-4 font-bold">
                            <Image
                              src={avatar}
                              alt="avatar"
                              width={40}
                              height={40}
                              className="rounded-2xl"
                            />
                            {name}
                          </span>
                          <div className="justify-end">
                            <h4
                            // className={`${color} font-bold justify-self-end`}
                            >
                              ${amount}
                            </h4>
                            <h6 className="text-sm">{formatDate(date)}</h6>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
