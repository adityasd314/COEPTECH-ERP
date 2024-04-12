import React, { useState, useEffect } from "react";
import { backendURL } from "../../config/config";
import { FaPlus } from "react-icons/fa";
import {
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Textarea,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import GeneralModal from "../GeneralModal";

const AddVenue = () => {
  const [venueInfo, setVenueInfo] = useState({
    venueName: "",
    description: "",
    permissionFacultyId: "",
    location: "",
    capacity: "",
  });
  const [modalProps, setModalProps] = useState({
    statusText: "",
    isError: false,
    modalStatus: false,
  });
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const validateCapacity = (capacity) => {
    return !isNaN(parseFloat(capacity)) && isFinite(capacity) && capacity > 0;
  };

  const onSubmit = async () => {
    const { venueName, description, permissionFacultyId, location, capacity } =
      venueInfo;

    if (!venueName || !capacity || !location) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateCapacity(capacity)) {
      setError("Capacity must be a valid number greater than 0");
      return;
    }

    try {
      const response = await axios.post(backendURL + "/venue/addVenues", {
        venueName,
        description,
        permissionFacultyId,
        location,
        capacity,
      });
      setModalProps({
        statusText: "Venue added successfully!",
        isError: false,
        modalStatus: true,
      });
    } catch (error) {
      console.error(
        "Error adding venue:",
        error.response ? error.response.data : error.message
      );
      console.log(error.message);
      setModalProps({
        statusText: "Failed to add venue",
        isError: true,
        modalStatus: true,
      });
    }
  };

  return (
    <div>
      <div>
        <GeneralModal {...modalProps} />
        <Button
          onClick={() => setIsOpen(true)}
          // colorScheme="green"
          style={{ fontSize: "36px", padding: "10px" }}
        >
          <FaPlus size="xl" />
          {/* Add Venue */}
        </Button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Venue</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {error && (
                <Alert status="error" mb={4}>
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              <FormControl>
                <Stack>
                  <FormLabel>Venue Name</FormLabel>
                  <Input
                    variant="filled"
                    placeholder="Enter name"
                    size="lg"
                    type="text"
                    name="venueName"
                    mb={2}
                    value={venueInfo.venueName}
                    onChange={handleChange}
                  />

                  <FormLabel>Description</FormLabel>
                  <Textarea
                    variant="filled"
                    placeholder="Enter description"
                    size="lg"
                    name="description"
                    mb={2}
                    value={venueInfo.description}
                    onChange={handleChange}
                  />

                  <FormLabel>Location</FormLabel>
                  <Input
                    variant="filled"
                    placeholder="Enter location"
                    size="lg"
                    type="text"
                    name="location"
                    mb={2}
                    value={venueInfo.location}
                    onChange={handleChange}
                  />

                  <FormLabel>Capacity</FormLabel>
                  <Input
                    variant="filled"
                    placeholder="Enter capacity"
                    size="lg"
                    type="number"
                    name="capacity"
                    mb={2}
                    value={venueInfo.capacity}
                    onChange={handleChange}
                  />
                  <FormLabel>Permission Faculty</FormLabel>
                  <Input
                    variant="filled"
                    placeholder="Enter permission faculty ID"
                    size="lg"
                    type="text"
                    name="permissionFacultyId"
                    mb={2}
                    value={venueInfo.permissionFacultyId}
                    onChange={handleChange}
                  />

                </Stack>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                size="md"
                onClick={() => setIsOpen(false)}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
              <Button colorScheme="teal" size="md" onClick={onSubmit}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default AddVenue;
