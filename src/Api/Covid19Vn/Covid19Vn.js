import axiosClient from "../AxiosClient";

const Covid19Vn = {
  getProvinces: async () => {
    const res = axiosClient.get("http://45.32.102.61/api/provinces", {
      baseURL: "",
    });
    return res;
  },
  getPatients: async () => {
    const res = axiosClient.get("http://45.32.102.61/api/vn_patients", {
      baseURL: "",
    });
    return res;
  },
};

export default Covid19Vn;
// https://thingproxy.freeboard.io/fetch/