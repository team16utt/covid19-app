import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Container,
  Flex,
  Box,
  Spacer,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,

  Heading,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Code,
} from "@chakra-ui/react";
import AdminHOC from "../AdminHOC";
import Admin from "../../../Api/Admin/Admin";
import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import Pagination from "react-js-pagination";
import "./KBYT.css";
import { Link } from "react-router-dom";

const KBYT = () => {
  const [declareList, setDeclareList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState();
  const [modal, setModal] = useState();
  const onCloseAlert = () => setIsOpenAlert(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    const fetchDeclarer = async () => {
      try {
        const { data } = await Admin.getDeclarer();
        setDeclareList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeclarer();
  }, []);

  const onOpenDetail = (id) => {
    const [res] = declareList.filter((i) => i.id === id);
    setModal(res);
    
    onOpen();
  };

  const deleteDeclarer = async () => {
    onCloseAlert();
    try {
      await Admin.deleteDeclarer(deleteId);
      const res = declareList.filter((i) => i.id !== deleteId);
      toast({
        position: "bottom",
        title: "Xóa thành công 🐱‍🐉",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setDeclareList(res);
    } catch (error) {
      console.log(error);
      toast({
        position: "bottom",
        title: "Có lỗi xảy ra 😢",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const start = (currentPage - 1) * 6;
  const end = start + 6;
  const pageList = declareList.slice(start, end);

  return (
    <ChakraProvider>
      <AdminHOC>
        <Container maxW="container.lg">
          <Flex py={4}>
            <Box p="2">
              <Heading size="md">Danh sách khai báo y tế</Heading>
            </Box>
            <Spacer />
            <Box>
              <Link to="/quan-ly/kbyt/them-moi">
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  variant="solid"
                >
                  Thêm mới
                </Button>
              </Link>
            </Box>
          </Flex>
          <Divider />
          <Table my={6} variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Họ và tên</Th>
                <Th>email</Th>
                <Th></Th>
                <Th isNumeric>#</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pageList.map((i) => {
                const path = `/quan-ly/kbyt/sua/${i.id}`;

                return (
                  <Tr>
                    <Td
                      onClick={() => onOpenDetail(i.id)}
                      _hover={{
                        background: "white",
                        color: "blue.500",
                        cursor: "pointer",
                      }}
                    >
                      {i.ho_ten}
                    </Td>
                    <Td>{i.email}</Td>
                    <Td>
                      {i.tiep_xuc[0] !== "{}" && (
                        <Badge mx="0.5" fontSize="8px" colorScheme="orange">
                          Tiếp xúc
                        </Badge>
                      )}
                      {i.trieu_chung[0] !== "{}" && (
                        <Badge mx="0.5" fontSize="8px" colorScheme="red">
                          Triệu chứng
                        </Badge>
                      )}
                    </Td>
                    <Td isNumeric>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<ChevronDownIcon />}
                          variant="solid"
                        />
                        <MenuList>
                          <Link to={path}>
                            <MenuItem icon={<EditIcon />}>Sửa</MenuItem>
                          </Link>
                          <MenuItem
                            onClick={() => {
                              setDeleteId(i.id);
                              return setIsOpenAlert(true);
                            }}
                            icon={<DeleteIcon />}
                          >
                            Xóa
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Box>
            <Pagination
              innerClass="pagination declareListPagination"
              activePage={currentPage}
              itemsCountPerPage={6}
              totalItemsCount={declareList.length}
              onChange={(page) => setCurrentPage(page)}
              itemClass="page-item "
              linkClass="page-link pagination-link"
              hideFirstLastPages
            />
          </Box>
        </Container>
      </AdminHOC>
      {modal !== undefined && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Thông tin chi tiết</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box my="1">
                <Code children="Họ tên: " /> {modal.ho_ten}
              </Box>
              <Box my="1">
                <Code children="Giới tính: " />{" "}
                {modal.gioi_tinh === 1 ? "Nam" : "Nữ"}
              </Box>
              <Box my="1">
                <Code children="Ngày sinh: " /> {modal.nam_sinh}
              </Box>
              <Box my="1">
                <Code children="Địa chỉ: " /> {modal.dia_chi}
              </Box>
              <Box my="1">
                <Code children="Eamil: " /> {modal.email}
              </Box>
              <Box my="1">
                <Code children="Số điện thoại: " /> {modal.sdt}
              </Box>
              <Box my="1">
                <Code children="Di chuyển: " /> {modal.dia_diem}
              </Box>
              <Box my="1">
                <Code children="Tiếp xúc: " />:{" "}
                {modal.tiep_xuc[0] !== "{}"
                  ? modal.tiep_xuc.map((i, ix) => (
                      <Code mx="1" colorScheme="red" key={ix} children={i} />
                    ))
                  : "Không"}
              </Box>
              <Box my="1">
                <Code children="Triệu chứng: " />:{" "}
                {modal.trieu_chung[0] !== "{}"
                  ? modal.trieu_chung.map((i, ix) => (
                      <Code mx="1" colorScheme="red" key={ix} children={i} />
                    ))
                  : "Không"}
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Thoát
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <AlertDialog
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa bản khai báo
            </AlertDialogHeader>

            <AlertDialogBody>Bạn có chắc chắn muốn xóa?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                Hủy bỏ
              </Button>
              <Button colorScheme="red" onClick={deleteDeclarer} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
};

export default KBYT;
