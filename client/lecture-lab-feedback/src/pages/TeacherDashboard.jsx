import { Box, Heading, Text } from '@chakra-ui/react';
import Table from '../components/Teacher/Table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
function TeacherDashboard({ user }) {
  const toast = useToast();

  console.log(new Date());
  const data = [
    {
      id: 1,
      state: 'CONDUCTED',
      course_id: 'MA-0001',
      course_name: 'Vector Calculus and Partial Differential Equations',
      location: 'ET 103',
      date_time: moment().subtract(1, 'h'),
      duration: 60,
    },
    {
      id: 2,
      state: 'UPCOMING',
      course_id: 'CE-0002',
      course_name: 'Structural Analysis - I',
      location: 'ET 101',
      date_time: moment().subtract(2, 'h'),
      duration: 60,
    },
    {
      id: 3,
      state: 'CANCELED',
      course_id: 'ET-0003',
      course_name: 'Digital Signal Processing',
      location: 'ET 101',
      date_time: moment().add(3, 'h'),
      duration: 60,
    },
    {
      id: 4,
      state: 'UPCOMING',
      course_id: 'ET-0004',
      course_name: 'Microprocessors and Microcontrollers',
      location: 'ET 101',
      date_time: moment().add(5, 'h'),
      duration: 120,
    },
  ];

  const [schedule, setSchedule] = useState(data);

  useEffect(() => {
    // if lecture is over change state to conducted
    const updatedSchedule = schedule.map((item) => {
      const end_date_time = moment(item.date_time).add(item.duration, 'm');

      const current_date_time = new moment();

      console.log(end_date_time, current_date_time);
      if (
        Date(current_date_time) > Date(end_date_time) &&
        item.state === 'UPCOMING'
      ) {
        return {
          ...item,
          state: 'CONDUCTED',
        };
      }
    });

    console.log('data', data);
    setSchedule(data);
  }, []);

  const toggleState = (id) => {
    console.log('toggle', id);
    const updatedSchedule = schedule.map((item) => {
      if (item.id === id && item.state !== 'CONDUCTED') {
        toast({
          title:
            'Lecture ' +
            (item.state === 'UPCOMING' ? 'Canceled' : 'Scheduled'),
          description:
            item.course_name +
            ' has been ' +
            (item.state === 'UPCOMING' ? 'Canceled' : 'Scheduled'),
          status: item.state === 'UPCOMING' ? 'error' : 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
        return {
          ...item,
          state: item.state === 'UPCOMING' ? 'CANCELED' : 'UPCOMING',
        };
      }
      return item;
    });
    setSchedule(updatedSchedule);
  };
  return (
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
        Welcome {user.email.split('@')[0]}
      </Text>
      <Table
        data={schedule}
        toggle={(id) => {
          toggleState(id);
        }}
      />
    </Box>
  );
}

export default TeacherDashboard;
