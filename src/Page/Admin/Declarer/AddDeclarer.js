import { ChakraProvider, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { withRouter } from "react-router";
import Form from "../../../Components/Form/Form";
import AdminHOC from "../AdminHOC";

const AddDeclarer = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const sendDataHandler = (data) => {
    return fetch("http://45.32.102.61:8080/api/declare", {
      method: "POST",
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
            title: "Khai báo thành công ❤️",
            description: "Cảm ơn bạn đã dành thời gian cho chúng tôi",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          props.history.push('/quan-ly/kbyt');
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
        <Form onConfirm={confirmHandler} isSubmitting={isSubmitting}></Form>
      </AdminHOC>
    </ChakraProvider>
  );
};

export default withRouter(AddDeclarer);
