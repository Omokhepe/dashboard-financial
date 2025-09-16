'use client';
import React, { useMemo, useState } from 'react';
import { Button } from '@components/ui/button';
import { Plus, CircleChevronRightIcon } from 'lucide-react';
import { useFetchData } from '@hooks/useFetchData';
import OverviewBudget from '@/app/(main)/overview/OverviewBudget';
import { Progress } from '@components/ui/progress';
import Image from 'next/image';
import { formatDate } from '@/utils/formatData';
import DialogForm from '@components/Modal';
import { PopoverMenu } from '@components/PopoverMenu';
import { EditModal } from '@components/EditModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBudget,
  deleteBudget,
  updateBudget,
} from '@/store/action/budgetAction';
import DeleteDialog from '@components/DeleteModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';

const Budget = () => {
  const router = useRouter();
  const { loading, error, data } = useFetchData('/data.json');
  const budgetData = useSelector((state) => state.budget.budgets);
  const dispatch = useDispatch();
  const transactions = data?.transactions || [];
  const color = data?.color || [];
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [open, setOpen] = useState(false); //modal state
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    theme: '',
  }); // form state

  // This filters the transaction categories to get unique values, and then checks for also existing cat in budget array
  const resultBudget = [...new Set(transactions.map((t) => t.category))].map(
    (cat) => ({
      category: cat,
      isExist: budgetData.some((b) => b.category === cat),
    })
  );

  const resultColor = color.map((color) => ({
    ...color,
    isExist: budgetData.some((b) => b.theme.toLowerCase() === color.value),
  }));

  const handleSave = (values) => {
    const nextId =
      budgetData.length > 0 ? budgetData[budgetData.length - 1].id + 1 : 1;
    // API call or state update goes here

    dispatch(
      addBudget({
        id: nextId,
        category: formData.category,
        maximum: parseFloat(formData.amount),
        theme: formData.theme,
      })
    );

    setFormData({ amount: '', category: '', theme: '' });
    setOpen(false);
    setOpenDialog(false);
  };
  const handleUpdate = (values) => {
    dispatch(
      updateBudget({
        category: values.category,
        maximum: parseFloat(values.amount),
        theme: values.color,
        id: values.id,
      })
    );
  };
  const handleDelete = (id) => {
    dispatch(
      deleteBudget({
        id: id,
      })
    );
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

  const handleSeeMore = (value) => {
    router.push(`/transaction?category=${encodeURIComponent(value.category)}`);
  };

  return (
    <div className="w-full bg-beige100 px-12 py-8">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-grey900 text-3xl font-bold">Budget</h2>

        <div>
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
            onSave={handleSave}
            subTitle="Budget Category"
            amtText="Maximum Spend"
            budgets={resultBudget}
            spanText="Choose a category to set a spendig budget"
            colors={resultColor}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>

      <div className="flex h-screen">
        <div className="flex-1/3 bg-white m-5 rounded-lg card_wrap min-h-1/12">
          <div className="flex justify-center">
            <OverviewBudget budgets={budgetData} />
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
                    of ${budget.maximum}
                  </h6>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-3/5 my-5 pb-4 overflow-y-auto">
          <div className="grid gap-6 ">
            {budgetData.map((b, index) => {
              const used = augustSums.sums[b.category] || 0;
              const percent = Math.min((used / b.maximum) * 100, 100);
              const difference = Math.min(b.maximum - used);
              const arrayTrans = augustSums.lists[b.category];

              return (
                <Accordion
                  type="single"
                  collapsible
                  // className="w-full"
                  defaultValue={index}
                  key={index}
                  className=" w-full p-4 rounded-xl shadow-md border bg-white space-y-2"
                >
                  <AccordionItem value="item-1">
                    <div className="flex justify-between pt-5">
                      <div>
                        <span
                          className="h-3 w-3 rounded-full mr-2 inline-block"
                          style={{ backgroundColor: b.theme }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: b.theme }}
                        >
                          {b.category}
                        </span>
                      </div>

                      <PopoverMenu
                        onEdit={() => {
                          setSelectedBudget(b);
                          setOpenDialog(true);
                        }}
                        onDelete={() => {
                          setSelectedBudget(b);
                          setOpenDelete(true);
                        }}
                      />
                    </div>
                    <h5 className="text-sm text-gray-600">
                      Maximum of ${b.maximum}
                    </h5>
                    <Progress
                      value={percent}
                      className="h-6 bg-beige500"
                      style={{ backgroundColor: b.theme }}
                    />

                    <div className="flex justify-evenly items-center">
                      <span style={{ color: b.theme }}>${used.toFixed(2)}</span>
                      <span>${difference.toFixed(2)}</span>
                    </div>
                    <AccordionContent className="bg-beige100 rounded-lg border space-y-2">
                      <div className="flex justify-between p-4">
                        <span>Latest Spending</span>
                        <span
                          onClick={() => {
                            handleSeeMore(b);
                          }}
                          className="flex gap-4 items-center cursor-pointer hover:text-beige500 transition-all duration-200 ease-in-out"
                        >
                          See All
                          <CircleChevronRightIcon />
                        </span>
                      </div>
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
                              <h4>${amount.toFixed(2)}</h4>
                              <h6 className="text-sm">{formatDate(date)}</h6>
                            </div>
                          </div>
                        );
                      })}
                    </AccordionContent>
                    <AccordionTrigger className="flex justify-center"></AccordionTrigger>
                  </AccordionItem>
                </Accordion>
              );
            })}
            <EditModal
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              initialValues={
                selectedBudget
                  ? {
                      color: selectedBudget.theme,
                      category: selectedBudget.category,
                      amount: selectedBudget.maximum.toFixed(2),
                      id: selectedBudget.id,
                    }
                  : { color: '', category: '', amount: '', id: '' }
              }
              onSave={(values) => {
                handleUpdate(values);
                setOpenDialog(false);
              }}
              categories={resultBudget}
              title="Budget"
              color={resultColor}
              subTitle="Budget Category"
              amtText="Maximum Spend"
            />
            <DeleteDialog
              openDelete={openDelete}
              setOpenDelete={setOpenDelete}
              onClose={() => setOpenDelete(false)}
              initialValues={
                selectedBudget
                  ? {
                      name: selectedBudget.category,
                      id: selectedBudget.id,
                    }
                  : { name: '', id: '' }
              }
              onConfirm={(value) => {
                handleDelete(value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
