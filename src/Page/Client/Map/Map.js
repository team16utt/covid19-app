import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import Select from "react-select";
import VnMap from "../../../Components/MapChart/VnMap";

import "./Map.css";
import PatientsList from "../../../Components/PatientsList/PatientsList";
import Position from "../../../Api/Position/Position";
import Covid19Vn from "../../../Api/Covid19Vn/Covid19Vn";
import { useToast } from "@chakra-ui/toast";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
const Map = () => {
  const [toolTip, setToolTip] = useState("");
  const [selectArr, setSelectArr] = useState([]);
  const [selectValue, setSelectValue] = useState();
  const [provinceValue, setProvinceValue] = useState([]);
  const [position, setPosition] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [patientList, setPatientList] = useState([]);

  useEffect(() => {
    const getPatientList = async () => {
      const { data } = await Covid19Vn.getPatients();
      setPatientList(data);
    };
    getPatientList();
  }, []);

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const { data } = await Covid19Vn.getProvinces();

        setProvinceValue(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProvince();
  }, []);

  useEffect(() => {
    const arr = provinceValue.map((i) => {
      return { value: i.Province_Name, label: i.Province_Name };
    });
    setSelectValue(provinceValue[42]);
    setSelectArr(arr);
  }, [provinceValue]);

  const locate = async () => {
    onClose();
    try {
      const { region, loc } = await Position.locate();
      // const { data } = await Covid19Vn.getProvinces();
      const location = loc.split(",");
      setPosition({
        latitude: location[0],
        longitude: location[1],
      });
      const [res] = provinceValue.filter((i) => i.Province_Name === region);
      if (res !== undefined) {
        setSelectValue(res);
        toast({
          position: "bottom",
          title: `Cảnh báo tình hình covid khu vực ${res.Province_Name} 😱`,
          description: `Dương tính: ${res.Confirmed} , Phục hồi: ${res.Recovered} , Tử vong: ${res.Deaths}`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSelect = (selectOption) => {
    try {
      const [selectValue] = provinceValue.filter(
        (i) => i.Province_Name === selectOption.value
      );

      if (selectValue === undefined) {
        setSelectValue({
          Province_Name: `${selectOption.value}`,
          Confirmed: 0,
          Recovered: 0,
          Deaths: 0,
        });
        return;
      }
      setSelectValue(selectValue);
      return;
    } catch (error) {
      setSelectValue({
        Province_Name: `${selectOption.value}`,
        Confirmed: 0,
        Recovered: 0,
        Deaths: 0,
      });
      return;
    }
  };

  return (
    <>
      <main className="main-content-wrapper p-0 " style={{ color: "black" }}>
        <div className="d-flex flex-wrap p-0 flex-row-reverse">
          <div className="col-md-9 map">
            <div className="map-status-colors my-0 py-1">
              <ul className="colors d-flex">
                <li>
                  <span className="min"></span>&lt;10
                </li>
                <li>
                  <span className="mid"></span>&lt;50
                </li>
                <li>
                  <span className="max"></span>&gt;50
                </li>
              </ul>
            </div>
            <VnMap
              setTooltipContent={setToolTip}
              onClickProvince={handleChangeSelect}
              province={provinceValue}
              position={position}
            ></VnMap>
            <ReactTooltip>{toolTip}</ReactTooltip>{" "}
          </div>

          {selectArr.length !== 0 && (
            <div className="col-md-3 tracker-block tracker-block--4 align-items-start">
              <div className="tracker-block__body list-prop">
                <div className="track-item">
                  <Select
                    onChange={handleChangeSelect}
                    value={{
                      value: selectValue.Province_Name,
                      label: selectValue.Province_Name,
                    }}
                    options={selectArr}
                  />
                </div>
                <div className="track-item">
                  <p className="track-item__title">Tổng số ca</p>
                  <h4 className="track-item__no infected">
                    {selectValue.Confirmed}
                  </h4>
                </div>
                <div className="track-item">
                  <p className="track-item__title">Hồi phục</p>
                  <h4 className="track-item__no today_infected">
                    {selectValue.Recovered}
                  </h4>
                </div>
                <div className="track-item">
                  <p className="track-item__title">Tử vong</p>
                  <h4 className="track-item__no deaths">
                    {selectValue.Deaths}
                  </h4>
                </div>
                <div className="track-item">
                  <p className="track-item__title">Danh sách bệnh nhân</p>
                  <PatientsList address={selectValue.Province_Name} patients={patientList}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cảnh báo vị trí 🚩</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Ứng dụng sẽ truy cập vị trí của bạn để hiển thị cảnh báo. Bạn có cho
            phép điều này xảy ra không?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={locate}>
              Cho phép
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Bỏ qua
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Map;
