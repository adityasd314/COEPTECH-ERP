import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
export default function TimeTable({ departmentId }) {
  const data = [
    {
      timetableId: 1,
      departmentId: 3,
      dayOfWeek: 'Monday',
      startTime: '08:00:00',
      endTime: '10:00:00',
      courseId: 23,
      professorId: 190,
      location: 'Computer Lab A',
      duration: 120,
    },
    {
      timetableId: 3,
      departmentId: 3,
      dayOfWeek: 'Monday',
      startTime: '08:00:00',
      endTime: '10:00:00',
      courseId: 28,
      professorId: 196,
      location: 'Computer Lab B',
      duration: 120,
    },
    {
      timetableId: 5,
      departmentId: 3,
      dayOfWeek: 'Tuesday',
      startTime: '08:00:00',
      endTime: '10:00:00',
      courseId: 23,
      professorId: 190,
      location: 'Computer Lab A',
      duration: 120,
    },
    {
      timetableId: 6,
      departmentId: 3,
      dayOfWeek: 'Tuesday',
      startTime: '10:00:00',
      endTime: '12:00:00',
      courseId: 25,
      professorId: 195,
      location: 'Room 301',
      duration: 120,
    },
    {
      timetableId: 7,
      departmentId: 3,
      dayOfWeek: 'Tuesday',
      startTime: '14:00:00',
      endTime: '16:00:00',
      courseId: 30,
      professorId: 178,
      location: 'Design Lab',
      duration: 120,
    },
    {
      timetableId: 8,
      departmentId: 3,
      dayOfWeek: 'Wednesday',
      startTime: '08:00:00',
      endTime: '10:00:00',
      courseId: 23,
      professorId: 190,
      location: 'Computer Lab A',
      duration: 120,
    },
    {
      timetableId: 9,
      departmentId: 3,
      dayOfWeek: 'Wednesday',
      startTime: '10:00:00',
      endTime: '12:00:00',
      courseId: 25,
      professorId: 195,
      location: 'Room 301',
      duration: 120,
    },
    {
      timetableId: 10,
      departmentId: 3,
      dayOfWeek: 'Wednesday',
      startTime: '14:00:00',
      endTime: '16:00:00',
      courseId: 28,
      professorId: 196,
      location: 'Computer Lab B',
      duration: 120,
    },
    {
      timetableId: 11,
      departmentId: 3,
      dayOfWeek: 'Wednesday',
      startTime: '16:00:00',
      endTime: '18:00:00',
      courseId: 29,
      professorId: 186,
      location: 'Room 302',
      duration: 120,
    },
    {
      timetableId: 12,
      departmentId: 3,
      dayOfWeek: 'Thursday',
      startTime: '08:00:00',
      endTime: '10:00:00',
      courseId: 23,
      professorId: 190,
      location: 'Computer Lab A',
      duration: 120,
    },
    {
      timetableId: 13,
      departmentId: 3,
      dayOfWeek: 'Thursday',
      startTime: '10:00:00',
      endTime: '12:00:00',
      courseId: 25,
      professorId: 195,
      location: 'Room 301',
      duration: 120,
    },
    {
      timetableId: 14,
      departmentId: 3,
      dayOfWeek: 'Thursday',
      startTime: '14:00:00',
      endTime: '16:00:00',
      courseId: 30,
      professorId: 178,
      location: 'Design Lab',
      duration: 120,
    },
    {
      timetableId: 15,
      departmentId: 3,
      dayOfWeek: 'Friday',
      startTime: '08:00:00',
      endTime: '10:00:00',
      courseId: 23,
      professorId: 190,
      location: 'Computer Lab A',
      duration: 120,
    },
    {
      timetableId: 16,
      departmentId: 3,
      dayOfWeek: 'Friday',
      startTime: '10:00:00',
      endTime: '12:00:00',
      courseId: 25,
      professorId: 195,
      location: 'Room 301',
      duration: 120,
    },
    {
      timetableId: 17,
      departmentId: 3,
      dayOfWeek: 'Friday',
      startTime: '14:00:00',
      endTime: '16:00:00',
      courseId: 30,
      professorId: 178,
      location: 'Design Lab',
      duration: 120,
    },
    {
      timetableId: 4,
      departmentId: 3,
      dayOfWeek: 'Monday',
      startTime: '16:00:00',
      endTime: '18:00:00',
      courseId: 24,
      professorId: 169,
      location: 'Physics Lab',
      duration: 120,
    },
    {
      timetableId: 2,
      departmentId: 3,
      dayOfWeek: 'Monday',
      startTime: '10:00:00',
      endTime: '12:00:00',
      courseId: 25,
      professorId: 169,
      location: 'Room 301',
      duration: 120,
    },
  ];
  // GROUP BY DAY OF WEek
  const groupByStartTime = data.reduce((acc, curr) => {
    if (!acc[curr.startTime]) {
      acc[curr.startTime] = [];
    }
    acc[curr.startTime].push(curr);
    return acc;
  }, {});
  console.log('groupByStartTime', groupByStartTime);
  const dataRows = [
    'TimeSlot',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  const tableRowsData = Object.entries(groupByStartTime).map(
    ([timeSlot, DT]) => {
      const dayMap = Object.fromEntries(
        dataRows.slice(1).map((day) => [day, []])
      );
      DT.forEach((row) => {
        //   {
        //     "timetableId": 1,
        //     "departmentId": 3,
        //     "dayOfWeek": "Monday",
        //     "startTime": "08:00:00",
        //     "endTime": "10:00:00",
        //     "courseId": 23,
        //     "professorId": 190,
        //     "location": "Computer Lab A",
        //     "duration": 120
        // }
        dayMap[row.dayOfWeek].push(row);
      });
      console.log('dayMap', { dayMap });
      let arr = [timeSlot];
      dataRows.slice(1).forEach((day) => {
        arr.push(dayMap[day]);
      });
      return arr;
    }
  );
  console.log('tableRowsData', tableRowsData);
  return (
    <div>
      <h1>TimeTable</h1>
      {
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              {dataRows.map((day) => (
                <Th key={day}>{day}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableRowsData.map((row, index) => (
              <Tr key={index}>
                {row.map((cell, index) => (
                  <Td key={index}>
                    {index === 0 && cell}
                    {index != 0 &&
                      cell.map((course, index) => (
                        <div key={index}>
                          {course.courseId && (
                            <div>
                              {course.courseId}  ({course.location})
                            </div>
                          )}
                        </div>
                      ))}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      }
    </div>
  );
}
