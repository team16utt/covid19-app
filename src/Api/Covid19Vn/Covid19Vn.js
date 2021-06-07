import axiosClient from "../AxiosClient";

const Covid19Vn = {
  getProvinces: async () => {
    const res = axiosClient.get("https://thingproxy.freeboard.io/fetch/http://45.32.102.61:8080/api/provinces", {
      baseURL: "",
    });
    return res;
  },
  getPatients: async () => {
    const res = axiosClient.get("https://thingproxy.freeboard.io/fetch/http://45.32.102.61:8080/api/vn_patients", {
      baseURL: "",
    });
    return res;
  },
};

export default Covid19Vn;
