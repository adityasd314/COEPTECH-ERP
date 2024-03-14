import { useDisclosure } from "@chakra-ui/react";
import { Button, Stack, Alert, AlertIcon } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { backendURL } from "../config/config";
import GeneralModal from "./GeneralModal";


const AcceptLeaveModal = ({leaveId}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [modalProps, setModalProps] = useState({
    statusText: "",
    isError: false,
    modalStatus: false,
  });
  

  const onSubmit = async () => {
  
    onClose();


    try {
      const response = await axios.post(
        backendURL + "/admin/accept",
        {_id: leaveId}
      );
      setModalProps({
        statusText: "Leave Accepted Successfully",
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
      <Button onClick={onOpen} size="md" colorScheme="green">Accept</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Accept Leave</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

              <Text>Are you sure ? </Text>


          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={5}>
              <Button colorScheme="red" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" size="md" onClick={onSubmit}>
                Accept
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AcceptLeaveModal;
