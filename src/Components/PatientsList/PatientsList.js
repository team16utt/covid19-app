import React, { useEffect,useState } from "react";

import Covid19Vn from "../../Api/Covid19Vn/Covid19Vn";

import "./PatientsList.css";

const PatientsList = ({ address }) => {
  const [patientList, setPatientList] = useState([]);

  useEffect(() => {
    const filterAddress = async () => {
      const {data} = await Covid19Vn.getPatients();
      const list = data.filter((i) => i.location === address)
      setPatientList(list);
    };
    filterAddress();
  }, [address]);

  return (
    patientList.length > 0 && (
      <>
        <div className="table-responsive">
          <table className="table table-hover table-sm table-patient">
            <thead className="table-thead">
              <tr>
                <th scope="col">Mã BN</th>
                <th scope="col">Tuổi</th>
                <th scope="col">Tình trạng</th>
              </tr>
            </thead>

            <tbody className="table-tbody">
              {patientList.map((i) => {
                let textClass = "text-primary";
                if (i.status === "Khỏi") textClass = "text-success";
                if (i.status === "Tử vong") textClass = "text-danger";  
                return (
                  <tr key={i.patient} className={textClass}>
                    <td>BN{i.patient}</td>
                    <td>{i.age}</td>
                    <td>{i.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    )
  );
};

export default PatientsList;
