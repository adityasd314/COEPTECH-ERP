import React, { useState } from 'react';
import axios from 'axios';
import { GrDocumentCsv } from "react-icons/gr";
import { Input, Stack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select } from '@chakra-ui/react';
import { backendURL } from '../../config/config';

const DownloadCSV = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  // Create an array of years from 2024 to 2040
  const years = Array.from({ length: 18 }, (_, index) => 2023 + index);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleDownload = async () => {
    try {
      const monthInt = parseInt(month);
      const yearInt = parseInt(year);
  
      // Send a GET request to the server to download the CSV file
      const response = await axios.get(backendURL + "/admin/exportCSV", { params: { month: monthInt, year: yearInt }, responseType: 'blob' });
  
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });
  
      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${monthInt}_${yearInt}.csv`);
      document.body.appendChild(link);
  
      // Trigger the download
      link.click();
  
      // Clean up
      URL.revokeObjectURL(url);
  
      // Close the modal after successful download
      onClose();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };
  
  

  return (
    <div>
      <Button colorScheme="transparent" onClick={onOpen}><GrDocumentCsv /></Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download CSV</ModalHeader>
          <ModalBody>
            <Stack direction="column" spacing={5}>
              <Select
                placeholder="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={5}>
              <Button onClick={handleDownload}>Download</Button>
              <Button onClick={onClose}>Cancel</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DownloadCSV;
