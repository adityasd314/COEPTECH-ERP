import React, { useState } from "react";
import HandleVenueBooking from "./AdminDashboard/HandleVenueBooking";
import BookingHistory from "./AdminDashboard/BookingHistory";
import AddVenue from "./AdminDashboard/AddVenue";
import { FaUserPlus } from "react-icons/fa";
import { GrRefresh } from "react-icons/gr";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from "@chakra-ui/react";

import ManageVenues from "./AdminDashboard/ManageVenues";
import "./admindashboard.css";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminDashboard = ({ isManager }) => {
  const [refresh, setRefresh] = useState(false);
  const { user } = useAuthContext();

  const handleRefresh = () => {
    setRefresh(true);

    setTimeout(() => {
      setRefresh(false);
    }, 500);
  };

  console.log(isManager + " ha bhai manager hai!");

  return (
    <div id="main">
      <div className="p-4 mt-20 text-center">
        <div className="flex-row header-container">
          {isManager ? (
            <h1 className="font-bold mt-4 text-5xl mb-8 head">
              Admin Dashboard
            </h1>
          ) : (
            <h1 className="font-bold mt-4 text-5xl mb-8 head">
              Faculty Dashboard
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
            {!isManager ? <Tab>Handle Bookings</Tab> : null}
            <Tab>Booking History</Tab>
            {/* <Tab>Today's Bookings</Tab>
            <Tab>Booking Calender</Tab>
            <>
              <Tab>Allocate Venues</Tab>
              <Tab>Rules</Tab>
            </> */}
            {isManager ? <Tab>Manage Venues</Tab> : null}
            <div className="refresh">
              <Button
                colorScheme="transparent"
                size={"lg"}
                onClick={handleRefresh}
              >
                <GrRefresh />
              </Button>
            </div>{" "}
          </TabList>

          <TabPanels>
            {!isManager ? (
              <TabPanel>
                <h1 className="text-2xl font-semibold mb-6">Handle Bookings</h1>
                <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                  <div className="w-full">
                    <HandleVenueBooking isAdmin={false} facultyId={1}/>
                  </div>
                </div>
              </TabPanel>
            ) : null}

            <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Booking History</h1>
              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <BookingHistory isAdmin={isManager?true:false} facultyId={1}/>
                </div>
              </div>
            </TabPanel>

            {/* <TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Today's Bookings</h1>
              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <TodayAttendanceStatus />
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
            <>
              <TabPanel>
                <h1 className="text-2xl font-semibold mb-6">Allocate Venues</h1>
                <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                  <div className="w-full">
                    <AllocateLeaves />
                  </div>
                </div>
              </TabPanel>
            </>
            <>
              <TabPanel>
                <h1 className="text-2xl font-semibold mb-6">Rules Panel</h1>
                <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                  <div className="w-full">
                    <RulesPanel />
                  </div>
                </div>
              </TabPanel> 
              </>*/}
            {isManager?<TabPanel>
              <h1 className="text-2xl font-semibold mb-6">Manage Venues</h1>
              <div className="mt-4 mb-8 flex flex-col lg:flex-row">
                <div className="w-full">
                  <ManageVenues />
                </div>
              </div>
            </TabPanel>: null}
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
