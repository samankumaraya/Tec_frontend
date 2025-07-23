import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../pages/Header';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const CompletedJobs = () => {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [technician, setTechnician] = useState('');

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobsheets/completed');
        setCompletedJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error('❌ Error fetching completed jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  
  const generatePrintView = (job, type = 'Job') => {
    const printJob = { ...job };
    ['dateReceived', 'pickupDate', 'estimatedCompletionDate'].forEach((field) => {
      if (printJob[field]) {
        printJob[field] = new Date(printJob[field]).toLocaleString();
      }
    });

    const numberLabel = type === 'Invoice' ? 'Invoice No' : 'Job No';
    const number = printJob.id ? `#${String(printJob.id).padStart(4, '0')}` : '';

    const printWindow = window.open('', '', 'width=800,height=600');
    const html = `
      <html>
        <head>
          <title>${type} Sheet</title>
          <style>
            body { font-family: Arial; padding: 30px; }
            .header { display: flex; justify-content: space-between; }
            .logo-section img { height: 60px; }
            .info-table td { padding: 5px; vertical-align: top; }
            .section-title { font-weight: bold; margin-top: 20px; font-size: 16px; }
            .footer { margin-top: 30px; font-size: 12px; }
            .terms { font-size: 11px; color: #333; }
            .red { color: red; font-weight: bold; }
            .line { border-top: 1px solid #000; margin-top: 20px; }
          </style>
        </head>
        <body onload="window.print(); window.onafterprint = window.close();">
          <div class="header">
            <div class="logo-section">
              <img src="${window.location.origin}/logo192.png" alt="Logo" />
              <div><strong>Technical Hub</strong><br/>221/A Makola Rd,<br/>Kiribathgoda,<br/>077 040 3904</div>
            </div>
            <div class="customer-info">
              <div><strong>Customer Name:</strong> ${printJob.customerName || ''}</div>
              <div><strong>Customer Contact:</strong> ${printJob.customerContact || ''}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
              <div><strong>${numberLabel}:</strong> ${number}</div>
            </div>
          </div>

          <div class="line"></div>

          <table class="info-table">
            <tr><td><strong>Printer:</strong></td><td>${printJob.printerBrand || ''} ${printJob.printerModel || ''}</td></tr>
            <tr><td><strong>Serial Number:</strong></td><td>${printJob.serialNumber || ''}</td></tr>
            <tr><td><strong>Repair Notes:</strong></td><td>${printJob.repairNotes || ''}</td></tr>
            <tr><td><strong>Technician:</strong></td><td>${printJob.technicianAssigned || ''}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${printJob.jobStatus || 'Completed'}</td></tr>
            <tr><td><strong>Cost Estimate:</strong></td><td>${printJob.costEstimate || ''}</td></tr>
            <tr><td><strong>Final Cost:</strong></td><td>${printJob.finalCost || ''}</td></tr>
            <tr><td><strong>Date Received:</strong></td><td>${printJob.dateReceived || ''}</td></tr>
            <tr><td><strong>Pickup Date:</strong></td><td>${printJob.pickupDate || ''}</td></tr>
          </table>

          <div class="section-title">Thank you for choosing Technical Hub!</div>
          <div>We appreciate your trust in our services.</div>
          <div class="footer">
            <div class="red">Terms & Conditions</div>
            <div class="terms">
              • 30-day warranty on repairs.<br/>
              • Not responsible for data loss.<br/>
              • Estimate approval required.<br/>
              • Repair time may vary.<br/>
              • Remove personal items before repair.
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };


  useEffect(() => {
    const filtered = completedJobs.filter((job) => {
      const matchSearch =
        job.customerContact?.includes(searchTerm) ||
        job.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(job.id).includes(searchTerm);

      const matchDate =
        (!startDate || new Date(job.dateReceived) >= new Date(startDate)) &&
        (!endDate || new Date(job.dateReceived) <= new Date(endDate));

      const matchTech = !technician || job.technicianAssigned === technician;

      return matchSearch && matchDate && matchTech;
    });
    setFilteredJobs(filtered);
  }, [searchTerm, startDate, endDate, technician, completedJobs]);

 
  const technicianList = [...new Set(completedJobs.map((job) => job.technicianAssigned))];

 
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredJobs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CompletedJobs');
    XLSX.writeFile(wb, 'CompletedJobs.xlsx');
  };

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Completed Job Sheets', 14, 14);
    doc.autoTable({
      head: [['ID', 'Customer', 'Printer', 'Problem', 'Technician', 'Date']],
      body: filteredJobs.map((j) => [
        j.id,
        j.customerName,
        `${j.printerBrand} ${j.printerModel}`,
        j.reportedProblem,
        j.technicianAssigned,
        formatDate(j.dateReceived),
      ]),
    });
    doc.save('CompletedJobs.pdf');
  };

  return (
    <div className="min-h-screen bg-green-100 p-0">
      <Header />
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ✅ Completed Job Sheets
      </h2>

      <div className="flex flex-wrap gap-3 justify-center mb-4">
        <input
          type="text"
          placeholder="Search by mobile, serial or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={technician}
          onChange={(e) => setTechnician(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Technicians</option>
          {technicianList.map((tech) => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </select>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-2 rounded">⬇️ Excel</button>
       
      </div>

      {loading ? (
        <div className="text-center text-blue-600">Loading...</div>
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
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 border-b">
                    <td className="p-2 border text-center">{String(job.id).padStart(4, '0')}</td>
                    <td className="p-2 border">{job.customerName}</td>
                    <td className="p-2 border">{job.printerBrand} {job.printerModel}</td>
                    <td className="p-2 border">{job.reportedProblem}</td>
                    <td className="p-2 border text-center">{job.technicianAssigned}</td>
                    <td className="p-2 border text-center">{formatDate(job.dateReceived)}</td>
                    <td className="p-2 border text-center space-x-1">
                      <button
                        onClick={() => generatePrintView(job, 'Job')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🖨️ Print
                      </button>
                      <button
                        onClick={() => generatePrintView(job, 'Invoice')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded"
                      >
                        🧾 Invoice
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
