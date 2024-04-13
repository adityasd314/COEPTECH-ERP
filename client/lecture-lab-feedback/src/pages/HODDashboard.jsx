import {
  Box,
  Button,
  Stack,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import useSWR from 'swr';
import TimeTable from '../components/HOD/TimeTable';
import Graph from '../components/HOD/Graph';

export default function AdminDashboard({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const toast = useToast();
  const GET_DEPARTMENT_ID_URL =
    'http://localhost:5000/lecture-lab/hod/getDepartmentByHODUserId';

  const GET_COURSES_URL =
    'http://localhost:5000/lecture-lab/hod/getAllCoursesWithProfessorsByDepartment';

    const GET_FEEDBACK_URL = 'http://localhost:5000/lecture-lab/hod/getStudentAverageFeedback'
  const [departmentId, setDepartmentId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data, isLoading, isError } = useSWR(GET_COURSES_URL, async (url) => {
    const response = await fetch(GET_DEPARTMENT_ID_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.userId }),
    });
    const data = await response.json();
    if (!data.data.departmentId) {
      toast({
        title: 'Error',
        description: 'Department not found',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });

      return Error('Department not found');
    }
    setDepartmentId(data.data.departmentId);
    const coursesResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ departmentId: data.data.departmentId }),
    });
    const coursesData = await coursesResponse.json();
    return coursesData;
  });

  useEffect(() => {
    if (data) {
      console.log('data', data);
    }
  }, [data]);

  // const feedback = {
  //   message: 'Average feedback fetched',
  //   data: {
  //     averageFeedback: 0,
  //     feedbackObjectDataRating: {
  //       'content clarity': 1.5,
  //       engagement: 1,
  //       delivery: 4,
  //       relevance: 2,
  //       materials: 3,
  //       'feedback and support': 2.5,
  //       'overall satisfaction': 1,
  //     },
  //     comments: [' sefsegsgsgsgsdg'],
  //   },
  // };

  return (
    <Box>
      <Heading
        as="h1"
        size="2xl"
        textAlign="center"
        mt={4}
        mb={4}
        color="teal.500">
        Admin Dashboard
      </Heading>
      <Text textAlign="center" fontSize="xl" color="gray.700">
        Welcome {user.email}
      </Text>
      {isLoading ? (
        <Stack mx={10}>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      ) : null}
      {isError ? <div>Error fetching data</div> : null}
      {data?.data && (
        <>
          <TimeTable departmentId={departmentId} />
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Course Name</Th>
                <Th>Course Code</Th>
                <Th>Professor Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.data.map((course) => (
                <Tr key={course.courseId}>
                  <Td>{course.courseName}</Td>
                  <Td>{course.courseCode}</Td>
                  <Td>{course.professorName}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => {
                        console.log('Generate Report for course:', course);
                        console.log('Professor ID:', course.professorId);
                        fetch(GET_FEEDBACK_URL, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ professorsId: course.professorId }),
                        })
                          .then((res) => res.json())
                          .then((data) => {
                            
                            console.log('Feedback data:', data);
                            
                            setFeedback(data.data)}
                          
                          );
                        setIsOpen(true);
                      }}>
                      Generate Report from Feedback
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Graph  data={feedback}/>
          </ModalBody>
          <ModalFooter>
            <Text fontSize="sm">Feedback</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
