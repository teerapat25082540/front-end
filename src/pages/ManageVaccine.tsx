import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Input, Space } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import MainLayouts from "../layouts/MainLayouts";
import EditVaccineForm from "../components/EditVaccineForm";
import { map, longdo, MapEditForm } from "../components/MapEditForm";
import moment from "moment";
import Highlighter from "react-highlight-words";
import "../styles/EditVaccineForm.css";

function ManageVaccine() {
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";
  const [vaccine, setVaccine] = useState<object[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        //setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: <h4 style={{ textAlign: "center" }}>ชื่อวัคซีน</h4>,
      dataIndex: "name",
      align: "center" as "center",
      width: 100,
      key: 1,
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      // sorter: (a:any, b:any) => a.address.length - b.address.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: <h4 style={{ textAlign: "center" }}>จำนวนโดส</h4>,
      dataIndex: "amount",
      align: "center" as "center",
      width: 50,
      key: 2,
    },
    {
      title: <h4 style={{ textAlign: "center" }}>สร้างเมื่อเวลา</h4>,
      dataIndex: "createAt",
      align: "center" as "center",
      width: 100,
      key: 3,
      //sorter: (a: any, b: any) => a.name.length - b.name.length,
      ...getColumnSearchProps("createAt"),
    },
    {
      title: "รายละเอียด / แก้ไข / ลบ",
      dataIndex: "action",
      width: 150,
      align: "center" as "center",
    },
  ];

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: "ยืนยันการลบข้อมูล",
      icon: <ExclamationCircleOutlined />,
      content: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่ ?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        await axios.delete(`http://localhost:4000/api/vaccine/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        (window as any).location.reload();
      },
    });
  };

  const editVaccine = async (body: any, id: any) => {
    await axios.put(`http://localhost:4000/api/vaccine/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
    (window as any).location.reload();
  };

  const getVaccine = async () => {
    let testUserId = "a6a96d52-7748-4df5-85a1-dc96c9f0d0";
    let res = await axios(`http://localhost:4000/api/vaccine/${testUserId}`);
    let vaccineList: object[] = [];
    res.data.forEach((item: any, index: any) => {
      // init map
      const initMap = () => {
        map.Overlays.clear();
        map.Layers.setBase(longdo.Layers.GRAY);
        map.zoom(10);
        map.Overlays.add(new longdo.Marker({ lon: item.long, lat: item.lat }));
        map.location({ lon: item.long, lat: item.lat }, true);
      };

      let itemVaccine: object = {
        key: index,
        id: item.id,
        name: item.name,
        amount: item.amount,
        email: item.email,
        tel: item.tel,
        lat: item.lat,
        long: item.long,
        createAt: moment(item.createAt).format("DD MMMM YYYY hh:mm:ss"),
        action: (
          <>
            <Button
              onClick={() => {
                infoVaccine(item);
              }}
              type="primary"
              icon={<ExclamationCircleOutlined />}
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              รายละเอียด
            </Button>

            <EditVaccineForm editVaccineHandle={editVaccine} vaccine={item}>
              <MapEditForm
                id={"longdo-map" + index}
                mapKey={mapKey}
                callback={initMap}
              />
            </EditVaccineForm>

            <Button
              onClick={() => {
                confirmDelete(item.id);
              }}
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="btn-action"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              ลบข้อมูล
            </Button>
          </>
        ),
      };
      vaccineList = [...vaccineList, itemVaccine];
    });
    setVaccine(vaccineList);
  };

  const infoVaccine = async (item: any) => {
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${item.long}&lat=${item.lat}&key=${mapKey}`
    );
    let address = res.data;
    Modal.info({
      title: <h4>{item.name}</h4>,
      width: 550,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            <span>จำนวน : {item.amount} โดส</span>
            <br />
            <span>รายละเอียด : {item.description}</span>
            <br />
            <span>อีเมล : {item.email}</span>
            <br />
            <span>เบอร์ติดต่อ : {item.tel}</span>
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>ที่อยู่</span>
            <br />
            <span>
              {address.road} {address.subdistrict} {address.district}{" "}
              {address.province} {address.country}{" "}
            </span>
            <br />
          </p>
        </div>
      ),
      okText: "Ok",
      cancelText: "Cancel",
    });
  };

  useEffect(() => {
    getVaccine();
  }, [vaccine.length]);

  return (
    <>
      <MainLayouts page="2">
        <Table
          style={{ padding: 15 }}
          columns={columns}
          dataSource={vaccine}
          scroll={{ y: 520 }}
        />
      </MainLayouts>
    </>
  );
}

export default ManageVaccine;
