import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../../config/config";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  Textarea, 
} from "@chakra-ui/react";
import AddVenue from "./AddVenue";
const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(backendURL + "/venue/getVenues");
        setVenues(response.data.allVenues);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    fetchVenues();
  }, []);

  const handleDeleteVenue = async (venueId) => {
    try {
      await axios.delete(backendURL + `/venue/deleteVenues/${venueId}`);
      setVenues(venues.filter((venue) => venue.venueId !== venueId));
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  };

  const handleEditVenue = (venue) => {
    setSelectedVenue(venue);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVenue(null);
    setError(null); // Reset error state when closing modal
  };

  const handleSaveEdit = async () => {
    try {
      console.log(selectedVenue);
      await axios.put(
        backendURL + `/venue/editVenues/${selectedVenue.venueId}`,
        selectedVenue
      );
      setVenues(venues.map((venue) => (venue.venueId === selectedVenue.venueId ? selectedVenue : venue)));
      setIsEditModalOpen(false);
      setSelectedVenue(null);
      setError(null); // Reset error state after successful update
    } catch (error) {
      console.error("Error editing venue:", error);
      setError(error.message || "Failed to update venue");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedVenue({ ...selectedVenue, [name]: value });
  };

  const formatProperties = (description) => {
    if (!description) return [];
    const propertiesString = description.split("Properties: ")[1] || '';
    return propertiesString
      .replace("{", "")
      .replace("}", "")
      .split(",")
      .map((property, index) => {
        const [name, value] = property.trim().split(":");
        return (
          <li key={index}>
            <strong>{name}</strong>: {value}
          </li>
        );
      });
  };
  

  return (
    <div>
      <AddVenue />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Venue Name</Th>
            <Th>Description</Th>
            <Th>Properties</Th>
            <Th>Permission Faculty ID</Th>
            <Th>Location</Th>
            <Th>Capacity</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {venues.map((venue) => (
            <Tr key={venue.venueId}>
              <Td>{venue.venueName}</Td>
              <Td>{venue.description.split(" Properties: ")[0]}</Td>
              <Td>
                <ul>
                  {formatProperties(venue.description)}
                </ul>
              </Td>
              <Td>{venue.permissionFacultyId}</Td>
              <Td>{venue.location}</Td>
              <Td>{venue.capacity}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  size="sm"
                  onClick={() => handleEditVenue(venue)}
                  style={{ marginBottom: "5px" }}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteVenue(venue.venueId)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Venue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl>
              <FormLabel>Venue Name</FormLabel>
              <Input
                type="text"
                name="venueName"
                value={selectedVenue?.venueName || ""}
                onChange={handleInputChange}
              />
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={selectedVenue?.description || ""}
                onChange={handleInputChange}
              />
              <FormLabel>Permission Faculty ID</FormLabel>
              <Input
                type="text"
                name="permissionFacultyId"
                value={selectedVenue?.permissionFacultyId || ""}
                onChange={handleInputChange}
              />
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                name="location"
                value={selectedVenue?.location || ""}
                onChange={handleInputChange}
              />
              <FormLabel>Capacity</FormLabel>
              <Input
                type="text"
                name="capacity"
                value={selectedVenue?.capacity || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button onClick={handleCloseEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageVenues;
