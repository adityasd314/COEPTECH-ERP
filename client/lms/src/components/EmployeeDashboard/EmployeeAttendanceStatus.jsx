import { Select } from "@chakra-ui/react";
import { useState,useEffect } from "react";
import MarkAttendance from "./MarkAttendance";
import "./employeeleaveHistory.css"
import axios from "axios"
import { Oval } from 'react-loader-spinner'
import AttendanceCalendar from "../EmployeeDashboard/AttendanceCalendar";
import { useAuthContext } from "../../hooks/useAuthContext";
import { backendURL } from "../../config/config";

const EmployeeAttendanceStatus = ({ employeeId, isAdmin, isActive }) => {
  const colors = ['#00C49F', '#BE1F35',"#FFEF00"];
  const { user } = useAuthContext();

  const [events,setEvents] = useState([])
  const [employee,setEmployee] = useState()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const data = {
          employeeId:employeeId
        }
        const response = await axios.get(backendURL+"/admin/attendancebyID", {
          params: { _id: employeeId } 
        });
        const userData = response.data;
        const attendanceEvents = userData.attendance.map((attendanceItem) => {
          return {
            title: attendanceItem.value === 1 ? "" : 
              (attendanceItem.paid === 0 ? "Unpaid" : 
              attendanceItem.paid === 0.5 ? "Half paid" :
              attendanceItem.paid === 1 ? "Full Paid" : ""),
            start: attendanceItem.date.split("T")[0], 
            end: attendanceItem.date.split("T")[0], 
            color: attendanceItem.value === 1 ? colors[0] : 
              attendanceItem.value === 0 ? colors[1] : 
              attendanceItem.value === 0.5 ? colors[2] : "yellow",
          };
        });
        setEvents(attendanceEvents);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };
  
    getData(employeeId);
  }, [employeeId]);

  useEffect(
    ()=>{
      {setTimeout(() => {
        setLoading(false)
       },2500);}
    },
  [isActive])
  

  return (
    <>
      <div className="flex-column justify-start gap-10">
      <div className="flex justify-between gap-10 mb-9">
        {!isAdmin && <MarkAttendance employeeId={user._id} />}
      </div>
      </div>


      {isActive===1?
      (
        loading ? (
          <div className="w-full h-auto flex justify-center align-center ">
           <Oval
           visible={loading}
           height="80"
           width="80"
           color="#4fa94d"
           ariaLabel="oval-loading"
           wrapperStyle={{}}
           wrapperClass=""
           />
           </div>
        ) : (
          <div>
          <AttendanceCalendar className="mt-50" events={events} />
          </div>
        )
      ):
      <h1>Loading</h1>

      
      }
    </>
  );
};

export default EmployeeAttendanceStatus;
