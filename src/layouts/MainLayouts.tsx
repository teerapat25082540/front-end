import React, { useRef, useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Image,
  Button,
  Input,
  Form,
  InputNumber,
  AutoComplete,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  SearchOutlined,
  MonitorOutlined,
} from "@ant-design/icons";

import { FaMapMarkedAlt, FaListAlt, FaUser } from "react-icons/fa";
import "../styles/MainLayouts.css";
import { Content } from "antd/lib/layout/layout";
import VaccineIcon from "../images/vaccine-icon.png";
import { useHistory } from "react-router-dom";
import Modal from "antd/lib/modal/Modal";
import { MapForm, map, longdo } from "../components/MapForm";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { TypeNewVaccine } from "../DataType";
import ListSearch from "../components/ListSearch";
import Swal from "sweetalert2";

const { Header, Sider } = Layout;
const { Option } = AutoComplete;

const validateMessages = {
  required: "กรุณากรอก ${label}",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

function MainLayouts({ children, page = 1, showDrawer }: any) {
  const [state, setState] = useState({
    collapsed: false,
  });
  const [modalAddData, setModalAddData] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [checkUpdate, setCheckUpdate] = useState(false);

  const addressRef = useRef<any>();
  const history = useHistory();
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";

  // initial map
  const initMap = () => {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.zoom(13);
  };

  // search address keyup
  const onKeyUpSeach = async (e: any) => {
    let res = await axios.get(
      `https://search.longdo.com/mapsearch/json/search?keyword=${e.target.value}&t=100&key=${mapKey}`
    );
    setSuggestions(res.data.data);
    checkUpdate ? setCheckUpdate(false) : setCheckUpdate(true);
  };

  const confirmSubmit = (values: any) => {
    Swal.fire({
      title: "ยืนยันการเพิ่มข้อมูลวัคซีน",
      text: "คุณต้องการเพิ่มข้อมูลวัคซีนใช่หรือไม่ ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "เพิ่มข้อมูลเรียบร้อย",
          "ขอบคุณที่แจ้งจุดฉีดวัคซีน",
          "success"
        ).then(() => onFinish(values));
      }
    });
  };

  // sunmit form success
  const onFinish = async (values: any) => {
    const newVaccine: TypeNewVaccine = {
      user_id: "1623ec45-6a6a-44c0-a577-e12439035818",
      name: values.vaccine,
      amount: Number(values.amount),
      email: "one@example.com",
      tel: "00000000",
      lat: lat,
      long: lon,
      description: values.description,
    };
    await axios.post(
      "http://localhost:4000/api/vaccine",
      JSON.stringify(newVaccine),
      { headers: { "Content-Type": "application/json" } }
    );
    setModalAddData(false);
  };

  // submit form Faile
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  // select item address
  const selectSearchItem = (item: any) => {
    setLat(item.lat);
    setLon(item.lon);
    map.Overlays.clear();
    map.Overlays.add(new longdo.Marker({ lon: item.lon, lat: item.lat }));
    map.zoom(12);
    map.location(
      { lon: item.lon, lat: item.lat },
      {
        title: "คุณอยู่ที่นี่",
      }
    );
    addressRef.current.state.value = "";
    setSuggestions([]);
  };

  const toggle = () => {
    setState({
      ...state,
      collapsed: !state.collapsed,
    });
    //console.log(state);
  };

  const selectPage = (e: any) => {
    const key = e.key;
    switch (key) {
      case "1":
        history.push("/");
        break;
      case "2":
        history.push("/test");
        break;
      default:
      //alert("break");
    }
  };

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={state.collapsed}>
          {state.collapsed ? (
            <Image className="logo" preview={false} src={VaccineIcon} />
          ) : (
            <h2 className="logo-text">Vaccine Map</h2>
          )}
          <Menu
            onSelect={(e) => selectPage(e)}
            selectedKeys={page}
            theme="dark"
            defaultSelectedKeys={["1"]}
          >
            
            <Menu.Item key="1" icon={<FaMapMarkedAlt />}>
              จุดรับวัคซีน
            </Menu.Item>
            <Menu.Item key="2" icon={<FaListAlt />}>
              จัดการข้อมูลวัคซีน
            </Menu.Item>
            <Menu.Item key="3" icon={<FaUser />}>
              เข้าสู่ระบบ
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: toggle,
              }
            )}

            {page === "1" ? (
              <>
                <Button
                  className="add-button"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalAddData(true)}
                >
                  เพิ่มข้อมูลวัคซีน
                </Button>

                <Button
                  style={{ width: 170, marginLeft: 10 }}
                  type="primary"
                  icon={<MonitorOutlined />}
                  onClick={() => showDrawer()}
                >
                  เลือกเส้นทาง
                </Button>
              </>
            ) : null}
          </Header>
          <Content className="site-layout-content">{children}</Content>
        </Layout>

        <Modal
          title="เพิ่มข้อมูลวัคซีน"
          centered
          visible={modalAddData}
          width={600}
          onCancel={() => setModalAddData(false)}
          footer={[
            <Button key="back" onClick={() => setModalAddData(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" htmlType="submit" form="myForm">
              Submit
            </Button>,
          ]}
        >
          <Form
            id="myForm"
            layout="vertical"
            name="nest-messages"
            onFinish={confirmSubmit}
            validateMessages={validateMessages}
          >
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                name="vaccine"
                label="ชื่อวัคซีน"
                rules={[{ required: true }]}
                style={{ display: "inline-block", width: "calc(50%)" }}
              >
                <Input placeholder="ชื่อวัคซีน" />
              </Form.Item>
              <Form.Item
                name="amount"
                label="จำนวน"
                rules={[{ required: true }]}
                style={{
                  display: "inline-block",
                  margin: "0 8px",
                }}
              >
                <InputNumber
                  placeholder="จำนวนโดส"
                  style={{ width: "calc(127%)" }}
                  min={1}
                  max={10}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item
              name="description"
              label="รายละเอียด"
              rules={[{ required: true }]}
            >
              <TextArea placeholder="รายละเอียด" rows={4} />
            </Form.Item>
            <Form.Item
              name="search"
              label="พิกัดที่อยู่"
              //rules={[{ required: true }]}
            >
              <Input
                prefix={<SearchOutlined />}
                onKeyUp={(e) => onKeyUpSeach(e)}
                defaultValue={addressRef.current}
                placeholder="search address"
                ref={addressRef}
              />
              <ListSearch selectItem={selectSearchItem} data={suggestions} />
            </Form.Item>
            <div style={{ height: "250px", marginTop: 10 }}>
              <MapForm id="map-form" mapKey={mapKey} callback={initMap} />
            </div>
          </Form>
        </Modal>
      </Layout>
    </>
  );
}

export default MainLayouts;
