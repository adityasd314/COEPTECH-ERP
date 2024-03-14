import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { Button, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { backendURL } from "../config/config";
import GeneralModal from "./GeneralModal";


const RejectLeaveModal = ({leaveId}) => {
  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");

  const [modalProps, setModalProps] = useState({
    statusText: "",
    isError: false,
    modalStatus: false,
  });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

 
  const onSubmit = async () => {
    if (!message) {
      setError("Please enter a message.");
      return;
    }

    setError("");
    onClose();


    try {
      const response = await axios.post(
        backendURL + "/admin/reject",
        { _id: leaveId, note: message }
      );
      setModalProps({
        statusText: "Leave Rejected Successfully",
        isError: false,
        modalStatus: true,
      });
    } catch (error) {
      console.error(
        'Error rejecting leave:',
        error.response ? error.response.data : error.message
      );
  
      setModalProps({
        statusText: "Error: " + (error.response?.data || error.message),
        isError: true,
        modalStatus: true,
      });
    }
  };

  return (
    <div>
      <GeneralModal {...modalProps} />
      <Button onClick={onOpen} size="md" colorScheme="red">Reject</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Leave</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl>
              <Stack spacing={5}>
              <FormLabel>Message</FormLabel>
                <Input
                  variant="filled"
                  placeholder="Message (Eg. Reason of Rejection, General Note)"
                  size="lg"
                  type="text"
                  value={message}
                  onChange={handleChange}
                />
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={5}>
              <Button colorScheme="red" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" size="md" onClick={onSubmit}>
                Reject
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RejectLeaveModal;
