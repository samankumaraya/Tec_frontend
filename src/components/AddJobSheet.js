import React, { useState, useRef } from 'react';
import axios from 'axios';

const AddJobSheet = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    customerEmail: '',
    customerAddress: '',
    printerBrand: '',
    printerModel: '',
    serialNumber: '',
    accessoriesProvided: '',
    reportedProblem: '',
    repairNotes: '',
    additionalComments: '',
    dateReceived: '',
    pickupDate: '',
    estimatedCompletionDate: '',
    technicianAssigned: '',
    warrantyStatus: 'No',
    jobStatus: 'Pending',
    paymentStatus: 'Unpaid',
    priority: 'Medium',
    createdBy: '',
    costEstimate: '',
    finalCost: '',
  });

  const printRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobsheets', formData);
      alert('✅ Job Sheet Added Successfully!');
      setTimeout(() => {
        handlePrint();
      }, 500); // short delay for state consistency
    } catch (error) {
      console.error('❌ Error adding job sheet:', error);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Job Sheet</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 4px; vertical-align: top; }
            tr { border-bottom: 1px solid #ccc; }
            @page { size: A5; margin: 10mm; }
          </style>
        </head>
        <body onload="window.print(); window.onafterprint = window.close;">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();

    // Refresh main page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const renderInput = (key, labelOverride = null) => {
    const label = labelOverride || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const dropdownFields = {
      warrantyStatus: ['Yes', 'No'],
      jobStatus: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      paymentStatus: ['Unpaid', 'Paid', 'Partial'],
      priority: ['Low', 'Medium', 'High'],
    };

    const dateFields = ['dateReceived', 'pickupDate', 'estimatedCompletionDate'];
    const isTextArea = ['reportedProblem', 'repairNotes', 'additionalComments'].includes(key);

    return (
      <div key={key} className="grid grid-cols-2 items-center mb-3">
        <label className="text-right font-medium text-black pr-4">{label}</label>
        {dropdownFields[key] ? (
          <select
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="border border-gray-300 px-2 py-1 w-full bg-white rounded"
          >
            {dropdownFields[key].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : dateFields.includes(key) ? (
          <input
            type="date"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="border border-gray-300 px-2 py-1 w-full bg-white rounded"
          />
        ) : isTextArea ? (
          <textarea
            name={key}
            value={formData[key]}
            onChange={handleChange}
            rows="2"
            className="border border-gray-300 px-2 py-1 w-full bg-white rounded"
          />
        ) : (
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="border border-gray-300 px-2 py-1 w-full bg-white rounded"
          />
        )}
      </div>
    );
  };

  const leftColumnFields = [
    'customerName', 'customerContact', 'customerEmail', 'customerAddress',
    'printerBrand', 'printerModel', 'serialNumber', 'accessoriesProvided',
    'reportedProblem', 'repairNotes', 'additionalComments'
  ];

  const rightColumnFields = [
    'dateReceived', 'pickupDate', 'estimatedCompletionDate', 'technicianAssigned',
    'warrantyStatus', 'jobStatus', 'paymentStatus', 'priority',
    'createdBy', 'costEstimate', 'finalCost'
  ];

  return (
    <div className="min-h-screen bg-black py-6">
      <div className="bg-gray-300 text-black text-3xl font-bold px-6 py-3 border border-black w-fit mx-auto">
        Add Job Sheet
      </div>

      <div className="bg-pink-100 max-w-7xl mx-auto mt-4 p-6 border border-black">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              {leftColumnFields.map((key) => renderInput(key))}
            </div>
            <div>
              {rightColumnFields.map((key) => renderInput(key))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              ➕ Add Job Sheet
            </button>
          </div>
        </form>
      </div>

      {/* Hidden Printable Content */}
      <div ref={printRef} style={{ display: 'none' }}>
        <h2>🖨️ Printer Repair Job Sheet</h2>
        <table>
          <tbody>
            {Object.keys(formData).map((key) => (
              <tr key={key}>
                <td><strong>{key.replace(/([A-Z])/g, ' $1')}</strong></td>
                <td>: {formData[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddJobSheet;
