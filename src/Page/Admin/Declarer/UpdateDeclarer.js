import { ChakraProvider, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import Admin from "../../../Api/Admin/Admin";
import Form from "../../../Components/Form/Form";
import AdminHOC from "../AdminHOC";
const UpdateDeclarer = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declarer, setDeclarer] = useState({});

  const { id } = useParams();
  const toast = useToast();

  useEffect((toast) => {
    const fectDeclarerById = async () => {
      try {
        const { data } = await Admin.getDeclarerById(id);
        setDeclarer(data);
      } catch (error) {
        console.log(error);
        toast({
          position: "bottom",
          title: "Lỗi 😷",
          description: "Không thể tìm thấy thông tin khai báo",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fectDeclarerById();
  }, [id]);

  const sendDataHandler = (data) => {
    return fetch(`https://thingproxy.freeboard.io/fetch/http://45.32.102.61:8080/api/declare/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const confirmHandler = (data) => {
    setIsSubmitting(true);
    const body = {
      ho_ten: data.name,
      nam_sinh: data.dob,
      email: data.email,
      gioi_tinh: data.gender,
      sdt: data.phoneNumber,
      dia_chi: data.address,
      dia_diem: data.goPro,
      trieu_chung: [...data.trieuChung],
      tiep_xuc: [...data.tiepXuc],
    };
    setTimeout(() => {
      sendDataHandler(body)
        .then((res) => {
          setIsSubmitting(false);
          toast({
            position: "bottom",
            title: "Cập nhật thành công ❤️",
            description: "Cảm ơn bạn đã dành thời gian cho chúng tôi",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          props.history.push("/quan-ly/kbyt");
        })
        .catch((er) => {
          toast({
            position: "bottom",
            title: "Đã có lỗi xảy ra",
            description: "Hãy thử lại...",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }, 1000);
  };

  return (
    <ChakraProvider>
      <AdminHOC>
        <Form
          onConfirm={confirmHandler}
          isSubmitting={isSubmitting}
          declarer={declarer}
        />
      </AdminHOC>
    </ChakraProvider>
  );
};

export default withRouter(UpdateDeclarer);
