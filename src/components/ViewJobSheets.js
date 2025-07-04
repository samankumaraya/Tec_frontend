import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewJobSheets = () => {
  const [jobSheets, setJobSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobSheets();
  }, []);

  const fetchJobSheets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobsheets');
      setJobSheets(response.data);
    } catch (error) {
      console.error('❌ Error fetching job sheets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (job) => {
    // your existing print code unchanged
    const printWindow = window.open('', '', 'width=800,height=600');
    const printableHTML = `
      <html>
        <head>
          <title>Job Sheet #${job.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 6px; vertical-align: top; }
            tr { border-bottom: 1px solid #ccc; }
            @page { size: A5; margin: 10mm; }
          </style>
        </head>
        <body onload="window.print(); window.onafterprint = window.close();">
          <h2>🖨️ Printer Repair Job Sheet</h2>
          <table>
            <tr><td><strong>ID</strong></td><td>: ${job.id}</td></tr>
            <tr><td><strong>Customer Name</strong></td><td>: ${job.customerName}</td></tr>
            <tr><td><strong>Contact</strong></td><td>: ${job.customerContact}</td></tr>
            <tr><td><strong>Email</strong></td><td>: ${job.customerEmail}</td></tr>
            <tr><td><strong>Address</strong></td><td>: ${job.customerAddress}</td></tr>
            <tr><td><strong>Printer</strong></td><td>: ${job.printerBrand} ${job.printerModel}</td></tr>
            <tr><td><strong>Serial Number</strong></td><td>: ${job.serialNumber}</td></tr>
            <tr><td><strong>Accessories</strong></td><td>: ${job.accessoriesProvided}</td></tr>
            <tr><td><strong>Reported Problem</strong></td><td>: ${job.reportedProblem}</td></tr>
            <tr><td><strong>Repair Notes</strong></td><td>: ${job.repairNotes}</td></tr>
            <tr><td><strong>Comments</strong></td><td>: ${job.additionalComments}</td></tr>
            <tr><td><strong>Date Received</strong></td><td>: ${job.dateReceived}</td></tr>
            <tr><td><strong>Pickup Date</strong></td><td>: ${job.pickupDate}</td></tr>
            <tr><td><strong>Est. Completion</strong></td><td>: ${job.estimatedCompletionDate}</td></tr>
            <tr><td><strong>Technician</strong></td><td>: ${job.technicianAssigned}</td></tr>
            <tr><td><strong>Warranty</strong></td><td>: ${job.warrantyStatus}</td></tr>
            <tr><td><strong>Job Status</strong></td><td>: ${job.jobStatus}</td></tr>
            <tr><td><strong>Payment</strong></td><td>: ${job.paymentStatus}</td></tr>
            <tr><td><strong>Priority</strong></td><td>: ${job.priority}</td></tr>
            <tr><td><strong>Created By</strong></td><td>: ${job.createdBy}</td></tr>
            <tr><td><strong>Cost Estimate</strong></td><td>: Rs. ${job.costEstimate}</td></tr>
            <tr><td><strong>Final Cost</strong></td><td>: Rs. ${job.finalCost}</td></tr>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(printableHTML);
    printWindow.document.close();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/jobsheets/${id}`, { jobStatus: newStatus });
      // Update local state optimistically:
      setJobSheets(prev =>
        prev.map(job => (job.id === id ? { ...job, jobStatus: newStatus } : job))
      );
    } catch (error) {
      console.error('❌ Error updating job status:', error);
      alert('Failed to update status. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📋 All Job Sheets</h2>

      {loading ? (
        <div className="text-center text-lg text-blue-600">Loading job sheets...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Printer</th>
                <th className="p-2 border">Problem</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Technician</th>
                <th className="p-2 border">Received</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobSheets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No job sheets found.
                  </td>
                </tr>
              ) : (
                jobSheets.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border text-center">{job.id}</td>
                    <td className="p-2 border">
                      {job.customerName}
                      <br />
                      <span className="text-xs text-gray-600">{job.customerContact}</span>
                    </td>
                    <td className="p-2 border">{job.printerBrand} {job.printerModel}</td>
                    <td className="p-2 border">{job.reportedProblem}</td>
                    <td className="p-2 border text-center">
                      <select
                        value={job.jobStatus}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td className="p-2 border text-center">{job.technicianAssigned}</td>
                    <td className="p-2 border text-center">{job.dateReceived}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handlePrint(job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🖨️ Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewJobSheets;
