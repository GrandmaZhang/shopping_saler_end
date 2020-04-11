import React from 'react';
import { withRouter } from 'react-router-dom';
import Table from './components/Table';
import PageHead from '@/components/PageHead';

function Goods() {

  return (
    <div>
      <PageHead
        title="商品管理"
      />
      <Table />
    </div>
  );
}

export default withRouter(Goods);
