// GeneralModal.js
import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  useDisclosure
} from "@chakra-ui/react";

const GeneralModal = ({
  statusText,
  isError,
  modalStatus,
  onClose
}) => {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();

  useEffect(() => {
    if (modalStatus) {
      onOpen();
    } else {
      closeModal();
    }
  }, [modalStatus, onOpen, closeModal]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeModal();
      window.location.reload();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isError ? "Error" : "Success"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>{statusText}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme={isError ? "red" : "blue"} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeneralModal;
