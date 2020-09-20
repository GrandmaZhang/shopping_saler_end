import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Dialog } from "@alifd/next";
import IceContainer from "@icedesign/container";
import Filter from "../Filter";
import styles from "./index.module.scss";
import { postData, getData, handleGetParams } from "@/util";

export default function GoodsTable() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTableData = (data = []) => {
    return data.map(item => {
      return {
        ...item
      };
    });
  };

  const mockApi = args => {
    return new Promise(resolve => {
      getData(
        handleGetParams("/get-all-items", { table: "goods", ...args })
      ).then(res => {
        resolve(getTableData(res.data));
      });
    });
  };

  const fetchData = useCallback(args => {
    setLoading(true);
    mockApi(args).then(mockData => {
      setData(mockData);
      setLoading(false);
    });
  });

  const handleFilterChange = e => {
    const args = e;
    mockApi({
      params: JSON.stringify({
        ...args
      })
    }).then(mockData => {
      setData(mockData);
      setLoading(false);
    });
  };

  const handleDelete = record => {
    Dialog.confirm({
      title: "提示",
      content: "确认删除吗",
      onOk: () => {
        postData("/delete-goods", { id: record.id }).then(() => {
          fetchData();
        });
      }
    });
  };

  const renderOper = (value, index, record) => {
    return (
      <div>
        <Button type="normal" warning onClick={() => handleDelete(record)}>
          删除
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <IceContainer>
        <Filter onChange={handleFilterChange} />
      </IceContainer>
      <IceContainer>
        <Table loading={isLoading} dataSource={data} hasBorder={false}>
          <Table.Column title="商品ID" dataIndex="id" />
          <Table.Column title="商品名称" dataIndex="name" width={550} />
          <Table.Column title="余量" dataIndex="remain" />
          <Table.Column title="价格" dataIndex="price" />
          <Table.Column title="总销量" dataIndex="sold" />
          <Table.Column title="商家id" dataIndex="businessId" />
          <Table.Column title="商品分类" dataIndex="categoryId" />
          <Table.Column
            title="操作"
            // width={200}
            dataIndex="oper"
            cell={renderOper}
          />
        </Table>
      </IceContainer>
    </div>
  );
}
