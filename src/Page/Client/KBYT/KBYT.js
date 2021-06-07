import Form from "../../../Components/Form/Form";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import FormOTP from "../../../Components/Form/FormOTP";

const KBYT = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const [isVerify, setIsVerify] = useState(false);

  const sendDataHandler = (data) => {
    return fetch("https://thingproxy.freeboard.io/fetch/http://45.32.102.61:8080/api/declare", {
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
            duration: 5000,
            isClosable: true,
          });
        })
        .catch((er) => {
          toast({
            position: "bottom",
            title: "Đã có lỗi xảy ra",
            description: "Hãy thử lại...",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }, 1000);
  };

  const sendOTPHandler = (otp) => {
    return fetch(`https://thingproxy.freeboard.io/fetch/http://45.32.102.61:8080/api/verify/${phoneNumber}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
      }),
    });
  };

  const verifyHandler = (data) => {
    if (data.OTP1) {
      setIsSubmitting(true);
      const OTP = [
        data.OTP1,
        data.OTP2,
        data.OTP3,
        data.OTP4,
        data.OTP5,
        data.OTP6,
      ].join("");
      setTimeout(() => {
        sendOTPHandler(OTP)
          .then((res) => {
            if (res.ok) {
              setIsVerify(true);
              setCheckingCode(false);
              setIsSubmitting(false);
              toast({
                position: "bottom",
                title: "Xác thực thành công ❤️",
                // description: "Cảm ơn bạn đã dành thời gian cho chũng tôi",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            } else {
              setIsSubmitting(false);
              toast({
                position: "bottom",
                title: "Mã OTP sai",
                description: "Hãy thử lại...",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          })
          .catch((er) => {
            toast({
              position: "bottom",
              title: "Đã có lỗi xảy ra",
              description: "Hãy thử lại...",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      }, 500);
    } else {
      console.log("data", data);
      setIsSubmitting(true);
      fetch(`https://thingproxy.freeboard.io/fetch/http://45.32.102.61:8080/api/verify/${data.phoneNumber}`, {
        method: "GET",
        // headers: {
        //   Accept: "application/json",
        //   "Content-Type": "application/json",
        // },
      }).then((res) => {
        console.log(res.json);
        setPhoneNumber(data.phoneNumber);
        setCheckingCode(true);
        setIsSubmitting(false);
      });
    }
  };

  return (
    <>
      {!isVerify && (
        <FormOTP
          onConfirm={verifyHandler}
          isSubmitting={isSubmitting}
          checking={checkingCode}
        />
      )}
      {isVerify && (
        <Form onConfirm={confirmHandler} phoneNumber={phoneNumber} isSubmitting={isSubmitting}></Form>
      ) 
      }
    </>
  );
};
export default KBYT;
