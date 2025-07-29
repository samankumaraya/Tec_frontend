import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../pages/Header';


const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; 
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
};


const toDateTimeLocal = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
};

const fromDateTimeLocal = (dtLocal) => {
  if (!dtLocal) return null;
 
  return dtLocal.replace('T', ' ') + ':00';
};

const ViewJobSheets = () => {
  const [jobSheets, setJobSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

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

  const printJob = { ...job };
  ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].forEach((field) => {
    if (printJob[field]) {
      printJob[field] = formatDateTime(printJob[field]);
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
            <div><strong>Date:</strong> ${formatDateTime(new Date())}</div>
            <div><strong>Job No:</strong> ${invoiceNumber}</div>
          </div>
        </div>

        <div class="line"></div>

        <table class="info-table">
          <tr><td><strong>Printer:</strong></td><td>${printJob.printerBrand || ''} ${printJob.printerModel || ''}</td></tr>
          <tr><td><strong>Serial Number:</strong></td><td>${printJob.serialNumber || ''}</td></tr>
          <tr><td><strong>Reported Problem:</strong></td><td>${printJob.reportedProblem || ''}</td></tr>
          <tr><td><strong>Repair Notes:</strong></td><td>${printJob.repairNotes || ''}</td></tr>
          
          <tr><td><strong>Job Status:</strong></td><td>${printJob.jobStatus || ''}</td></tr>
          <tr><td><strong>Payment:</strong></td><td>${printJob.payment || ''}</td></tr>
          <tr><td><strong>Cost Estimate:</strong></td><td>${printJob.costEstimate || ''}</td></tr>
          <tr><td><strong>Final Cost:</strong></td><td>${printJob.finalCost || ''}</td></tr>
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

  const handleEditClick = (job) => {
   
    const jobCopy = { ...job };
    ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].forEach((field) => {
      jobCopy[field] = toDateTimeLocal(jobCopy[field]);
    });
    setEditingJob(jobCopy);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (
      ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].includes(name) &&
      type === 'datetime-local'
    ) {
      val = value; 
    }
    setEditingJob((prev) => ({ ...prev, [name]: val }));
  };

  const handleEditSubmit = async () => {
    try {
      
      const updatedJob = { ...editingJob };
      ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].forEach((field) => {
        if (updatedJob[field]) {
          updatedJob[field] = fromDateTimeLocal(updatedJob[field]);
        }
      });
      await axios.put(`http://localhost:5000/api/jobsheets/${editingJob.id}`, updatedJob);
      setJobSheets((prev) =>
        prev.map((job) => (job.id === editingJob.id ? updatedJob : job))
      );
      setIsModalOpen(false);
      alert('✅ Job sheet updated.');
    } catch (error) {
      console.error('❌ Error updating job sheet:', error);
      alert('Failed to update.');
    }
  };

  const handleViewClick = (job) => {
   
    const jobCopy = { ...job };
    ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].forEach((field) => {
      if (jobCopy[field]) {
        jobCopy[field] = formatDateTime(jobCopy[field]);
      }
    });
    setViewingJob(jobCopy);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job sheet?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobsheets/${id}`);
      setJobSheets(jobSheets.filter((job) => job.id !== id));
      alert('🗑️ Job sheet deleted.');
    } catch (error) {
      console.error('❌ Error deleting job sheet:', error);
      alert('Failed to delete.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/jobsheets/${id}`, { jobStatus: newStatus });
      setJobSheets((prev) =>
        prev.map((job) => (job.id === id ? { ...job, jobStatus: newStatus } : job))
      );
    } catch (error) {
      console.error('❌ Error updating job status:', error);
      alert('Failed to update status.');
    }
  };

  const filteredJobs = jobSheets.filter((job) =>
  job.customerContact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  job.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="min-h-screen bg-green-100 p-0">
      <Header />
      <div className="text-center text-3xl font-bold text-green-800 mb-4">✅ All Job Sheets</div>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by phone number... or serial number..."
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
                <th className="p-2 border">Job Number</th>
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
                    <td className="p-2 border">
                      {job.printerBrand} {job.printerModel}
                    </td>
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
                    <td className="p-2 border text-center">{formatDateTime(job.dateReceived)}</td>
                    <td className="p-2 border text-center flex flex-col md:flex-row justify-center gap-2">
                      <button
                        onClick={() => handleViewClick(job)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-xs"
                      >
                        👁️ View
                      </button>
                     {/* <button
                        onClick={() => handleEditClick(job)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        ✏️ Edit
                      </button> */}
                      
                      <button
                        onClick={() => handlePrint(job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        🖨️ Print
                      </button>
                     {/* <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        🗑️ Delete
                      </button> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

     
      {isModalOpen && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-green-700">✏️ Edit Job Sheet</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(editingJob).map(([key, value]) => {
                
                if (
                  ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].includes(key)
                ) {
                  return (
                    <div key={key} className="flex flex-col">
                      <label
                        className="text-sm text-gray-600 font-medium capitalize mb-1"
                        htmlFor={key}
                      >
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type="datetime-local"
                        id={key}
                        name={key}
                        value={value || ''}
                        onChange={handleEditChange}
                        className="border p-2 rounded"
                      />
                    </div>
                  );
                }
                
                return (
                  <div key={key} className="flex flex-col">
                    <label
                      className="text-sm text-gray-600 font-medium capitalize mb-1"
                      htmlFor={key}
                    >
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={value || ''}
                      onChange={handleEditChange}
                      className="border p-2 rounded"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      
      {viewingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-blue-700">📄 Job Sheet Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(viewingJob).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col border p-2 rounded bg-gray-50 break-words"
                  style={{ wordBreak: 'break-word' }}
                >
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-sm">{value || '—'}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingJob(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewJobSheets;
