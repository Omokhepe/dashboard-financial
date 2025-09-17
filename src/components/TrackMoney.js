'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';

const TrackMoney = ({
  onConfirm,
  trackMoney,
  initialValues,
  setTrackMoney,
  progressPercent,
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [inputAmount, setInputAmount] = useState(0);
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);
  useEffect(() => {
    const newPercent =
      Math.min(
        ((Number(inputAmount) + Number(formData.total)) /
          Number(formData.amount)) *
          100,
        100
      ) - progressPercent;

    setPercent(newPercent);
    // console.log(newPercent, progressPercent, percent, 'please work');
  }, [inputAmount, progressPercent, formData.amount, formData.total]);

  const newAmount = Number(inputAmount) + Number(formData.total);

  const handleSubmit = () => {
    onConfirm(formData);
    // setFormData({ amount: '', category: '', theme: '' });
    setInputAmount(0);
    setTrackMoney(false);
    // useEffect(() => {
    //   setFormData({
    //     ...formData,
    //     total: newAmount,
    //   });
    // });
  };

  // console.log(percent, formData);

  return (
    <Dialog open={trackMoney} onOpenChange={setTrackMoney}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to {formData.name}</DialogTitle>
          <DialogDescription>
            Add money to your pot to keep it separate from your main balance. As
            soon as you add this money, it will be deducted from your current
            balance.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between text-xs items-center">
          <span>New Amount</span>
          <span className="text-3xl font-bold font-public">
            ${newAmount.toFixed(2)}
          </span>
        </div>

        {/*progress bar*/}
        <div className="w-full h-3 bg-gray-200 rounded overflow-hidden flex">
          {/* Initial (red) */}
          <div
            className="h-4 bg-yellow"
            style={{
              width: `${progressPercent}%`,
              // backgroundColor: 'red',
            }}
          />
          <span className="h-3 w-1 bg-beige500" />

          {/* Added (theme color) */}
          <div
            className="h-4 bg-red"
            style={{
              width: `${percent > 0 ? percent : 0}%`,
              backgroundColor: formData.color,
            }}
          />
        </div>

        <div className="flex justify-between text-xs">
          <span style={{ color: formData.theme }}>
            {(percent + progressPercent).toFixed(2)}%
          </span>
          <span>Target of ${formData.amount}</span>
        </div>

        <Label htmlFor="amount-input">Amount to Add</Label>
        <Input
          placeholder="Amount"
          type="number"
          value={inputAmount}
          onChange={
            (e) => {
              setInputAmount(e.target.value);
              setFormData({ ...formData, inputAmount: e.target.value });
            }

            // amount: e.target.value,
          }
          id="amount-input"
        />

        <div className="flex flex-col gap-2">
          {/*<Button*/}
          {/*  variant="destructive"*/}
          {/*  onClick={() => {*/}
          {/*    onConfirm(formData);*/}
          {/*    setTrackMoney(false);*/}
          {/*  }}*/}
          {/*  className="w-full block cursor-pointer"*/}
          {/*>*/}
          {/*  Yes, Confirm Delete*/}
          {/*</Button>*/}
          <Button
            variant="outline"
            className="w-full block bg-grey900 text-beige100"
            onClick={handleSubmit}
          >
            Confirm Addition
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackMoney;
