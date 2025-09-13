import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis, MoreHorizontal } from 'lucide-react';
import React from 'react';

export function PopoverMenu({ onEdit, onDelete }) {
  // console.log(setSelected, selected);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis className="hover:scale-105 cursor-pointer hover:shadow-lg duration-200 w-6" />
        </Button>
        {/*<Ellipsis className="hover:scale-105 cursor-pointer hover:shadow-lg duration-200" />*/}
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <div className="flex flex-col space-y-1">
          <Button variant="ghost" className="justify-start" onClick={onEdit}>
            Edit
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-red-600"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
