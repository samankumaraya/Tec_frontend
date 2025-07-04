import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompletedJobs = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobsheets/completed');
        setCompletedJobs(res.data);
      } catch (err) {
        console.error('❌ Error fetching completed jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  const handlePrint = (job) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const printableHTML = `
      <html>
        <head>
          <title>Job Sheet #${job.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 6px; vertical-align: top; }
            tr { border-bottom: 1px solid #ccc; }
            @page { size: A5; margin: 10mm; }
          </style>
        </head>
        <body onload="window.print(); window.onafterprint = window.close();">
          <h2>🖨️ Completed Job Sheet</h2>
          <table>
            <tr><td><strong>ID</strong></td><td>: ${job.id}</td></tr>
            <tr><td><strong>Customer</strong></td><td>: ${job.customerName}</td></tr>
            <tr><td><strong>Contact</strong></td><td>: ${job.customerContact}</td></tr>
            <tr><td><strong>Printer</strong></td><td>: ${job.printerBrand} ${job.printerModel}</td></tr>
            <tr><td><strong>Problem</strong></td><td>: ${job.reportedProblem}</td></tr>
            <tr><td><strong>Repair Notes</strong></td><td>: ${job.repairNotes}</td></tr>
            <tr><td><strong>Technician</strong></td><td>: ${job.technicianAssigned}</td></tr>
            <tr><td><strong>Final Cost</strong></td><td>: Rs. ${job.finalCost}</td></tr>
            <tr><td><strong>Date Received</strong></td><td>: ${job.dateReceived}</td></tr>
            <tr><td><strong>Pickup Date</strong></td><td>: ${job.pickupDate}</td></tr>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(printableHTML);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ✅ Completed Job Sheets
      </h2>

      {loading ? (
        <div className="text-center text-blue-600">Loading completed jobs...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="min-w-full text-sm border">
            <thead className="bg-green-200">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Printer</th>
                <th className="p-2 border">Problem</th>
                <th className="p-2 border">Technician</th>
                <th className="p-2 border">Received</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {completedJobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No completed job sheets found.
                  </td>
                </tr>
              ) : (
                completedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 border-b">
                    <td className="p-2 border text-center">{job.id}</td>
                    <td className="p-2 border">{job.customerName}</td>
                    <td className="p-2 border">{job.printerBrand} {job.printerModel}</td>
                    <td className="p-2 border">{job.reportedProblem}</td>
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

export default CompletedJobs;
