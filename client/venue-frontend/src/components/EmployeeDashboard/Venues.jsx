import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../config/config';
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
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';

const Venues = () => {
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState('');
  const [newVenueLocation, setNewVenueLocation] = useState('');
  const [bookingDate, setBookingDate] = useState({
    bookingDate: '',
    endTime: '',
    startTime: '',
  });

  const handleNewVenueLocation = (e) => {
    setNewVenueLocation(e.target.value);
  };

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
        bookingDate,
      );
      const availableVenueIds = response.data.availableVenues;

      const venuesData = venues
        .filter((venue) => availableVenueIds.includes(venue.venueId))
        .filter((venue) => venue.location === newVenueLocation);

      setAllVenues(venuesData);
      setLoading(false);
    } catch (error) {

      setError(error.message || 'Error occurred while fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${backendURL}/venue/getVenues`);
        setVenues(response.data.allVenues);
      } catch (error) {
        
        setError(error.message || 'Error occurred while fetching data');
      }
    };
    fetchVenues();
  }, []);

  // Function to format properties with property names bold
  const formatProperties = (description) => {
    if (!description) return '';
    const propertiesString = description.split('Properties: ')[1];
    if (!propertiesString) return '';
    const propertiesArray = propertiesString
      .replace('{', '')
      .replace('}', '')
      .split(',')
      .map((property) => {
        const [name, value] = property.split(':');
        return (
          <li key={name}>
            <strong>{name.trim()}</strong>: {value}
          </li>
        );
      });
    return <ul>{propertiesArray}</ul>;
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormLabel>Booking Date</FormLabel>
          <Input
            type="date"
            name="bookingDate"
            onChange={handleTimeChange}
            value={bookingDate.bookingDate}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormLabel>Start Time</FormLabel>
          <Input
            type="time"
            name="startTime"
            onChange={handleTimeChange}
            value={bookingDate.startTime}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormLabel>End Time</FormLabel>
          <Input
            type="time"
            name="endTime"
            onChange={handleTimeChange}
            value={bookingDate.endTime}
            style={{ width: '100%' }}
          />
        </div>
        <div>
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
        </div>
      </div>
      <Button onClick={handleSearchbyDate} style={{ margin: '2vh 0' }}>
        Search Available Venues
      </Button>
      <TableContainer>
        <Table variant="simple" size="lg" color={'black'}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Venue Name</Th>
              <Th>Description</Th>
              <Th>Properties</Th>
              <Th>Location</Th>
              <Th>Capacity</Th>
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
              allVenues.map((venue, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{venue.venueName}</Td>
                  <Td>{venue.description}</Td>
                  <Td>{formatProperties(venue.description)}</Td>
                  <Td>{venue.location}</Td>
                  <Td>{venue.capacity}</Td>
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
