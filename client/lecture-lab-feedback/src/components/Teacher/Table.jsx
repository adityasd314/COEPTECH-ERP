import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

const LectureTable = ({ data, toggle }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Course ID</Th>
          <Th>Course Name</Th>
          <Th>Date Time</Th>
          <Th>Duration (in hrs)</Th>
          <Th>Status</Th>
          <Th>Action Button</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((ll) => (
          <Tr
            key={ll.id}
            bg={
              ll.state === 'CONDUCTED'
                ? 'green.100'
                : ll.state === 'UPCOMING'
                ? 'yellow.100'
                : 'red.100'
            }>
            <Td>{ll.course_id}</Td>
            <Td>{ll.course_name}</Td>
            <Td>{ll.date_time.toString()}</Td>
            <Td>{ll.duration / 60}</Td>
            <Td>{ll.state}</Td>
            <Td>
              <Button
                colorScheme={
                  ll.state === 'CONDUCTED'
                    ? 'green'
                    : ll.state === 'UPCOMING'
                    ? 'yellow'
                    : 'red'
                }
                onClick={() => toggle(ll.id)}>
                {ll.state === 'CONDUCTED'
                  ? 'View Feedback'
                  : ll.state === 'UPCOMING'
                  ? 'Cancel'
                  : ll.state === 'CANCELED' && 'Schedule'}
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default LectureTable;
