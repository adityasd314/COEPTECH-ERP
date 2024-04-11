import { Table, Thead, Tbody, Tr, Th, Td, HStack, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../../config/config";

const HandleVenueBookings = ({ isAdmin, facultyId }) => {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingsAndVenues = async () => {
      try {
        const [bookingsResponse, venuesResponse] = await Promise.all([
          axios.post(backendURL + "/venue/booking", {
            isAdmin: false, facultyId  // Set isAdmin to false and include facultyId
          }),
          axios.get(backendURL + "/venue/getVenues")
        ]);

        const allBookings = bookingsResponse.data.allBookings;
        const pendingBookings = allBookings.filter(booking => booking.status === 'pending');
        setBookings(pendingBookings);

        const allVenues = venuesResponse.data.allVenues.reduce((acc, venue) => {
          acc[venue.venueId] = venue.venueName;
          return acc;
        }, {});
        setVenues(allVenues);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching venue bookings:", error.message);
      }
    };

    fetchBookingsAndVenues();
  }, [facultyId]);

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.post(`${backendURL}/venue/booking/grant`, { bookingId });
      setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
    } catch (error) {
      console.error("Error accepting booking:", error.message);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await axios.post(`${backendURL}/venue/booking/revoke`, { bookingId });
      setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
    } catch (error) {
      console.error("Error rejecting booking:", error.message);
    }
  };

  return (
    <div className="overflow-x-auto">      
      {loading ? (
        <p>Loading...</p>
      ) : (
        bookings.length === 0 ? (
          <p className="text-gray-500 text-lg">No pending bookings</p>
        ) : (
          <Table variant="simple" size="lg">
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th>Professor ID</Th>
                <Th>Venue</Th>
                <Th>Booking Date</Th>
                <Th>Start Time</Th>
                <Th>End Time</Th>
                <Th>Purpose</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookings.map((booking, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{booking.professorId}</Td>
                  <Td>{venues[booking.venueId]}</Td>
                  <Td>{booking.bookingDate}</Td>
                  <Td>{booking.startTime}</Td>
                  <Td>{booking.endTime}</Td>
                  <Td>{booking.purpose}</Td>
                  <Td>
                    <HStack spacing={5}>
                      <Button colorScheme="green" onClick={() => handleAcceptBooking(booking.bookingId)}>Accept</Button>
                      <Button colorScheme="red" onClick={() => handleRejectBooking(booking.bookingId)}>Reject</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )
      )}
    </div>
  );
};

export default HandleVenueBookings;
