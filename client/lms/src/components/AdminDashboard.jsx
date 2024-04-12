import React, { useState } from 'react';
import HandleLeave from "./AdminDashboard/HandleLeave";
import LeaveHistory from "./AdminDashboard/LeaveHistory";
import AddEmployee from "./AdminDashboard/AddEmployee";
import { FaUserPlus } from "react-icons/fa";
import { GrRefresh } from "react-icons/gr";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button
} from "@chakra-ui/react";

import AttendanceCalender from "./AdminDashboard/AttendanceCalendar";
import TodayAttendanceStatus from "./AdminDashboard/TodayAttendanceStatus";
import DownloadCSV from "./AdminDashboard/DownloadCSV";
import AllocateLeaves from "./AdminDashboard/AllocateLeaves";
import AddHoliday from "./AdminDashboard/AddHoliday";
import RulesPanel from "./AdminDashboard/RulesPanel";
import "./admindashboard.css";
import { useAuthContext } from '../hooks/useAuthContext';

const AdminDashboard = ({ isManager }) => {
  const [refresh, setRefresh] = useState(false);
  const { user } = useAuthContext();

  const handleRefresh = () => {
    setRefresh(true);

    setTimeout(() => {
      setRefresh(false);
    }, 500); 
  };

  return (
    <div id="main">
      <div className="p-4 mt-20 text-center">
        <div className="flex-row header-container">
          {isManager ? (
            <h1 className="font-bold mt-4 text-5xl mb-8 head">
              HOD's Dashboard
            </h1>
          ) : (
            <h1 className="font-bold mt-4 text-5xl mb-8 head">
              Admin Dashboard
            </h1>
          )}
        </div>

        <Tabs
          variant="soft-rounded"
          colorScheme="gray"
          className="mx-2 md:mx-6 lg:mx-10 py-6 h-200 border-2 border-gray-300 rounded-md"
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList className="overflow-x-auto px-6">
            <Tab>Handle Leave</Tab>
            <Tab>Leave History</Tab>
            <Tab>Today's Attendance</Tab>
 
            <Tab>Attendance Calender</Tab>
            {!isManager? (
              <>
                <Tab>Allocate Leaves</Tab>
                <Tab>Rules</Tab>
              </>
            ) : null}
            <div className="add-employee">
            {!isManager? <AddEmployee /> : null}
            </div>
            <div className="refresh">
              <Button colorScheme="transparent" size={"lg"} onClick={handleRefresh}><GrRefresh /></Button>
            </div>
            {!isManager? <AddHoliday /> : null}
          </TabList>

          <TabPanels>
            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Handle Leave</h1>
              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <HandleLeave/>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Leave History</h1>
              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <LeaveHistory/>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Today's Attendance</h1>
              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <TodayAttendanceStatus/>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <AttendanceCalender />
                </div>
              </div>
            </TabPanel>

            {!isManager ? (
              <>
                <TabPanel>
                  <h1 className="text-2xl font-semibold mb-6">Allocate Leaves</h1>
                  <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                    <div className="w-full">
                      <AllocateLeaves/>
                    </div>
                  </div>
                </TabPanel>
              </>
            ) : null}

            {!isManager ? (
              <>
                <TabPanel>
                  <h1 className="text-2xl font-semibold mb-6">Rules Panel</h1>
                  <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                    <div className="w-full">
                    <RulesPanel/>
                    </div>
                  </div>
                </TabPanel>
              </>
            ) : null}
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
