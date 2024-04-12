import { Text } from '@chakra-ui/react';
import Cards from '../components/Student/Cards';
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import FeedbackFormModal from '../components/Student/FeedbackModal';
import { Heading } from '@chakra-ui/react';
import useSWR from 'swr';

export default function StudentDashboard({ user }) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    user_id: user.userId,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const { data, error, isLoading } = useSWR(
    'http://localhost:5000/lecture-lab/getAllLecturesLabsPracticals',
    (url) =>
      fetch(
        'http://localhost:5000/lecture-lab/getAllLecturesLabsPracticals',
        requestOptions
      )
        .then((res) => res.json())
        .catch((err) => console.log(err))
  );

  const [llData, setllData] = useState([]);
  const [toBeReviewed, setToBeReviewed] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      // console.log(data);
      // console.log(data.data);
      setllData(data.data);
    }
  }, [data]);

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>loading...</div>;

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
        Welcome {user.email}
      </Text>
      <Cards
        setModalOpen={setModalOpen}
        data={llData}
        setData={setToBeReviewed}
      />
      <FeedbackFormModal
        data={toBeReviewed}
        isOpen={modalOpen}
        user={user}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </Box>
  );
}
