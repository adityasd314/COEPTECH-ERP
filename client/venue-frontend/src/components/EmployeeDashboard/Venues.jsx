import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Alert,
  AlertIcon,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../../config/config";

const Venues = () => {
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingDate, setBookingDate] = useState({
    bookingDate: "",
    endTime: "",
    startTime: "",
  });

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setBookingDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchbyDate = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendURL}/venue/getAllavailableVenues`,
        bookingDate
      );
      const availableVenueIds = response.data.availableVenues;

      const venuesPromises = availableVenueIds.map(async (venueId) => {
        const venueResponse = await axios.get(
          `${backendURL}/venue/getVenueById/${venueId}`
        );
        return venueResponse.data;
      });

      const venuesData = await Promise.all(venuesPromises);
      setAllVenues(venuesData);
      console.log(allVenues);
      allVenues.forEach((venue) => {
        console.log(venue.venue[0].venueName);
      });
      setLoading(false);
    } catch (error) {
      setError(error.message || "Error occurred while fetching data");
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" , margin:"0 40px"}}>
        <div style={{display:"flex", alignItems:"center"}}>
          <FormLabel>Booking Date</FormLabel>
          <Input
            type="date"
            name="bookingDate"
            onChange={handleTimeChange}
            value={bookingDate.bookingDate}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{display:"flex", alignItems:"center"}}>
          <FormLabel>Start Time</FormLabel>
          <Input
            type="time"
            name="startTime"
            onChange={handleTimeChange}
            value={bookingDate.startTime}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{display:"flex", alignItems:"center"}}>
          <FormLabel>End Time</FormLabel>
          <Input
            type="time"
            name="endTime"
            onChange={handleTimeChange}
            value={bookingDate.endTime}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <Button onClick={handleSearchbyDate} style={{ margin: "2vh 0" }}>
        Search Available Venues
      </Button>
      <TableContainer>
        <Table variant="simple" size="lg" color={"black"}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Venue Name</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan="2">Loading...</Td>
              </Tr>
            ) : error ? (
              <Tr>
                <Td colSpan="2">
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                </Td>
              </Tr>
            ) : (
              allVenues?.map((venue, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{venue.venue[0].venueName}</Td>
                  <Td>{venue.venue[0].description}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Venues;
