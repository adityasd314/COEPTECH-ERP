import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../../config/config";

const BookingHistory = ({ professorId }) => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await axios.post(backendURL + "/venue/booking/myBookings", {
          professorId,
        });
        setMyBookings(response.data.myBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
        setError("Error fetching bookings. Please try again.");
      }
    };

    fetchMyBookings();
  }, [professorId]);

  return (
    <div>
      <TableContainer>
        <Table variant="simple" size="lg" color={"black"}>
          <Thead>
            <Tr>
              <Th>Booking ID</Th>
              <Th>Professor ID</Th>
              <Th>Venue ID</Th>
              <Th>Booking Date</Th>
              <Th>Start Time</Th>
              <Th>End Time</Th>
              <Th>Purpose</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan="8">Loading...</Td>
              </Tr>
            ) : error ? (
              <Tr>
                <Td colSpan="8">
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                </Td>
              </Tr>
            ) : (
              myBookings.map((booking) => (
                <Tr key={booking.bookingId}>
                  <Td>{booking.bookingId}</Td>
                  <Td>{booking.professorId}</Td>
                  <Td>{booking.venueId}</Td>
                  <Td>{booking.bookingDate}</Td>
                  <Td>{booking.startTime}</Td>
                  <Td>{booking.endTime}</Td>
                  <Td>{booking.purpose}</Td>
                  <Td>{booking.status}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BookingHistory;
