import React, { useState } from "react";
import GeneralModal from "../GeneralModal";
import {
  Button,
  Stack,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from "../../config/config";

const MarkAttendance = ({ employeeId }) => {
  const { user } = useAuthContext();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");

  const [modalProps, setModalProps] = useState({
    statusText: "",
    isError: false,
    modalStatus: false,
  });

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (attendanceValue) => {
    if (!password) {
      setModalProps({
        statusText: "Please enter the password",
        isError: true,
        modalStatus: true,
      });
      return;
    }
  
    try {
      if (user && user._id) {
        const markerId = user._id;
  
        const res = await axios.post(
          backendURL + "/admin/getEmployeeById",
          { _id: employeeId }
        );
        const employee = res.data;
  
        if (employee) {
          const currentTime = new Date().toISOString(); // Get current time in ISO format
  
          const attendance = {
            date: currentTime, // Use current time as the attendance date
            value: attendanceValue,
            paid: attendanceValue,
            markerName: user.info.name,
          };
  
          const attendanceData = {
            employeeId,
            attendance,
            password,
            markerId,
          };
  
          const response = await axios.post(
            backendURL + "/employee/mark",
            attendanceData
          );
  
          setModalProps({
            statusText: "Attendance Marked Successfully!",
            isError: false,
            modalStatus: true,
          });
        } else {
          console.error("Employee not found");
          setModalProps({
            statusText: "Employee not found",
            isError: true,
            modalStatus: true,
          });
        }
      } else {
        console.error("Manager id is null or undefined");
        setModalProps({
          statusText: "Manager id is null or undefined",
          isError: true,
          modalStatus: true,
        });
      }
    } catch (error) {
      console.error(
        "Error Marking Attendance:",
        error.response ? error.response.data : error.error
      );
      setModalProps({
        statusText: "Error: " + (error.response ? error.response.data.error : error.message),
        isError: true,
        modalStatus: true,
      });
    }
  
    onClose();
    setPassword("");
  };
  
  

  return (
    <div>
       <GeneralModal {...modalProps} />
      <Button onClick={onOpen} size="md" colorScheme="green">
        Mark Attendance
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="xl">
          <ModalHeader>Mark Attendance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <Stack spacing={5}>
              <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <InputRightElement width="3rem">
                  <IconButton
                    h="1.75rem"
                    size="md"
                    onClick={handleTogglePasswordVisibility}
                    colorScheme="transparent"
                    icon={showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                  />
                </InputRightElement>
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={5}>
              <Button colorScheme="red" size="md" onClick={() => onSubmit(0)}>
                Mark Absent
              </Button>
              <Button
                colorScheme="yellow"
                size="md"
                onClick={() => onSubmit(0.5)}
              >
                <div className="text-white">Mark Half-Day</div>
              </Button>
              <Button colorScheme="teal" size="md" onClick={() => onSubmit(1)}>
                Mark Present
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MarkAttendance;
