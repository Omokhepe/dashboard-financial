// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
//
// const AddModal = ({ isOpen, setIsOpen }) => {
//   return (
//     <Dialog>
//       <form>
//         <DialogTrigger asChild>
//           <Button variant="outline">Open Dialog</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit profile</DialogTitle>
//             <DialogDescription>
//               Make changes to your profile here. Click save when you&apos;re
//               done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4">
//             <div className="grid gap-3">
//               <label htmlFor="name-1">Name</label>
//               <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
//             </div>
//             <div className="grid gap-3">
//               <label htmlFor="username-1">Name</label>
//               <Input id="username-1" name="username" defaultValue="@peduarte" />
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// };
//
// export default AddModal;

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
  onSubmit,
  open,
  setOpen,
  colors = [],
  budgets = [],
}) {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({ name: '', amount: '' });

  const handleSubmit = () => {
    console.log('Submitted:', formData);
    // API call or state update goes here
  };

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
            onSubmit?.();
            setOpen(false);
          }}
        >
          <span className="text-xs">{spanText}</span>
          {budgets.length > 0 && (
            <div className="grid gap-2 mt-4">
              <Label htmlFor="color">{subTitle}</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="color" className="w-full">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((c, index) => (
                    <SelectItem key={index} value={c}>
                      <div className="flex items-center gap-2 h-10 ">
                        {/*<span*/}
                        {/*  className="h-4 w-4 rounded-full"*/}
                        {/*  style={{ backgroundColor: c.value }}*/}
                        {/*/>*/}
                        {c}
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
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger id="color" className="w-full">
                <SelectValue placeholder="Choose color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4 w-full">
            {/*<Button*/}
            {/*  variant="outline"*/}
            {/*  type="button"*/}
            {/*  onClick={() => setOpen(false)}*/}
            {/*>*/}
            {/*  Cancel*/}
            {/*</Button>*/}
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
