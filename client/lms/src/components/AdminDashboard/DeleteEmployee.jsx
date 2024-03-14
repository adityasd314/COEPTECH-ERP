import React, { useState, useEffect } from "react";
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
import { useAuthContext } from "../../hooks/useAuthContext";
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
import { backendURL } from "../../config/config";


const DeleteEmployee = ({ employeeId }) => {

  const { user } = useAuthContext();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const [adminId, setAdminId] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
       
        setAdminId(user._id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getEmployeeData();
  }, []);

  const onSubmit = async () => {
    try {
      if (!password) {
        setError("Please enter the password");
        return;
      }
  
      setError("");
      onClose();
  
      const delete_employee = { adminId, employeeId, password };
     
      const response = await axios.post(backendURL + "/admin/delete", delete_employee);
  
      if (response.status === 200) {
        console.log("Success");
      } else {
        console.error("Error deleting employee:", response.data.error);
        setError("Error deleting employee. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError("An unexpected error occurred. Please try again.");
    }
  
    setPassword("");
  };
  

  return (
    <div>
      <Button onClick={onOpen} size="md" colorScheme="red">
        Delete
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="xl">
          <ModalHeader>Delete Employee</ModalHeader>
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
              <Button colorScheme="teal" size="md">
                Cancel
              </Button>
              <Button colorScheme="red" size="md" onClick={() => onSubmit(password)}>
                Delete
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DeleteEmployee;
