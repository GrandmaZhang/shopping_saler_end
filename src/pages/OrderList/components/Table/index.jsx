import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Table, Button, Dialog } from "@alifd/next";
import io from "socket.io-client";
import IceContainer from "@icedesign/container";
import Filter from "../Filter";
import Overview from "../Overview";
import styles from "./index.module.scss";
import { postData, getData, handleGetParams } from "@/util";

const getOverviewData = (data = []) => {
  return [
    {
      title: "收入货单(笔)",
      value: data.filter(item => item.status === 0).length,
      background: "#58ca9a"
    },
    {
      title: "收入数量(件)",
      value:
        data.length &&
        data
          .filter(item => item.status === 0)
          .map(item => JSON.parse(item.goods).length)
          .reduce((prev, curr) => prev + curr),
      background: "#f7da47"
    },
    {
      title: "总收入金额(元)",
      value:
        data.length &&
        data
          .filter(item => item.status === 0)
          .map(item =>
            JSON.parse(item.goods)
              .map(_ => parseFloat(_.price * _.goodsNumber))
              .reduce((prev, curr) => prev + curr)
          )
          .reduce((prev, curr) => prev + curr)
          .toFixed(2),
      background: "#ee706d"
    }
  ];
};

const switchStatus = status => {
  switch (status) {
    case 0:
      return "已完成";
    case 1:
      return "已下单";
    case 2:
      return "商家取消中";
    case 3:
      return "用户取消中";
    case 4:
      return "已取消";
    default:
      return "已下单";
  }
};

const getTableData = (data = []) => {
  return data.map(item => {
    return {
      ...item,
      id: item.id,
      createTime: item.createTime,
      userId: item.userId,
      status: item.status,
      price: JSON.parse(item.goods).map(_ =>
        parseFloat(_.price * _.goodsNumber)
      )
    };
  });
};

// const socket = io("http://localhost:7001");
export default function ReserveTable() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [overviewData, setOverviewData] = useState(getOverviewData());

  // const socketIO = useMemo(() => {
  //   return io("http://localhost:7001");
  // }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mockApi = args => {
    return new Promise(resolve => {
      getData(
        handleGetParams("/get-all-items", { table: "orders", ...args })
      ).then(res => {
        resolve(getTableData(res.data));
      });
    });
  };

  const fetchData = useCallback(async args => {
    await setLoading(true);
    mockApi(args).then(mockData => {
      setData(mockData);
      setLoading(false);
      setOverviewData(getOverviewData(mockData));
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
        postData("/delete-order", { id: record.id }).then(() => {
          fetchData();
        });
      }
    });
  };

  const socket = io("http://localhost:7001");
  useEffect(() => {
    socket.on("connect", () => {
      const id = socket.id;

      console.log("#connect,", id, socket);

      socket.emit("chat", "hello world!");
    });
    socket.on("res", msg => {
      console.log("res from server: %s!", msg);
    });
  }, []);

  const handleOk = record => {
    Dialog.confirm({
      title: "提示",
      content: "确认完成吗",
      onOk: () => {
        const orderData = {
          id: record.id,
          status: 0
        };
        const socketMsg = JSON.stringify(orderData);
        console.log(socket, "socket");
        // 通知客户端，订单状态改变
        socket.emit("statusChange", socketMsg);

        postData("/cancel-order", orderData).then(() => {
          fetchData();
        });
      }
    });
  };

  const handleCancel = record => {
    Dialog.confirm({
      title: "提示",
      content: "确认取消吗",
      onOk: () => {
        postData("/cancel-order", { id: record.id, status: 4 }).then(() => {
          fetchData();
        });
        socket.emit("statusChange", "商家取消订单");
        // postData("/order/changeStatus", { id: record.id, status: 4 }).then(
        //   () => {
        //     fetchData();
        //   }
        // );
      }
    });
  };

  const renderOper = (value, index, record) => {
    return (
      <div>
        {record.status === 3 ? (
          <Button
            type="primary"
            className={styles.btn}
            onClick={() => handleCancel(record)}
          >
            取消
          </Button>
        ) : (
          <Button
            type="primary"
            className={styles.btn}
            onClick={() => handleOk(record)}
          >
            完成
          </Button>
        )}
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
      <Overview data={overviewData} />
      <IceContainer>
        <Table loading={isLoading} dataSource={data} hasBorder={false}>
          <Table.Column title="订单号" dataIndex="id" />
          <Table.Column title="客户id" dataIndex="userId" />
          <Table.Column title="下单时间" dataIndex="createTime" />
          <Table.Column
            title="订单状态"
            dataIndex="status"
            cell={value => <span>{switchStatus(value)}</span>}
          />
          <Table.Column title="价格" dataIndex="price" />
          <Table.Column
            title="操作"
            width={200}
            dataIndex="oper"
            cell={renderOper}
          />
        </Table>
      </IceContainer>
    </div>
  );
}
