'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DeleteDialog({
  onConfirm,
  openDelete,
  initialValues,
  setOpenDelete,
}) {
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {formData.name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this pot? This Action cannot be
            reversed and all data in it will be removed forever
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm(formData.id);
              setOpenDelete(false);
            }}
            className="w-full block cursor-pointer"
          >
            Yes, Confirm Delete
          </Button>
          <Button
            variant="outline"
            className="w-full block"
            onClick={() => setOpenDelete(false)}
          >
            No, Go back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
