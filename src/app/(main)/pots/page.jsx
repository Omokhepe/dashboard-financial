'use client';
import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useFetchData } from '@hooks/useFetchData';
import { Progress } from '@components/ui/progress';
import DialogForm from '@components/Modal';
import { PopoverMenu } from '@components/PopoverMenu';
import { EditModal } from '@components/EditModal';
import { useDispatch, useSelector } from 'react-redux';
import { addPots, updatePots } from '@/store/action/potAction';

const Pots = () => {
  const { loading, error, data } = useFetchData('/data.json');
  const pots = useSelector((state) => state.pots);
  const dispatch = useDispatch();
  const potData = pots.pots || [];
  const colorData = data?.color || [];
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '', theme: '' });

  const [openDialog, setOpenDialog] = useState();
  const [selectedBudget, setSelectedBudget] = useState(null);

  const resultColor = colorData.map((color) => ({
    ...color,
    isExist: potData.some((b) => b.theme.toLowerCase() === color.value),
  }));

  const handleSubmit = () => {
    const nextId = potData.length > 0 ? potData[potData.length - 1].id + 1 : 1;

    dispatch(
      addPots({
        id: nextId,
        name: formData.name,
        target: parseFloat(formData.amount),
        total: 0,
        theme: formData.theme,
      })
    );
    // API call or state update goes here
  };
  const handleUpdate = (values) => {
    dispatch(
      updatePots({
        name: values.name,
        target: parseFloat(values.amount),
        theme: values.color,
        id: values.id,
      })
    );
  };

  return (
    <div className="w-full bg-beige100 px-12 py-8">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-grey900 text-3xl font-bold">Pots</h2>
        <div>
          <Button
            variant="secondary"
            className="bg-navy-grey text-grey900 hover:bg-grey900 hover:text-beige100 h-12"
            onClick={() => setOpen(true)}
          >
            <Plus />
            Add New Pot
          </Button>
          <DialogForm
            open={open}
            setOpen={setOpen}
            title="Add New Pot"
            onSave={handleSubmit}
            inputText={true}
            subTitle="Pot Name"
            amtText="Maximum Spend"
            spanText="Create a pot to set savings target."
            colors={colorData}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
      <div className="flex flex-wrap h-1/2">
        {potData.map((item, index) => {
          const { name, target, total, theme } = item;
          const percent = Math.min((total / target) * 100, 100);
          return (
            <div
              key={index}
              className="flex flex-wrap flex-col card_wrap w-4/9 h-1/2 mx-5 p-5"
            >
              <div className="flex justify-between pt-5">
                <div>
                  {' '}
                  <span
                    className="h-3 w-3 rounded-full mr-3 inline-block"
                    style={{ backgroundColor: theme }}
                  />
                  <span className="font-bold text-lg">{name}</span>
                </div>

                <PopoverMenu
                  onEdit={() => {
                    setSelectedBudget(item);
                    setOpenDialog(true);
                  }}
                  onDelete={() => alert('Delete clicked')}
                />
              </div>
              <div className="flex justify-between py-8">
                <span className="text-sm">Total Saved</span>
                <span className="text-3xl font-bold">${total.toFixed(2)}</span>
              </div>
              <Progress
                value={percent}
                className="h-2 bg-beige500"
                style={{ backgroundColor: theme }}
              />
              <div className="flex justify-between p-4">
                <span className="font-bold">{percent}%</span>
                <span>Target of ${target.toLocaleString()}</span>
              </div>

              <div className="flex justify-center m-5">
                <Button
                  variant="secondary"
                  className="bg-navy-grey text-grey900 hover:bg-grey900 hover:text-beige100 w-50 h-12 mx-4"
                >
                  <Plus />
                  Add Money
                </Button>
                <Button
                  variant="secondary"
                  className="bg-navy-grey text-grey900 hover:bg-grey900 hover:text-beige100 w-50 h-12 mx-4"
                >
                  <Minus />
                  Withdraw
                </Button>
              </div>
            </div>
          );
        })}
        <EditModal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          initialValues={
            selectedBudget
              ? {
                  color: selectedBudget.theme,
                  name: selectedBudget.name,
                  amount: selectedBudget.target.toFixed(2),
                  id: selectedBudget.id,
                }
              : { color: '', category: '', amount: '', id: '' }
          }
          onSave={(values) => {
            console.log('Updated values:', values);
            handleUpdate(values);
            setOpenDialog(false);
          }}
          title="Pot"
          color={resultColor}
          subTitle="Pot Name"
          inputText={true}
          amtText="Target"
          subtitle="Pot Name"
        />
      </div>
    </div>
  );
};

export default Pots;
