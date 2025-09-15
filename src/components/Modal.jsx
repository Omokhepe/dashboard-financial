'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Input } from '@components/ui/input';

export default function DialogForm({
  title = 'Add New',
  subTitle = 'Budget',
  amtText,
  inputText,
  spanText,
  children,
  onSave,
  open,
  setOpen,
  colors = [],
  budgets = [],
  formData,
  setFormData,
}) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
            setOpen(false);
          }}
        >
          <span className="text-xs">{spanText}</span>
          {budgets.length > 0 && (
            <div className="grid gap-2 mt-4">
              <Label htmlFor="color">{subTitle}</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setFormData({ ...formData, category: value });
                }}
              >
                <SelectTrigger id="color" className="w-full">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {budgets.map((c, index) => (
                    <SelectItem
                      key={index}
                      value={c.category}
                      disabled={c.isExist}
                      className="flex justify-between"
                    >
                      <div
                        className={`flex items-center w-full gap-2 justify-between h-10 `}
                      >
                        {c.category}
                        {c.isExist && (
                          <span className="text-sm ml-42 flex justify-self-end">
                            Already Used
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {inputText && (
            <div className="grid gap-2">
              <Label htmlFor="name">{subTitle}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="amount">{amtText}</Label>
            <Input
              id="amount"
              type="number"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          {children}

          {/* Always show color dropdown */}
          <div className="grid gap-2">
            <Label htmlFor="color">Theme Color</Label>
            <Select
              value={selectedColor}
              onValueChange={(value) => {
                setSelectedColor(value);
                setFormData({ ...formData, theme: value });
              }}
            >
              <SelectTrigger id="color" className="w-full">
                <SelectValue placeholder="Choose color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c, index) => (
                  <SelectItem key={index} value={c.value} disabled={c.isExist}>
                    <div className="flex items-center justify-evenly gap-2">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.name}
                      {c.isExist && (
                        <span className="text-sm ml-42 flex justify-self-end">
                          Already Used
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4 w-full">
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
