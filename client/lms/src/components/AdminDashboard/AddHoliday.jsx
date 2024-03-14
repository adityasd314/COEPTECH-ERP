import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { backendURL } from "../../config/config";
import { Button, Stack, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { GrCalendar } from "react-icons/gr";
import GeneralModal from "../GeneralModal";
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


const AddHoliday = () => {
  const [note, setNote] = useState("");
  const [on, setOn] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");

  const [modalProps, setModalProps] = useState({
    statusText: "",
    isError: false,
    modalStatus: false,
  });
  
  const handleOnChange = (e) => {
    setOn(e.target.value);
  };


  const onSubmit = async () => {
    if (!note || !on) {
      setError("Please fill in all fields.");
      return;
    }
  
    setError("");
    onClose();
  
    try {
      const holidayData = {
        on,
        note,
      };
  
      const response = await axios.post(backendURL + '/admin/addHoliday', holidayData);

      setModalProps({
        statusText: "Holiday Added Successfully",
        isError: false,
        modalStatus: true,
      });
  
    } catch (error) {
      console.error(
        "Error adding Holiday:",
        error.response ? error.response.data : error.message
      );
  
      setModalProps({
        statusText: "Error: " + (error.response ? error.response.data : error.message),
        isError: true,
        modalStatus: true,
      });
    }
  };
  

  return (
    <div>
      <GeneralModal {...modalProps} />
      <Button onClick={onOpen} colorScheme="transparent"><GrCalendar /></Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Holiday</ModalHeader>
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
                <Input
                  variant="filled"
                  placeholder="Holiday"
                  size="lg"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <FormLabel>Schedule On</FormLabel>
                <Input
                  size="lg"
                  type="date"
                  value={on}
                  onChange={handleOnChange}
                />
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={5}>
              <Button colorScheme="teal" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" size="md" onClick={onSubmit}>
                Add
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddHoliday;