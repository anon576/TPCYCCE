import React from 'react';
import { useEmployerRequest } from '../../../../storage/Employer/context'; 
import axios from 'axios'
import { BACKEND_URL } from '../../../../constant';

// Simple shimmer effect component
const Shimmer = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer" />
  </div>
);

const EmployerRequestList = () => {
  // Get the requests, loading, and error from the context
  const { requests, loading, error } = useEmployerRequest();

  // Handle the download functionality (adjust as needed)
  const handleDownload = async (requestID) => {
    try {
      const token = localStorage.getItem("token");
  
      // Make a GET request to download the Excel file
      const response = await axios.get(BACKEND_URL + `/employer/download_list/${requestID}`, {
        responseType: 'blob', // Ensure response type is blob
        headers: {
          'Authorization': token,
        },
      });
  
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
  
      // Set the filename and trigger the download
      link.setAttribute('download', `student_list_${requestID}.xlsx`);
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      window.URL.revokeObjectURL(url); // Clean up object URL
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };
  
  // If loading, show shimmer effect
  if (loading) {
    return (
      <div className="shimmer-container">
        <Shimmer />
        <Shimmer />
        <Shimmer />
      </div>
    );
  }

  // If there's an error, display it
  if (error) {
    return <p>{error}</p>;
  }

  // If there are no requests, show "No requests" message
  if (requests.length === 0) {
    return <p>No requests found.</p>;
  }

  return (
    <div>
      <h3>Employer Requests</h3>
      <ul>
        {requests.map((request) => (
          <li key={request.employerRequestID} className="request-item">
            <div>
              <p><strong>Skills:</strong> {request.skill}</p>
              <p><strong>Skill Level:</strong> {request.skillLevel}</p>
              <p><strong>CGPA:</strong> {request.cgpa}</p>
              <p><strong>Branches:</strong> {request.branch}</p>
              <p><strong>Status:</strong> {request.status}</p>
              {request.status === 'Approved' ? (
                <button onClick={() => handleDownload(request.employerRequestID)}>
                  Download
                </button>
              ) : (
                <button disabled>
                  Download (Disabled)
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};



export default EmployerRequestList;
