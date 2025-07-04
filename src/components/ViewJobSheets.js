import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../pages/Header';

const ViewJobSheets = () => {
  const [jobSheets, setJobSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this job sheet?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/jobsheets/${id}`);
      setJobSheets(jobSheets.filter(job => job.id !== id));
      alert('🗑️ Job sheet deleted.');
    } catch (error) {
      console.error('❌ Error deleting job sheet:', error);
      alert('Failed to delete. Try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/jobsheets/${id}`, { jobStatus: newStatus });
      setJobSheets(prev =>
        prev.map(job => (job.id === id ? { ...job, jobStatus: newStatus } : job))
      );
    } catch (error) {
      console.error('❌ Error updating job status:', error);
      alert('Failed to update status. Try again.');
    }
  };

  const filteredJobs = jobSheets.filter(job =>
    job.customerContact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-100 p-0">
      <Header/>
      <div className="text-center text-3xl font-bold text-green-800 mb-4 flex justify-center items-center gap-2">
        ✅ All Job Sheets
      </div>

      {/* 🔍 Search by Phone Number */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by phone number..."
          className="border border-green-400 px-4 py-2 rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-lg text-blue-600">Loading job sheets...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
          <table className="min-w-full text-sm border border-green-300">
            <thead className="bg-green-200 text-green-900">
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
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No matching job sheets.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-green-50 transition duration-200">
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
                    <td className="p-2 border text-center flex flex-col md:flex-row justify-center gap-2">
                      <button
                        onClick={() => handlePrint(job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        🖨️ Print
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        🗑️ Delete
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
