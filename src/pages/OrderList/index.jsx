import React from 'react';
import Table from './components/Table';
import PageHead from '@/components/PageHead';

export default function Dispatch() {
  return (
    <div>
      <PageHead title="订单管理" />
      <Table />
    </div>
  );
}
