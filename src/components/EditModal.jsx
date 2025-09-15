'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';

export function EditModal({
  open,
  onClose,
  initialValues,
  onSave,
  title,
  subTitle,
  categories = [],
  color,
  inputText,
  amtText,
}) {
  const [formValues, setFormValues] = useState(initialValues);

  // Update when initialValues changes (important for reusability)
  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-5">
          {categories.length > 0 && (
            <div>
              {' '}
              <Label htmlFor="category">{subTitle}</Label>
              <Select
                value={formValues.category}
                onValueChange={(value) =>
                  setFormValues({ ...formValues, category: value })
                }
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c, index) => (
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
            <>
              <Label htmlFor="amount-input">{subTitle}</Label>
              <Input
                placeholder="Amount"
                type="text"
                value={formValues.name}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    name: e.target.value,
                  })
                }
                id="amount-input"
              />
            </>
          )}

          <Label htmlFor="amount-input">{amtText}</Label>
          <Input
            placeholder="Amount"
            type="number"
            value={formValues.amount}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                amount: e.target.value,
              })
            }
            id="amount-input"
          />

          <div className="grid gap-2 mt-4">
            <Label htmlFor="color">Theme</Label>
            <Select
              value={formValues.color.toLowerCase()}
              onValueChange={(value) =>
                setFormValues({ ...formValues, color: value })
              }
            >
              <SelectTrigger id="color" className="w-full">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {color.map((c, index) => (
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

          <div className="flex justify-end space-x-2 w-full">
            <Button className="w-full" onClick={() => onSave(formValues)}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
