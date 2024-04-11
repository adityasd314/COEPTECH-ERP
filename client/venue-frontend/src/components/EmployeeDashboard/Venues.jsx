import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../../config/config";

const Venues = () => {
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(backendURL + "/venue/getVenues");
        setAllVenues(response.data.allVenues);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching venues:", error.message);
        setError("Error fetching venues. Please try again.");
      }
    };

    fetchVenues();
  }, []);

  return (
    <div>
      <TableContainer>
        <Table variant="simple" size="lg" color={"black"}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Venue Name</Th>
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
