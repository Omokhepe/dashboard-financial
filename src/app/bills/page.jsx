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
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFetchData } from '@hooks/useFetchData';
import {
  ArrowBigLeft,
  ArrowBigRight,
  CircleAlert,
  CircleCheck,
} from 'lucide-react';
import BillIcon from '@assets/images/icon-nav-recurring-bills.svg';
import { log } from 'next/dist/server/typescript/utils';

const columns = [
  {
    accessorKey: 'name',
    header: 'Bill Title',
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
    accessorKey: 'date',
    header: 'Transaction Date',
    cell: ({ row }) => {
      const { date, status } = row.original;
      return (
        <span
          className={`${status === 'paidBill' ? 'text-green' : ''} font-bold flex gap-4`}
        >
          {date}
          {status === 'paidBill' && <CircleCheck />}
          {status === 'almostDue' && <CircleAlert className="text-red" />}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const { amount, status } = row.original;
      return (
        <span
          className={`${status === 'almostDue' ? 'text-red' : ''} font-bold`}
        >
          $
          {Math.abs(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
];

const Bills = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sortBy, setSortBy] = React.useState('latest');
  const { loading, error, data } = useFetchData('/data.json');

  const transactions = data?.transactions || [];

  // ✅ Filtering by sort logic
  // This filters the transaction array where recurring is true and date is most recent...
  // I also include a status key to help me with the color styling and some computations
  const filteredData = React.useMemo(() => {
    let filtered = [...transactions];

    const today = new Date();
    const todayDay = today.getDate();

    // 1. Filter recurring only
    const recurringTx = transactions.filter((tx) => tx.recurring);

    // 2. Group by name and pick latest
    const grouped = recurringTx.reduce((acc, tx) => {
      const existing = acc[tx.name];
      if (!existing || new Date(tx.date) > new Date(existing.date)) {
        acc[tx.name] = tx;
      }
      return acc;
    }, {});

    // 3. Convert back to array
    const results = Object.values(grouped).map((tx) => {
      const txDate = new Date(tx.date);
      const day = txDate.getDate();

      // Add suffix for day
      const suffix =
        day % 10 === 1 && day !== 11
          ? 'st'
          : day % 10 === 2 && day !== 12
            ? 'nd'
            : day % 10 === 3 && day !== 13
              ? 'rd'
              : 'th';

      // Compare to today
      let status = 'upcoming';
      if (day < todayDay) {
        status = 'paidBill';
      } else if (day >= todayDay && day <= todayDay + 7) {
        status = 'almostDue';
      }

      return {
        ...tx,
        date: `Monthly-${day}${suffix}`,
        status,
      };
    });

    const sums = results.reduce(
      (acc, tx) => {
        const amt = Math.abs(tx.amount);
        acc[tx.status] += amt;
        // acc[tx.status].length;
        console.log(acc, 'acc');
        return acc;
      },
      { paidBill: 0, almostDue: 0, upcoming: 0 }
    );

    filtered = {
      results,
      totals: {
        ...sums,
        grandTotal: sums.paidBill + sums.upcoming,
      },
    };
    console.log(filtered);

    // ✅ Sorting
    if (sortBy === 'latest') {
      filtered.results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'A-Z') {
      filtered.results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Z-A') {
      filtered.results.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'highest') {
      filtered.results.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'lowest') {
      filtered.results.sort((a, b) => a.amount - b.amount);
    }

    return filtered;
  }, [transactions, sortBy]);

  const table = useReactTable({
    data: filteredData.results,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // to simplify the summary portion
  const { almostDue, upcoming, paidBill } = filteredData.totals;

  const billSummary = [
    {
      title: 'Paid Bills',
      amt: paidBill,
    },
    {
      title: 'Total Upcoming',
      amt: upcoming,
    },
    {
      title: 'Due Soon',
      amt: almostDue,
      isOwe: true,
    },
  ];
  const Icon = BillIcon;

  return (
    <div className="w-full h-full bg-beige100 px-12 py-8">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-grey900 text-3xl font-bold">Recurring Bills</h2>
      </div>

      <div className="flex">
        <div className=" w-1/3 gap-3">
          <div className="card_wrap bg-grey900 h-50 text-white p-5">
            <Icon
              className={`w-9 h-9 fill-current transition [&>path]:fill-current`}
            />

            <div className="py-8">
              <h6 className="text-sm">Total Bill</h6>
              <span className="font-bold text-3xl">
                ${filteredData.totals.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="card_wrap bg-white h-56 text-grey900 p-5">
            <span className="font-bold text-2xl">Summary</span>
            {billSummary
              .filter((item) => item.amt !== 0)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between mb-3 py-3 border-b border-gray-200"
                >
                  <span className={`text-grey500 ${item.isOwe && 'text-red'}`}>
                    {item.title}
                  </span>
                  <span className={`font-bold ${item.isOwe && 'text-red'}`}>
                    ${item.amt.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 m-6 rounded-lg w-2/3 shadow-lg">
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
                  <TableRow key={row.id} className="hover:bg-yellow h-15">
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
    </div>
  );
};

export default Bills;
