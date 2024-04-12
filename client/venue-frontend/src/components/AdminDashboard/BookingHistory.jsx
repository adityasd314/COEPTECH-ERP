import { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { backendURL } from '../../config/config';
import axios from 'axios';

const BookingHistory = ({ refresh, isAdmin, facultyId }) => {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each booking

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let response;
        if (isAdmin) {
          response = await axios.post(`${backendURL}/venue/booking`, {
            isAdmin: true,
          });
        } else {
          response = await axios.post(`${backendURL}/venue/booking`, {
            facultyId,
            isAdmin: false,
          });
        }

        setBookings(response.data.allBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      }
    };

    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${backendURL}/venue/getVenues`);
        const venuesObject = response.data.allVenues.reduce((acc, venue) => {
          acc[venue.venueId] = venue.venueName;
          return acc;
        }, {});
        setVenues(venuesObject);
      } catch (error) {
        console.error('Error fetching venues:', error.message);
      }
    };

    fetchBookings();
    fetchVenues();
  }, [refresh, isAdmin]);

  const handleGeneratePermissionLetter = async (bookingId) => {
    try {
      // Set loading state for the clicked booking
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [bookingId]: true,
      }));

      // API call to generate permission letter
      const response = await axios.post(`${backendURL}/document/document`, {
        booking_id: bookingId,
        user_id: facultyId,
      });

      const documentURL = response.data.resp.documents[0].url;
      console.log('Permission letter URL:', documentURL);
      window.open(documentURL, '_blank');
    } catch (error) {
      console.error('Error generating permission letter:', error.message);
    } finally {
      // Reset loading state after handling the request
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [bookingId]: false,
      }));
    }
  };

  return (
    <div style={{ height: '80vh', overflowY: 'auto', marginTop: '-1.5%' }}>
      <Table variant="simple" size="lg">
        <Thead>
          <Tr>
            <Th>Booking ID</Th>
            <Th>Professor ID</Th>
            <Th>Venue Name</Th>
            <Th>Booking Date</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Purpose</Th>
            <Th>Status</Th>
            <Th>Action</Th> {/* Add a new column for action */}
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan="9">Loading...</Td>
            </Tr>
          ) : (
            bookings.map((booking, index) => (
              <Tr key={index}>
                <Td>{booking.bookingId}</Td>
                <Td>{booking.professorId}</Td>
                <Td>{venues[booking.venueId]}</Td>
                <Td>{booking.bookingDate}</Td>
                <Td>{booking.startTime}</Td>
                <Td>{booking.endTime}</Td>
                <Td>{booking.purpose}</Td>
                <Td>{booking.status}</Td>
                <Td>
                  {/* Button for generating permission letter */}
                  {booking.status === 'confirmed' && (
                    <Button
                      isLoading={loadingStates[booking.bookingId]} // Use individual loading state for each button
                      onClick={() =>
                        handleGeneratePermissionLetter(booking.bookingId)
                      }>
                      Generate
                    </Button>
                  )}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );
};

export default BookingHistory;
