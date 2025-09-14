'use client';
import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { useFetchData } from '@hooks/useFetchData';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';

// 1. Define columns for transaction table
const columns = [
  {
    accessorKey: 'name',
    header: 'Recipient/ Sender',
    cell: ({ row }) => {
      const { avatar, name } = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="h-8 w-8 rounded-full object-cover border"
          />
          <span className="font-medium text-sm">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'date',
    header: 'Transaction Date',
    cell: ({ row }) =>
      new Date(row.original.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <span
          className={
            amount < 0
              ? 'text-red-500 font-medium'
              : 'text-green-600 font-medium'
          }
        >
          {amount < 0
            ? `-$${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        </span>
      );
    },
  },
];

const Transaction = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('latest');
  const { loading, error, data } = useFetchData('/data.json');

  // ✅ only runs when data is ready
  const transactions = data?.transactions || [];

  // ✅ Filtering by category and sort logic
  const filteredData = React.useMemo(() => {
    let filtered = [...transactions];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // ✅ Sorting
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'A-Z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Z-A') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    return filtered;
  }, [transactions, categoryFilter, sortBy]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ✅ Get unique categories for dropdown
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  return (
    <div className="w-full bg-beige100 px-12 py-8">
      <h2 className="text-grey900 text-3xl font-bold pb-8">Transactions</h2>
      {/*Filters*/}
      <div className="bg-white p-6 rounded-lg">
        <div className="flex flex-row justify-between pb-8 w-full">
          {/*search filter*/}
          <Input
            placeholder="Search Transaction"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-2/5"
            id="search-input"
          />
          <div className="flex gap-5 items-center">
            {/*Sort Filter*/}
            <label htmlFor="sortFilter">Sort By</label>
            <Select onValueChange={setSortBy} defaultValue="latest">
              <SelectTrigger className="w-40" id="sortFilter">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="A-Z">A to Z</SelectItem>
                <SelectItem value="Z-A">Z to A</SelectItem>
                <SelectItem value="highest">Highest</SelectItem>
                <SelectItem value="lowest">Lowest</SelectItem>
              </SelectContent>
            </Select>

            {/*Category Filter*/}
            <label htmlFor="categoryFilter">Category</label>
            <Select onValueChange={setCategoryFilter} defaultValue="all">
              <SelectTrigger className="w-40" id="categoryFilter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                {categories.map((cat, index) => (
                  <SelectItem key={index} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-yellow">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`hover:scale-105 transition-all hover:shadow-lg duration-200 ease-in-out cursor-pointer`}
          >
            <ArrowBigLeft className="fill-grey900" />
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`hover:scale-105 transition-all hover:shadow-lg duration-200 ease-in-out cursor-pointer`}
          >
            Next
            <ArrowBigRight className="fill-grey900" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
