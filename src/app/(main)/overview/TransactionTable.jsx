import React from 'react';
import Image from 'next/image';
import { formatAmount, formatDate } from '@/utils/formatData';
import { useRouter } from 'next/navigation';

const TransactionTable = ({ transactions }) => {
  const router = useRouter();
  console.log(transactions);

  return (
    <div className="p-6">
      <div className="flex justify-between pb-2">
        <h4 className="font-bold">Transaction</h4>
        <h6
          className="hover:scale-105 font-light text-sm cursor-pointer"
          onClick={() => router.push('/transaction')}
        >
          See Details
        </h6>
      </div>
      {transactions.slice(0, 5).map((transaction, index) => {
        const { avatar, name, date, amount } = transaction;
        const { amt, color } = formatAmount(amount);
        return (
          <div
            key={index}
            className="flex justify-between mb-3 py-3 border-b border-gray-200"
          >
            <span className="flex flex-row items-center gap-4 font-bold">
              <Image
                src={avatar}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-2xl"
              />
              {name}
            </span>
            <div className="justify-end">
              <h4 className={`${color} font-bold justify-self-end`}>{amt}</h4>
              <h6 className="text-sm">{formatDate(date)}</h6>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionTable;
