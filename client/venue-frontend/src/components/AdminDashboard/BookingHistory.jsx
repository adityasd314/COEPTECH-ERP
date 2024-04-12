import { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { backendURL } from '../../config/config';

const BookingHistory = ({ refresh, isAdmin, facultyId }) => {
    const [bookings, setBookings] = useState([]);
    const [venues, setVenues] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                let response;
                if (isAdmin) {

                    response = await fetch(backendURL + "/venue/booking", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ isAdmin: true })
                    });
                } else {
                    response = await fetch(backendURL + "/venue/booking", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ facultyId, isAdmin: false })
                    });
                }
                
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                setBookings(data.allBookings);
                console.log(data.allBookings);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        };

        const fetchVenues = async () => {
            try {
                const response = await fetch(backendURL + "/venue/getVenues");
                if (!response.ok) {
                    throw new Error('Failed to fetch venues');
                }
                const data = await response.json();
                // Convert venues array to an object for easy lookup
                const venuesObject = data.allVenues.reduce((acc, venue) => {
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
                    </Tr>
                </Thead>
                <Tbody>
                    {loading ? (
                        <Tr>
                            <Td colSpan="8">Loading...</Td>
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
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>
        </div>
    );
};

export default BookingHistory;
