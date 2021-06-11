import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Admin from "../../Api/Admin/Admin";


const Login = ({ setIsAuthenticated }) => {
  const [isSubmit, setIsSubmit] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useToast();

  const onSubmit = async (data) => {
    setIsSubmit(true);
    try {
      const { token } = await Admin.login(data);
      localStorage.setItem("token", token);
      toast({
        position: "bottom",
        title: `Đăng nhập thành công 🐱‍👤`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmit(false);
      setIsAuthenticated(true);
    } catch (error) {
      
      toast({
        position: "bottom",
        title: `Đăng nhập thất bại 😱`,
        description: "Tên đăng nhập hoặc mật khẩu không đúng!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsSubmit(false);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Quản lý khai báo y tế</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            dịch bệnh và <Link color={"blue.400"}>nhiều hơn thế nữa!</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="username">
                <FormLabel>Tên đăng nhập</FormLabel>
                <Input
                  type="text"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <Text color="red.500" fontSize="xs">
                    Bạn phải nhập tên đăng nhập
                  </Text>
                )}
              </FormControl>
              <FormControl id="password">
                <FormLabel>Mật khẩu</FormLabel>
                <Input
                  type="password"
                  {...register("password", { required: true })}
                />
                {errors.username && (
                  <Text color="red.500" fontSize="xs">
                    Bạn phải nhập tên mật khẩu
                  </Text>
                )}
              </FormControl>
              <Stack spacing={5}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Nhớ đăng nhập</Checkbox>
                  {/* <Link color={"blue.400"}>Forgot password?</Link> */}
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={isSubmit}
                  type="submit"
                >
                  Đăng nhập
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
