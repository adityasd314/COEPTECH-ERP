import React, { useState } from "react";
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

const AllocateLeavesButton = ({ employeeIds }) => {
    const { user } = useAuthContext();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async () => {
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
    onClose();
  
    try {
      if (user && user._id) { 

        const res = await axios.post(backendURL + '/admin/allocateLeaves', { employees: employeeIds, adminId: user._id, password});

      } else {
        console.error("Admin id is null or undefined");
      }

    } catch (error) {
      console.error(
        "Error Allocating Leaves:",
        error.response ? error.response.data : error.message,
      );
    }
  
    setPassword("");
  };
  

  return (
    <div>
      <Button onClick={onOpen} size="md" colorScheme="green">
      Allocate Leaves
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="xl">
          <ModalHeader>Allocate Leaves</ModalHeader>
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
              <Button colorScheme="red" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" size="md" onClick={onSubmit}>
                Allocate
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AllocateLeavesButton;
