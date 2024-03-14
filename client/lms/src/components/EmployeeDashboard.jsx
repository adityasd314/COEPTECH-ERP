import LeaveForm from "./EmployeeDashboard/LeaveForm";
import LeaveStatus from "./EmployeeDashboard/LeaveStatus";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import "./employeedashboard.css";
import Summary from "./EmployeeDashboard/Summary";
import EmployeeAttendanceStatus from "./EmployeeDashboard/EmployeeAttendanceStatus";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";

const EmployeeDashboard = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('leaveStatus');

  if (!user) {
    return null;
  }

  const employeeID = user._id;
  

  return (
    <div id="main">
      <div className="p-4 mt-20 text-center">
        <div className=" flex-row header-container">
          <h1 className="font-bold mt-4 text-4xl mb-8" id="head">
            Employee Dashboard
          </h1>
        </div>

        <Tabs
          value={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          variant="soft-rounded"
          colorScheme="gray"
          className="mx-2 md:mx-6 lg:mx-10 py-6 h-200 border-2 border-gray-300 rounded-md"
          id="tabs-container"
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList className="overflow-x-auto px-6">
            <Tab value="leaveStatus">Leave Status</Tab>
            <Tab value="attendanceStatus">Attendance Status</Tab>
            <Tab value="summary">Your Summary</Tab>
            <button className="w-20 h-20 bg-white mr-6 mb-6 border-black border-2 rounded-full flex items-center justify-center shadow" style={{ zIndex: 999, position: 'fixed', bottom: '10px', right: '10px' }}>
              <LeaveForm employeeID={employeeID} id="leave-form" />
            </button>
          </TabList>

          <TabPanels>
            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Leave Status</h1>

              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <LeaveStatus employeeId={employeeID} isActive={activeTab} isAdmin={false} />
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Attendance Status</h1>

              <div className="mt-4 flex flex-col lg:flex-row">
                <div className="w-full">
                  <EmployeeAttendanceStatus isAdmin={false} employeeId={employeeID} isActive={activeTab} />
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Your Summary</h1>

              <div className="mt-4 flex flex-col lg:flex-row">
                <div className="w-full">
                  <Summary/>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Profile</h1>

              <div className="mt-4 flex flex-col lg:flex-row">
                <div className="w-full"></div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
