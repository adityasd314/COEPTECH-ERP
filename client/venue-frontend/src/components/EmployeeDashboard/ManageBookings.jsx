import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { backendURL } from '../../config/config';
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
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

const ManageBookings = ({ professorId }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [venuesObject, setVenuesObject] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVenueLocation, setNewVenueLocation] = useState('');
  const [newBooking, setNewBooking] = useState({
    professorId:' ',
    venueId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    status: 'pending',
  });
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post(
          backendURL + '/venue/booking/myBookings',
          { professorId },
        );
        setBookings(
          response.data.myBookings.filter((b) => b.status !== 'withdrawn'),
        );
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    const fetchVenues = async () => {
      try {
        const response = await axios.get(backendURL + '/venue/getVenues');
        setVenues(response.data.allVenues);
        const venuesObject = response.data.allVenues.reduce((acc, venue) => {
          acc[venue.venueId] = venue.venueName;
          return acc;
        }, {});
        setVenuesObject(venuesObject);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();

    fetchBookings();
  }, []);

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBooking(null);
    setError(null);
  };

  const handleSaveEdit = async () => {
    try {
      console.log(selectedBooking);
      await axios.post(backendURL + `/venue/booking/edit`, selectedBooking);
      setBookings(
        bookings.map((b) =>
          b.bookingId === selectedBooking.bookingId ? selectedBooking : b,
        ),
      );
      setIsEditModalOpen(false);
      setSelectedBooking(null);
      setError(null);
    } catch (error) {
      console.error('Error editing booking:', error);
      setError(error.message || 'Failed to update booking');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBooking({ ...selectedBooking, [name]: value });
  };

  const handleCancelBooking = async () => {
    try {
      await axios.post(backendURL + `/venue/booking/cancel`, {
        bookingId: cancelBookingId,
      });
      setBookings(bookings.filter((b) => b.bookingId !== cancelBookingId));
      setCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError(error.message || 'Failed to cancel booking');
    }
  };

  const handleAddBooking = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewBooking({
      professorId,
      venueId: '',
      bookingDate: '',
      startTime: '',
      endTime: '',
      purpose: '',
      status: 'pending',
    });
    setError(null);
  };

  const handleSaveAdd = async () => {
    try {
      const response = await axios.post(backendURL + '/venue/availableVenues', {
        start_time: newBooking.startTime,
        end_time: newBooking.endTime,
        booking_date: newBooking.bookingDate,
        venue_id: newBooking.venueId,
      });
      const availableVenueIds = response.data.availableVenueIds;

      let isAvailable = false;
      for (let i = 0; i < availableVenueIds.length; i++) {
        console.log(availableVenueIds[i]);
        if (availableVenueIds[i] == newBooking.venueId) {
          isAvailable = true;
          break;
        }
      }

      if (!isAvailable) {
        setError('Venue is not available at the selected time');
        return;
      }
      let bookingProfId = venues.find((venue) => venue.venueId == newBooking.venueId).permissionFacultyId;


      newBooking.professorId = bookingProfId;
      const latestBookingResponse = await axios.post(
        backendURL + `/venue/booking/make`,
        newBooking,
      );
      const latestBooking = latestBookingResponse.data.createdBooking;
      setBookings([...bookings, ...latestBooking]);

      setIsAddModalOpen(false);
      setNewBooking({
        professorId,
        venueId: '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        status: 'pending',
      });
      setError(null);
    } catch (error) {
      console.error('Error adding booking:', error);
      setError(error.message || 'Failed to add booking');
    }
  };

  const handleNewVenueLocation = (e) => {
    setNewVenueLocation(e.target.value);
  };

  const handleNewBookingChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  return (
    <div>
      <Button
        onClick={handleAddBooking}
        style={{ fontSize: '36px', padding: '10px' }}>
        <FaPlus size="xl" />
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Booking ID</Th>
            <Th>Professor ID</Th>
            <Th>Venue</Th>
            <Th>Booking Date</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Purpose</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookings.map((booking) => (
            <Tr key={booking.bookingId}>
              <Td>{booking.bookingId}</Td>
              <Td>{booking.professorId}</Td>
              <Td>{venuesObject[booking.venueId]}</Td>
              <Td>{booking.bookingDate}</Td>
              <Td>{booking.startTime}</Td>
              <Td>{booking.endTime}</Td>
              <Td>{booking.purpose}</Td>
              <Td>{booking.status}</Td>
              <Td>
                <Button
                  colorScheme="teal"
                  size="sm"
                  onClick={() => handleEditBooking(booking)}
                  style={{ marginBottom: '5px' }}>
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setCancelBookingId(booking.bookingId);
                    setCancelDialogOpen(true);
                  }}>
                  Cancel
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={cancelDialogOpen}
        leastDestructiveRef={undefined}
        onClose={() => setCancelDialogOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Booking
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="red" onClick={handleCancelBooking} ml={3}>
                Cancel Booking
              </Button>
              <Button onClick={() => setCancelDialogOpen(false)} ml={3}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl>
              <FormLabel>Venue ID</FormLabel>
              <Input
                type="text"
                name="venueId"
                value={selectedBooking?.venueId || ''}
                onChange={handleInputChange}
              />
              <FormLabel>Booking Date</FormLabel>
              <Input
                type="date"
                name="bookingDate"
                value={selectedBooking?.bookingDate || ''}
                onChange={handleInputChange}
              />
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                name="startTime"
                value={selectedBooking?.startTime || ''}
                onChange={handleInputChange}
              />
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                name="endTime"
                value={selectedBooking?.endTime || ''}
                onChange={handleInputChange}
              />
              <FormLabel>Purpose</FormLabel>
              <Input
                type="text"
                name="purpose"
                value={selectedBooking?.purpose || ''}
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

      <Modal isOpen={isAddModalOpen} onClose={handleCloseAddModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Select name="location" onChange={handleNewVenueLocation}>
                <option value="">Select a venue</option>
                {[...new Set(venues.map((venue) => venue.location))].map(
                  (location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ),
                )}
              </Select>
              <FormLabel>Venue</FormLabel>
              <Select
                name="venueId"
                value={newBooking.venueId}
                onChange={handleNewBookingChange}>
                <option value="">Select a venue</option>
                {venues
                  .filter((venue) => venue.location == newVenueLocation)
                  .map((venue) => (
                    <option key={venue.venueId} value={venue.venueId}>
                      {venue.venueName}
                    </option>
                  ))}
              </Select>
              <FormLabel>Booking Date</FormLabel>
              <Input
                type="date"
                name="bookingDate"
                value={newBooking.bookingDate}
                onChange={handleNewBookingChange}
              />
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                name="startTime"
                value={newBooking.startTime}
                onChange={handleNewBookingChange}
              />
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                name="endTime"
                value={newBooking.endTime}
                onChange={handleNewBookingChange}
              />
              <FormLabel>Purpose</FormLabel>
              <Input
                type="text"
                name="purpose"
                value={newBooking.purpose}
                onChange={handleNewBookingChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveAdd}>
              Save
            </Button>
            <Button onClick={handleCloseAddModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageBookings;
