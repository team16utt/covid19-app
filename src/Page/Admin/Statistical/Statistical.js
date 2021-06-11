import React, { useEffect, useState } from "react";
import AdminHOC from "../AdminHOC";
import {
  Container,
  Flex,
  Box,
  Spacer,
  Divider,
  Heading,
  Grid,
  
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Code,
  Badge,
  FormControl,
  FormLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  HStack,
  Center,
} from "@chakra-ui/react";
import Pagination from "react-js-pagination";
import Admin from "../../../Api/Admin/Admin";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const Statistical = () => {
  const [initialDeclareList, setInitialDeclareList] = useState([]);
  const [declareList, setDeclareList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExport, setIsExport] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modal, setModal] = useState();

  useEffect(() => {
    const fetchDeclarer = async () => {
      try {
        const { data } = await Admin.getDeclarer();
        setInitialDeclareList(data);
        setDeclareList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeclarer();
  }, []);

  const exportData = () => {
    setIsExport(true);
    setTimeout(() => {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      const list = declareList.map((i, ix) => {
        let tiepXuc =
          i.tiep_xuc[0] !== "{}"
            ? i.tiep_xuc.reduce((a, b) => `${a} , ${b}`)
            : "Không";
        let trieuChung =
          i.trieu_chung[0] !== "{}"
            ? i.trieu_chung.reduce((a, b) => `${a} , ${b}`)
            : "Không";

        return {
          STT: ix + 1,
          "Họ và tên": i.ho_ten,
          "Giới tính": i.gioi_tinh === 1 ? "Nam" : "Nữ",
          "Ngày sinh": i.nam_sinh,
          "Địa chỉ": i.dia_chi,
          Email: i.email,
          "Số điện thoại": i.sdt,
          "Lịch trình di chuyển": i.dia_diem,
          "Tiếp xúc": tiepXuc,
          "Triệu chứng": trieuChung,
        };
      });

      const ws = XLSX.utils.json_to_sheet(list);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "Danh sách khai báo" + fileExtension);
      setIsExport(false);
    }, 1500);
  };

  const onOpenDetail = (id) => {
    const [res] = declareList.filter((i) => i.id === id);
    setModal(res);
    
    onOpen();
  };
  const handleFilterDeclarer = (e) => {
    console.log(e);
    const res = initialDeclareList.filter((i) => {
      if (e === "theo_doi") {
        if (i.tiep_xuc[0] !== "{}" || i.trieu_chung[0] !== "{}") {
          return true;
        }
        return false;
      }

      const res = i[`${e}`];

      if (res === undefined) {
        return true;
      }

      if (res[0] !== "{}") {
        return true;
      }

      return false;
    });

    setDeclareList(res);
  };

  const start = (currentPage - 1) * 6;
  const end = start + 6;
  const pageList = declareList.slice(start, end);
  return (
    <AdminHOC>
      <Container maxW="container.lg">
        <Flex py={4}>
          <Box p="2">
            <Heading size="md">Thống kê người khai báo</Heading>
          </Box>
          <Spacer />
        </Flex>
        <Divider />
        <Grid
          my="4"
          h="200px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem colSpan={4}>
            <Box>
              <FormControl as="fieldset">
                <FormLabel as="legend">Lọc khai báo</FormLabel>
                <RadioGroup
                  defaultValue="tat_ca"
                  onChange={(e) => handleFilterDeclarer(e)}
                >
                  <HStack>
                    <Radio my="0" mx="1" value="tat_ca">
                      Tất cả
                    </Radio>
                    <Radio my="0" mx="1" value="tiep_xuc">
                      Có tiếp xúc
                    </Radio>
                    <Radio my="0" mx="1" value="trieu_chung">
                      Có triệu chứng
                    </Radio>
                    <Radio my="0" mx="1" value="theo_doi">
                      Cần theo dõi
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormHelperText>
                  Lọc người khai báo theo tiêu chí...
                </FormHelperText>
              </FormControl>
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Center h="100px" color="white">
              <Button
                rightIcon={<ArrowForwardIcon />}
                colorScheme="blue"
                variant="outline"
                isLoading={isExport}
                onClick={exportData}
              >
                Xuất file
              </Button>
            </Center>
          </GridItem>
          <GridItem colSpan={5}>
            <Divider />
            <Table variant="simple" mb="4">
              <Thead>
                <Tr>
                  <Th>Họ và tên</Th>
                  <Th>Số điện thoại</Th>
                  <Th>Email</Th>
                  <Th isNumeric>Tình trạng</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageList.map((i) => (
                  <Tr
                    onClick={() => onOpenDetail(i.id)}
                    _hover={{
                      background: "white",
                      color: "blue.500",
                      cursor: "pointer",
                    }}
                  >
                    <Td>{i.ho_ten}</Td>
                    <Td>{i.sdt}</Td>
                    <Td>{i.email}</Td>
                    <Td isNumeric>
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
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
          </GridItem>
        </Grid>
      </Container>
      {modal !== undefined && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Thông tin chi tiết</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box my="1">
                <Code colorScheme="orange" children="Họ tên: " /> {modal.ho_ten}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Giới tính: " />{" "}
                {modal.gioi_tinh === 1 ? "Nam" : "Nữ"}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Ngày sinh: " />{" "}
                {modal.nam_sinh}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Địa chỉ: " />{" "}
                {modal.dia_chi}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Eamil: " /> {modal.email}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Số điện thoại: " />{" "}
                {modal.sdt}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Di chuyển: " />{" "}
                {modal.dia_diem}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Tiếp xúc: " />:{" "}
                {modal.tiep_xuc[0] !== "{}"
                  ? modal.tiep_xuc.map((i, ix) => (
                      <Code mx="1" colorScheme="red" key={ix} children={i} />
                    ))
                  : "Không"}
              </Box>
              <Box my="1">
                <Code colorScheme="orange" children="Triệu chứng: " />:{" "}
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
    </AdminHOC>
  );
};

export default Statistical;
