import OverviewIcon from '@assets/images/icon-nav-overview.svg';
import TransactionIcon from '@assets/images/icon-nav-transactions.svg';
import BudgetIcon from '@assets/images/icon-nav-budgets.svg';
import PotIcon from '@assets/images/icon-nav-pots.svg';
import BillIcon from '@assets/images/icon-nav-recurring-bills.svg';
// import MinimizeIcon from '/public/asset/images/icon-minimize-menu.svg'

export const navLinks = [
  { href: '/overview', label: 'Overview', icon: OverviewIcon },
  { href: '/transaction', label: 'Transaction', icon: TransactionIcon },
  { href: '/budget', label: 'Budget', icon: BudgetIcon },
  { href: '/pots', label: 'Pots', icon: PotIcon },
  { href: '/bills', label: 'Recurring Bills', icon: BillIcon },
];
