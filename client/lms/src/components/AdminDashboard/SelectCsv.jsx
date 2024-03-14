import React, { useState } from "react";
import { useFilePicker } from "use-file-picker";
import { Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import Papa from "papaparse";
import { GrDocumentCsv } from "react-icons/gr";

const SelectCsv = ({ sendRequest, managers }) => {
  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: ".csv",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  const [processed, setProcessed] = useState(false);
  const [csvData, setCsvData] = useState([]);

  // Selects File
  const handleFileSelection = (file) => {
    if (selectedFile && file && selectedFile.name === file.name) {
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }

    setProcessed(false);
  };

  // Converts into JSON
  const processFile = async () => {
    if (selectedFile && !processed) {
      Papa.parse(selectedFile.content, {
        complete: (result) => {
          const filteredData = result.data.filter((obj) =>
            Object.values(obj).every((value) => value !== undefined && value !== "")
          );

          const updatedData = filteredData.map((employee) => {
            if (employee.role === "employee") {
              const manager = managers.find((m) => m.info.name === employee.manager);
              if (manager) {

                return {
                  ...employee,
                  manager: manager._id,
                  managerName: manager.info.name,
                };
              }
            }
            return employee;
          });

          setCsvData(updatedData);
          onOpen();
          setProcessed(true);
        },
        header: true,
      });
    }
  };

  // Backend request sent
  const handleAddUsers = () => {
    sendRequest(csvData);
    onClose();
  };

  return (
    <div>
      <div className="process-csv-btn">
        <Button
          size="lg"
          colorScheme="transparent"
          onClick={() => openFilePicker()}
        >
          <GrDocumentCsv />
        </Button>
        <br />
        {selectedFile ? (
          <div>
            {!processed && (
              <div>
                <h2 className="mb-2">{selectedFile.name}</h2>
                <Button onClick={processFile}>Display</Button>
                <br />
              </div>
            )}
          </div>
        ) : (
          filesContent.map((file, index) => (
            <div key={index}>
              <h2 className="mb-2">{file.name}</h2>
              {!processed && (
                <Button onClick={() => handleFileSelection(file)}>
                  Process
                </Button>
              )}
              <br />
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Employees</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Age</Th>
                    <Th>Phone Number</Th>
                    <Th>Position</Th>
                    <Th>Role</Th>
                    <Th>Manager</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {csvData.map((employee, index) => (
                    <Tr key={index}>
                      <Td>{employee.name}</Td>
                      <Td>{employee.email}</Td>
                      <Td>{employee.age}</Td>
                      <Td>{employee.phone_number}</Td>
                      <Td>{employee.position}</Td>
                      <Td>{employee.role}</Td>
                      <Td>{employee.managerName}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="red" size="md" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" size="md" onClick={handleAddUsers}>
              Add Users
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SelectCsv;
