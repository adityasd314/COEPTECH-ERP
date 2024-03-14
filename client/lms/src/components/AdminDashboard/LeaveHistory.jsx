import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from '@chakra-ui/react';
import LeaveStatus from "../EmployeeDashboard/LeaveStatus";
import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from '../../config/config';

const clearLeaveHistoryData = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes("leavehistory")) {
            localStorage.removeItem(key);
            console.log(`Data with key ${key} cleared from localStorage`);
        }
    }
};

const LeaveHistory = ({ refresh }) => {
    console.log("Leave history rendered")
    const { user } = useAuthContext();
    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user && user._id) {
                    const managerId = user._id;
                    const storageKey = `leavehistory_${managerId}`;
                    const cachedData = localStorage.getItem(storageKey);
                    if (refresh) {
                        localStorage.removeItem(storageKey); // Clear specific data from localStorage
                        console.log(`Data with key ${storageKey} cleared from localStorage`);
                        clearLeaveHistoryData(); // Clear all localStorage data related to employee statistics
                      }
                    if (refresh || !cachedData) {
                        const employeesResponse = await axios.post(backendURL + '/admin/getAllEmployees', { managerId });
                        setEmployeeData(employeesResponse.data);
                        localStorage.setItem(storageKey, JSON.stringify(employeesResponse.data));
                        console.log("request sent");
                    } else {
                        setEmployeeData(JSON.parse(cachedData));
                        console.log("no request sent");
                    }
                } else {
                    console.error('Manager id is null or undefined');
                }
            } catch (error) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
            }
        };

        fetchData();
    }, [user, refresh]);

    useEffect(() => {
        // Select the first employee when employeeData changes
        if (employeeData.length > 0) {
            setSelectedEmployee(employeeData[0]._id);
        }
    }, [employeeData]);

    const handleSelectChange = (e) => {
        setSelectedEmployee(e.target.value);
    };

    const selectedEmployeeData = employeeData.find((employee) => employee._id === selectedEmployee);

    return (
        <div style={{ height: '80vh', overflowY: 'auto', marginTop: '-1.5%' }}>
            <div className='w-60 mb-3'>
                <Select value={selectedEmployee} onChange={handleSelectChange}>
                    {employeeData.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                            {employee.info.name}
                        </option>
                    ))}
                </Select>
            </div>

            {selectedEmployeeData && selectedEmployeeData.leaves.length > 0 ? (
                <LeaveStatus employeeId={selectedEmployee} isAdmin={true} />
            ) : (
                <p>No leaves.</p>
            )}
        </div>
    );
};

export default LeaveHistory;
