import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polaris — サロン経営AI',
  description: '売上・顧客・口コミ・コンテンツを一元管理',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
