import { Select, Card, CardHeader, CardBody, Divider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from '../../config/config';

const months = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
];

const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i); // Generate 20 years starting from the current year

const Summary = () => {
  const { user } = useAuthContext();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()].value); // Set default selected month to current month
  const [originalEmployees, setOriginalEmployees] = useState({ attendance: 0, paid: 0, unpaid: 0 });

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user._id) {
          console.error("Manager id is null or undefined");
          return;
        }
        const response = await axios.get(backendURL+'/admin/attendancebyMY', {
          params: { _id: user._id,month:selectedMonth,year:selectedYear }
        });
        const attendanceresponse = response.data;
        const filteredAttendance = attendanceresponse;
        const paid = filteredAttendance.reduce((totalpaid, entry) => totalpaid + entry.paid, 0);
        const attendance = filteredAttendance.reduce((val, entry) => val + entry.value, 0);
        const unpaidleave = filteredAttendance.reduce((val, entry) => val + (entry.value === 0 && entry.paid === 0 ? 1 : 0), 0);
        const paidleave = filteredAttendance.reduce((val, entry) => val + (entry.value === 0 && entry.paid !== 0 ? 1 : 0), 0);

        const employee = {
          unpaid: unpaidleave,
          paid: paidleave,
          attendance: attendance
        };
        setOriginalEmployees(employee);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [selectedMonth, selectedYear, user]);
  
  return (
    <div className="util" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: '100%', marginBottom: '2%' }}>
      <div style={{ gridColumn: '1 / span 2', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', width: "550px", gap: '20px' }}>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </Select>
          <Select value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Card>
          <CardHeader>Attendance</CardHeader>
          <CardBody>{originalEmployees.attendance}</CardBody>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>Paid Leave</CardHeader>
          <CardBody>{originalEmployees.paid}</CardBody>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>Unpaid Leave</CardHeader>
          <CardBody>{originalEmployees.unpaid}</CardBody>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>Leave</CardHeader>
          <CardBody>{originalEmployees.unpaid+originalEmployees.paid}</CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Summary;
