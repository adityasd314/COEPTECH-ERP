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
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import useSWR from 'swr';

export default function AdminDashboard({ user }) {
  const toast = useToast();
  const GET_DEPARTMENT_ID_URL =
    'http://localhost:5000/lecture-lab/hod/getDepartmentByHODUserId';

  const GET_COURSES_URL =
    'http://localhost:5000/lecture-lab/hod/getAllCoursesWithProfessorsByDepartment';

  const [departmentId, setDepartmentId] = useState(null);

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
                  <Button colorScheme="teal" size="sm">
                    Generate Report from Feedback
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
