import { FormControl,Flex, FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Button, Stack, Text, Alert, AlertIcon,Select } from "@chakra-ui/react";
import { TbCalendarPlus } from "react-icons/tb";
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
import { backendURL } from "../../config/config";
import GeneralModal from "../GeneralModal";

const LeaveForm = ({employeeID}) => {
  const [reason, setReason] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [modalProps, setModalProps] = useState({statusText : "",  isError: false, modalStatus: false});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const [duration, setDuration] = useState([])

  useEffect(() => {
    const updateDuration = () => {
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const newDuration = [];
  
        let currentDate = new Date(fromDate);
  
        while (currentDate <= toDate) {
          newDuration.push({
            date: currentDate.toISOString().split("T")[0],
            value: 1,
            paid: 0,
          })
  
        
          currentDate.setDate(currentDate.getDate() + 1)
        }
        setDuration(newDuration);
      }
    };
  
    updateDuration();
  }, [from, to]);
  
  
  const handleFromChange = (e) => {
    setFrom(e.target.value);
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
  };


  const handleDaySelectionChange = (date, selectedValue) => {
  
    setDuration((prevDur) =>
      prevDur.map((day) => {
        const updatedDay = day.date === date ? { ...day, value: selectedValue } : day;
        return updatedDay;
      })
    );
  
  };
  

  const onSubmit = async () => {
    if (!reason || !from || !to) {
      setError("Please fill in all fields.");
      return;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > toDate) {
      setError("End date must be equal to or after the start date.");
      return;
    }

    setError("");
    onClose();

    try {
      const leaveData = {
        employeeID,
        reason,
        duration,
        status: "Pending",
      };


      const response = await axios.post(
        backendURL + "/employee/apply",
        leaveData
      );

      setModalProps({
        statusText: "Leave Applied Successfully!",
        isError: false,
        modalStatus: true,
      });
    } catch (error) {
      console.error("Error applying for leave:", error.response?.data || error.message);
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
      <Button onClick={onOpen} size="md" colorScheme="transparent">
        <TbCalendarPlus size="sm" /></Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave Application</ModalHeader>
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
                  placeholder="Leave Reason"
                  size="lg"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <FormLabel>From</FormLabel>
                <Input
                  size="lg"
                  type="date"
                  value={from}
                  onChange={handleFromChange}
                />
                <FormLabel>To</FormLabel>
                <Input
                  size="lg"
                  type="date"
                  value={to}
                  onChange={handleToChange}
                />
                {duration.map((day) => (
                  <div key={day.date}>
                    <FormLabel>{day.date}</FormLabel>
                    <Select
                      size="lg"
                      onChange={(e) =>handleDaySelectionChange(day.date, e.target.value)}
                    >
                      <option value={1}>Full Day</option>
                      <option value={0.5}>Half Day</option>
                    </Select>
                  </div>
                ))}
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={5}>
              <Button colorScheme="teal" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" size="md" onClick={onSubmit}>
                Apply
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LeaveForm;