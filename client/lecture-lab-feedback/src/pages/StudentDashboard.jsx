import { Text } from '@chakra-ui/react';
import Cards from '../components/Student/Cards';
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import FeedbackFormModal from '../components/Student/FeedbackModal';
import { Heading } from '@chakra-ui/react';
export default function StudentDashboard({ user }) {
  // get todays letures and labs
  const [llData, setllData] = useState([]);
  // fetch data from the server
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    setllData([
      {
        id: 1,
        course_id: 'MA-0001',
        course_name: 'Vector Calculus and Partial Differential Equations',
        type: 'LECTURE',
        professor_id: 12,
        professor_name: 'Dr. John Doe',
        date_time: new Date(),
        location: 'ET 103',
        duration: 60,
      },
      {
        id: 2,
        course_id: 'CE-0002',
        course_name: 'Structural Analysis - I',
        type: 'LAB',
        professor_id: 13,
        professor_name: 'Dr. Jane Doe',
        date_time: new Date(),
        location: 'ET 101',
        duration: 120,
      },
      {
        id: 3,
        course_id: 'ET-0003',
        course_name: 'Digital Signal Processing',
        type: 'LECTURE',
        professor_id: 11,
        professor_name: 'Dr. Deadpool',
        date_time: new Date(),
        location: 'ET 101',
        duration: 60,
      },
      {
        id: 4,
        course_id: 'ET-0004',
        course_name: 'Microprocessors and Microcontrollers',
        type: 'LAB',
        professor_id: 10,
        professor_name: 'Dr. Strange',
        date_time: new Date(),
        location: 'ET 101',
        duration: 120,
      },
    ]);
  }, []);
  return (
    <Box>
      <Heading
        as="h1"
        size="2xl"
        textAlign="center"
        mt={4}
        mb={4}
        color="teal.500">
        Student Dashboard
      </Heading>
      <Text textAlign="center" fontSize="xl" color="gray.700">
        Welcome {user.email.split('@')[0]}
      </Text>
      <Cards setModalOpen={setModalOpen} data={llData} setData={setData} />
      <FeedbackFormModal
        data={data}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </Box>
  );
}
