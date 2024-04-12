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
  Button,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../../config/config";

const BookingHistory = ({ professorId }) => {
  const [myBookings, setMyBookings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [venues, setVenues] = useState({});
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each booking

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await axios.post(backendURL + "/venue/booking/myBookings", {
          professorId,
        });
        setMyBookings(response.data.myBookings);
        setPageLoading(false); // Set page loading to false after fetching bookings
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
        setError("Error fetching bookings. Please try again.");
      }
    };

    const fetchVenues = async () => {
      try {
        const response = await fetch(backendURL + "/venue/getVenues");
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
        const data = await response.json();
        // Convert venues array to an object for easy lookup
        const venuesObject = data.allVenues.reduce((acc, venue) => {
          acc[venue.venueId] = venue.venueName;
          return acc;
        }, {});
        setVenues(venuesObject);
      } catch (error) {
        console.error("Error fetching venues:", error.message);
      }
    };

    fetchVenues();
    fetchMyBookings();
  }, [professorId]);

  const handleGeneratePermissionLetter = async (bookingId) => {
    try {
      // Set loading state for the clicked booking
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [bookingId]: true,
      }));

      const response = await axios.post(
        backendURL + "/document/document",
        { booking_id: bookingId, user_id: professorId },
      );

      const documentURL = response.data.resp.documents[0].url;
      // Open the generated document URL in a new tab
      window.open(documentURL, "_blank");

    } catch (error) {
      console.error("Error generating permission letter:", error.message);
    } finally {
      // Reset loading state for the clicked booking
      setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [bookingId]: false,
      }));
    }
  };

  return (
    <div>
      <TableContainer>
        <Table variant="simple" size="lg" color={"black"}>
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
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageLoading ? (
              <Tr>
                <Td colSpan="9">Loading...</Td>
              </Tr>
            ) : error ? (
              <Tr>
                <Td colSpan="9">
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
                  <Td>{venues[booking.venueId]}</Td>
                  <Td>{booking.bookingDate}</Td>
                  <Td>{booking.startTime}</Td>
                  <Td>{booking.endTime}</Td>
                  <Td>{booking.purpose}</Td>
                  <Td>{booking.status}</Td>
                  <Td>
                    {booking.status === "confirmed" && (
                      <Tooltip label="Generate Permission Letter">
                        <Button
                          isLoading={loadingStates[booking.bookingId]} // Use individual loading state for the button
                          onClick={(e) => {
                            e.preventDefault();
                            handleGeneratePermissionLetter(booking.bookingId);
                          }}
                        >
                          {loadingStates[booking.bookingId] ? "Generating..." : "Generate"}
                        </Button>
                      </Tooltip>
                    )}
                  </Td>
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
