/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { Table } from "@alifd/next";
import IceContainer from "@icedesign/container";
import Overview from "@/components/Overview";
import { getData, handleGetParams } from '@/util';

const switchStatus = (status) => {
  switch (status) {
    case 0:
      return '已完成';
    case 1:
      return '已下单';
    case 2:
      return '商家取消中';
    case 3:
      return '用户取消中';
    case 4:
      return '已取消';
    default:
      return '已下单';
  }
};

const getOverviewData = (data = []) => {
  return [
    {
      title: "发货单(笔)",
      value: data.length,
    },
    {
      title: "发货数量(件)",
      value: data.length && data.map(item => JSON.parse(item.goods).length).reduce((prev, curr) => prev + curr),
    },
    {
      title: "发货金额(元)",
      value: data.length && data.map(item => JSON.parse(item.goods).map(_ => parseFloat(_.price * _.goodsNumber)).reduce((prev, curr) => prev + curr)).reduce((prev, curr) => prev + curr).toFixed(2),
    },
  ];
};

const getTableData = (data = []) => {
  return data.map(item => {
    return {
      ...item,
      id: item.id,
      createTime: item.createTime,
      userId: item.userId,
      status: item.status,
      price: JSON.parse(item.goods).map(_ => parseFloat(_.price * _.goodsNumber)),
    };
  });
};

export default function ChargeBackTable() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [overviewData, setOverviewData] = useState(getOverviewData());

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mockApi = () => {
    return new Promise(resolve => {
      getData(handleGetParams('/get-all-items', { table: 'orders', params: JSON.stringify({
        status: 0,
      }) })).then(res => {
        resolve(getTableData(res.data));
      });
    });
  };

  const fetchData = useCallback(async() => {
    await setLoading(true);
    mockApi().then(mockData => {
      setData(mockData);
      setLoading(false);
      setOverviewData(getOverviewData(mockData));
    });
  });

  return (
    <div>
      <Overview data={overviewData} col="3" />
      <IceContainer>
        <Table loading={isLoading} dataSource={data} hasBorder={false}>
          <Table.Column title="订单号" dataIndex="id" />
          <Table.Column title="客户id" dataIndex="userId" />
          <Table.Column title="下单时间" dataIndex="createTime" />
          <Table.Column title="订单状态" dataIndex="status" cell={(value) => (<span>{switchStatus(value)}</span>)} />
          <Table.Column title="价格" dataIndex="price" />
        </Table>
      </IceContainer>
    </div>
  );
}
