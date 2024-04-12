import Venues from "./EmployeeDashboard/Venues";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import "./employeedashboard.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import BookingHistory from "./EmployeeDashboard/BookingHistory";
import ManageBookings from "./EmployeeDashboard/ManageBookings";
const EmployeeDashboard = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("venues");

  if (!user) {
    return null;
  }

  const employeeID = user._id;

  return (
    <div id="main">
      <div className="p-4 mt-20 text-center">
        <div className=" flex-row header-container">
          <h1 className="font-bold mt-4 text-4xl mb-8" id="head">
            User Dashboard
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
            <Tab value="leaveStatus">Venues</Tab>
            <Tab value="attendanceStatus">Your Bookings</Tab>
            <Tab value="summary">Manage Bookings</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Venues</h1>

              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <Venues
                    employeeId={employeeID}
                    isActive={activeTab}
                    isAdmin={false}
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Booking History</h1>
              <BookingHistory professorId={170} isActive={activeTab} />
              <div className="mt-4 flex flex-col lg:flex-row">
                <div className="w-full"></div>
              </div>
            </TabPanel>

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Manage Bookings</h1>

              <div className="mt-4 flex flex-col lg:flex-row">
                <div className="w-full">
                  <ManageBookings professorId={170} />
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
