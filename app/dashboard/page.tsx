import { Metadata } from 'next';
import { Main } from 'components/layout/Main';
import { Heading } from 'components/content/Heading';
import { DashboardStats } from './DashboardStats';

export const metadata: Metadata = {
  title: 'Dashboard - Koen van Gilst',
  description: 'Analytics dashboard showing the most visited pages'
};

export default function DashboardPage() {
  return (
    <Main>
      <div className="mb-8">
        <Heading level={1}>Dashboard</Heading>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of the most visited pages across different time periods
        </p>
      </div>
      <DashboardStats />
    </Main>
  );
}
