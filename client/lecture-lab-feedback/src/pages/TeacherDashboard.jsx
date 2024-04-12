import { Box, Heading, Text } from '@chakra-ui/react';
import Table from '../components/Teacher/Table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import useSWR from 'swr';

function TeacherDashboard({ user }) {
  const toast = useToast();
  const [schedule, setSchedule] = useState([]);
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ userId: '82' }),
    redirect: 'follow',
  };
  const url =
    'http://localhost:5000/lecture-lab/teacher/getProfessorIdByUserId';
  const { data, error, isLoading } = useSWR(url, (url) =>
    fetch(url, requestOptions)
      .then((res) => res.json())
      .catch((err) => console.log(err))
  );

  useEffect(() => {
    if (data?.data) {
      console.log(data.data);
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ professorId: data.data.professor.professorId }),
        redirect: 'follow',
      };
      const url =
        'http://localhost:5000/lecture-lab/teacher/getScheduleForProfessor';
      fetch(url, requestOptions)
        .then((res) => res.json())
        .then((res) => setSchedule(res.data))
        .catch((err) => console.log(err));
    }
  }, [data]);

  const toggleState = async (ll) => {
    const updatedSchedule = await Promise.all(
      schedule.map(async (item) => {
        if (
          ll.state !== 'CONDUCTED' &&
          JSON.stringify(item) === JSON.stringify(ll)
        ) {
          const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
              type: item.type,
              id:
                item.type === 'LECTURE'
                  ? item.lectureId
                  : item.type === 'TUTORIAL'
                  ? item.tutorialId
                  : item.practicalId,
              state: item.state === 'UPCOMING' ? 'CANCELLED' : 'UPCOMING',
            }),
            redirect: 'follow',
          };
          const url = 'http://localhost:5000/lecture-lab/teacher/updateState';

          const result = await fetch(url, requestOptions);
          if (result.status !== 200) {
            toast({
              title: 'Error',
              description: 'Failed to update state',
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            });
            return item;
          }

          console.log(result);
          toast({
            title: String(
              item.type +
                ' ' +
                (item.state === 'UPCOMING' ? 'Canceled' : 'Scheduled')
            ).toUpperCase(),
            description:
              item.courseName +
              ' has been ' +
              (item.state === 'UPCOMING' ? 'Canceled' : 'Scheduled'),
            status: item.state === 'UPCOMING' ? 'error' : 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });

          return {
            ...item,
            state: item.state === 'UPCOMING' ? 'CANCELLED' : 'UPCOMING',
          };
        }
        return item;
      })
    );
    setSchedule(updatedSchedule);
    return;
  };

  useEffect(() => {
    if (schedule.length > 0) {
      console.log(schedule);
    }
  }, [schedule]);

  if (
    isLoading ||
    (schedule.length == 0 && data.professor?.professorId && !error)
  )
    return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return (
    schedule.length > 0 && (
      <Box>
        <Heading
          as="h1"
          size="2xl"
          textAlign="center"
          mt={4}
          mb={4}
          color="teal.500">
          Teacher Dashboard
        </Heading>
        <Text
          textAlign="center"
          fontSize="xl"
          color="gray.700"
          textTransform={'capitalize'}>
          Welcome {data.data.professor.name}
        </Text>
        <Table
          data={schedule}
          toggle={(ll) => {
            toggleState(ll);
          }}
        />
      </Box>
    )
  );
}

export default TeacherDashboard;
