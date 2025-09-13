// components/EditDialog.tsx
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
  categories,
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

        <div className="space-y-4">
          <Select
            value={formValues.category}
            onValueChange={(value) =>
              setFormValues({ ...formValues, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat, index) => (
                <SelectItem key={index} value={cat.category}>
                  {cat.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Category"
            value={formValues.category}
            onChange={(e) =>
              setFormValues({ ...formValues, category: e.target.value })
            }
          />
          <Input
            placeholder="Amount"
            type="number"
            value={formValues.amount}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                amount: parseFloat(e.target.value),
              })
            }
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(formValues)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
