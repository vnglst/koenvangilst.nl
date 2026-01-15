import { Metadata } from 'next';
import { DashboardStats } from './DashboardStats';

export const metadata: Metadata = {
  title: 'Dashboard - Koen van Gilst',
  description: 'Analytics dashboard showing visitor statistics and most visited pages'
};

export default function DashboardPage() {
  return (
    <div className="mb-10 min-h-screen w-full p-4 md:px-8">
      <div className="prose dark:prose-invert mb-8">
        <h1>Analytics Dashboard</h1>
        <p>
          Overview of visitor statistics and the most visited pages across different time periods. Data is collected
          via Plausible Analytics, a privacy-friendly analytics platform.
        </p>
      </div>
      <DashboardStats />
    </div>
  );
}
