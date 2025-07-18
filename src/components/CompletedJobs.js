import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../pages/Header';

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

    const printJob = { ...job };
    ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].forEach((field) => {
      if (printJob[field]) {
        printJob[field] = new Date(printJob[field]).toLocaleString();
      }
    });

    const invoiceNumber = printJob.id ? `#${String(printJob.id).padStart(4, '0')}` : '';

    const printableHTML = `
      <html>
        <head>
          <title>Printer Job Sheet</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            .header { display: flex; justify-content: space-between; }
            .logo-section img { height: 60px; }
            .info-table td { padding: 5px; vertical-align: top; }
            .info-table { width: 100%; margin-top: 20px; }
            .section-title { font-weight: bold; margin-top: 20px; font-size: 16px; }
            .footer { margin-top: 30px; font-size: 12px; }
            .terms { font-size: 11px; margin-top: 10px; color: #333; }
            .red { color: red; font-weight: bold; }
            .line { border-top: 1px solid #000; margin-top: 20px; }
          </style>
        </head>
        <body onload="window.print(); window.onafterprint = window.close();">
          <div class="header">
            <div class="logo-section">
              <img src="${window.location.origin}/logo192.png" alt="Logo" />
              <div><strong>Technical Hub</strong><br/>
                221/A Makola Rd,<br/>
                Kiribathgoda,<br/>
                077 040 3904
              </div>
            </div>
            <div class="customer-info">
              <div><strong>Customer Name:</strong> ${printJob.customerName || ''}</div>
              <div><strong>Customer Contact:</strong> ${printJob.customerContact || ''}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
              <div><strong>Job No:</strong> ${invoiceNumber}</div>
            </div>
          </div>

          <div class="line"></div>

          <table class="info-table">
            <tr><td><strong>Printer:</strong></td><td>${printJob.printerBrand || ''} ${printJob.printerModel || ''}</td></tr>
            <tr><td><strong>Serial Number:</strong></td><td>${printJob.serialNumber || ''}</td></tr>
           
            <tr><td><strong>Repair Notes:</strong></td><td>${printJob.repairNotes || ''}</td></tr>
            <tr><td><strong>Technician:</strong></td><td>${printJob.technicianAssigned || ''}</td></tr>
            <tr><td><strong>Job Status:</strong></td><td>${printJob.jobStatus || 'Completed'}</td></tr>
            
            <tr><td><strong>Cost Estimate:</strong></td><td>${printJob.costEstimate || ''}</td></tr>
            <tr><td><strong>Final Cost:</strong></td><td>${printJob.finalCost || ''}</td></tr>
            <tr><td><strong>Date Received:</strong></td><td>${printJob.dateReceived || ''}</td></tr>
            <tr><td><strong>Pickup Date:</strong></td><td>${printJob.pickupDate || ''}</td></tr>
          </table>

          <div class="section-title">Thank you for choosing Technical Hub!</div>
          <div>We appreciate your trust in our printer repair services.</div>
          <div>If you have any questions or need further assistance, please feel free to contact us.</div>

          <div class="footer">
            <div class="red">Terms & Conditions</div>
            <div class="terms">
              • We provide a 30-day warranty on all repairs.<br/>
              • We are not responsible for any data loss during repairs.<br/>
              • Repair costs will be estimated and approved before work begins.<br/>
              • Repair times may vary depending on parts and problem complexity.<br/>
              • Please remove all personal items from the printer before submitting it for repair.
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printableHTML);
    printWindow.document.close();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-green-100 p-0">
      <Header />
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
                    <td className="p-2 border text-center">{String(job.id).padStart(4, '0')}</td>
                    <td className="p-2 border">{job.customerName}</td>
                    <td className="p-2 border">{job.printerBrand} {job.printerModel}</td>
                    <td className="p-2 border">{job.reportedProblem}</td>
                    <td className="p-2 border text-center">{job.technicianAssigned}</td>
                    <td className="p-2 border text-center">{formatDate(job.dateReceived)}</td>
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
