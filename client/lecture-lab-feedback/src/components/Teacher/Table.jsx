import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

const LectureTable = ({ data, toggle }) => {
  console.log(data);
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Course ID</Th>
          <Th>Course Name</Th>
          <Th>Type</Th>
          <Th>Date Time</Th>
          <Th>Duration (in hrs)</Th>
          <Th>Status</Th>
          <Th>Action Button</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((ll, idx) => (
          <Tr
            key={idx}
            bg={
              ll.state === 'CONDUCTED'
                ? 'green.100'
                : ll.state === 'UPCOMING'
                ? 'yellow.100'
                : 'red.100'
            }>
            <Td>{ll.courseId}</Td>
            <Td>{ll.courseName}</Td>
            <Td>{ll.type}</Td>
            <Td>{ll.dateTime}</Td>
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
                onClick={() => toggle(ll)}>
                {ll.state === 'CONDUCTED'
                  ? 'View Feedback'
                  : ll.state === 'UPCOMING'
                  ? 'Cancel'
                  : ll.state === 'CANCELLED' && 'Schedule'}
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default LectureTable;
