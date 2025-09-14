'use client';
import React, { useState } from 'react';
import PotIcon from '@assets/images/icon-nav-pots.svg';
import { useFetchData } from '@hooks/useFetchData';
import TransactionTable from '@/app/(main)/overview/TransactionTable';
import OverviewBudget from '@/app/(main)/overview/OverviewBudget';
import { formatFigures } from '@/utils/formatData';
import OverviewBill from '@/app/(main)/overview/OverviewBill';
import { useRouter } from 'next/navigation';

const Overview = () => {
  const router = useRouter();
  const { loading, error, data } = useFetchData('/data.json');

  const [isActive, setIsActive] = useState('current');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data found</p>;

  const { balance, transactions, budgets, pots } = data;

  const balanceCards = [
    { id: 'current', label: 'Current Balance', value: balance?.current },
    { id: 'income', label: 'Income', value: balance?.income },
    { id: 'expenses', label: 'Expenditure', value: balance?.expenses },
  ];

  const potsTotal = pots.reduce((sum, pot) => sum + pot.total, 0);

  return (
    <div className="w-full bg-beige100 px-10 py-8">
      <h2 className="text-grey900 text-3xl font-bold pb-4">Overview</h2>

      <div className="flex gap-16">
        {balanceCards.map((card, index) => {
          const active = isActive === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setIsActive(card.id)}
              className={`flex flex-col w-1/4 rounded-xl justify-center pl-4 py-6 cursor-pointer transition-all duration-200 ease-in-out
                        ${active ? 'bg-grey900 text-white scale-105 shadow-xl' : 'bg-white text-black shadow-md hover:scale-105 hover:shadow-lg'}`}
            >
              <h6 className="font-public text-xs">{card.label}</h6>
              <h5 className="font-public text-3xl font-bold">
                $
                {card.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h5>
            </div>
          );
        })}
      </div>

      <div className="flex gap-10 w-full">
        <div className="w-3/5">
          <div className="flex flex-col card_wrap">
            <div className="flex justify-between px-4">
              <h4 className="font-bold">Pots</h4>
              <h6
                className="hover:scale-105 cursor-pointer font-light text-sm"
                onClick={() => router.push('/pots')}
              >
                See Details
              </h6>
            </div>
            <div className="flex justify-between p-5">
              <div className="flex flex-1 items-center gap-4 bg-beige100">
                <PotIcon className="w-6 h-6 fill-current text-green [&>path]:fill-current" />
                <div>
                  <h6 className="text-xs">Total Saved</h6>
                  <h5 className="text-3xl">${potsTotal}</h5>
                </div>
              </div>

              <div className="flex flex-wrap flex-1 pl-3">
                {pots.slice(0, 4).map((item, i) => {
                  return (
                    <div
                      key={i}
                      className={`w-1/2 border-l-3 pl-3 pb-3`}
                      style={{ borderColor: item.theme }}
                    >
                      <h6 className="text-xs">{item.name}</h6>
                      <h5 className="font-bold">${item.total}</h5>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col card_wrap">
            <TransactionTable transactions={transactions} />
          </div>
        </div>

        <div className="w-2/5">
          <div className="flex flex-col card_wrap">
            <div className="flex justify-between px-4">
              <h4 className="font-bold">Budget</h4>
              <h6
                className="hover:scale-105 cursor-pointer font-light text-sm"
                onClick={() => router.push('/budget')}
              >
                See Details
              </h6>
            </div>
            <div className="flex justify-between p-5 items-center">
              <OverviewBudget budgets={budgets} />
              <div className="pb-4 ">
                {budgets.map((budget, i) => {
                  return (
                    <div
                      key={i}
                      className={`border-l-3  pl-4 pb-4`}
                      style={{ borderColor: budget.theme }}
                    >
                      <h6 className="text-sm">{budget.category}</h6>
                      <h5 className="text-xl font-bold">
                        ${formatFigures(budget.maximum)}
                      </h5>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col card_wrap">
            <div className="flex justify-between px-4">
              <h4 className="font-bold">Recurring Bills</h4>
              <h6
                className="hover:scale-105 cursor-pointer font-light text-sm"
                onClick={() => router.push('/bills')}
              >
                See Details
              </h6>
            </div>
            <div className="flex justify-between p-5 items-center">
              <OverviewBill transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
