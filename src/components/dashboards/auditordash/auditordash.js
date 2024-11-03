import React, { useState } from "react";
import Nav from "../../../utils/Header";
import { BrowserProvider, Contract } from "ethers";
import contractabi from "../../../utils/contractabi";

function Auditordash() {
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const contractAddress = "0x1212cAb94Cc1DAFeb98D0836d211942c762C4f49";
  const loadPendingRequests = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractabi, signer);

      // Fetch pending reports
      const reports = await contract.viewPendingReportsForAuditor();
      console.log("Raw reports response:", reports);

      // Initialize an empty array to hold the formatted reports
      const arr = [];

      reports.map((report) => {
        arr.push({
          id: Number(report[8]), // Accessing directly
          subid: Number(report[6]), // Accessing directly
          projectName: report[0], // Accessing directly
          supplieradd: report[7], // Accessing directly
          reportPDF: report[3], // Accessing directly
          companyPhone: report[1], // Accessing directly
          geographicLocation: report[2], // Accessing directly
          creditAmount: Number(report[4]), // Converting BigInt to Number
          date: new Date(Number(report[5])).toLocaleDateString(),
        });
      });

      console.log("Formatted reports:", arr);
      setPendingReports(arr);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const handleApprove = async (supplier, reportId) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractabi, signer);
      const tx = await contract.approveReportByAuditor(supplier, reportId);
      await tx.wait();
      console.log("Report approved:", reportId);
      loadPendingRequests();
    } catch (error) {
      console.error("Error approving report:", error);
    }
  };

  const handleReject = async (reportId) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractabi, signer);
      const tx = await contract.rejectReportByAuditor(reportId);
      await tx.wait();
      console.log("Report rejected:", reportId);
      loadPendingRequests();
    } catch (error) {
      console.error("Error rejecting report:", error);
    }
  };

  const handleReportView = async (reportPDF) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/proxy/${encodeURIComponent(reportPDF)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error viewing report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh]">
      <header className="w-full h-[11vh] shadow-2xl flex flex-col justify-between p-1">
        <Nav />
      </header>

      <div className="h-[80vh] mt-1 flex flex-col items-center">
        <button
          onClick={loadPendingRequests}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Load Pending Requests
        </button>

        <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
          {pendingReports.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            pendingReports.map((report) => (
              <div
                key={report.id}
                className="w-full p-4 border bg-slate-950 border-gray-300 rounded-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold">
                  Report ID: {report.id}
                </h2>
                <p>Sub ID: {report.subid}</p>
                <p>Project Name: {report.projectName}</p>
                <p
                  onClick={() => {
                    handleReportView(report.reportPDF);
                  }}
                >
                  Report PDF:{" "}
                  <b className="text-violet-300 cursor-pointer text-sm hover:text-violet-600">
                    {report.reportPDF}
                  </b>
                </p>
                <p>Company Phone: {report.companyPhone}</p>
                <p>Geographic Location: {report.geographicLocation}</p>
                <p>Credit Amount: {report.creditAmount}</p>
                <p>Date: {report.date}</p>
                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={() => handleApprove(report.supplieradd, report.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(report.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {loading && <p className="mt-4 text-gray-700">Loading PDF...</p>}
        {pdfUrl && (
          <div className="fixed top-0 flex flex-col justify-center bg-slate-600 items-center w-[100vw] h-[100vh]">
            <div className="w-full flex justify-center items-center mb-4">
              <button
                onClick={() => setPdfUrl(null)}
                className="bg-green-600 font-bold p-2 text-black rounded shadow"
              >
                Close
              </button>
            </div>
            <iframe
              src={pdfUrl}
              width="80%"
              height="90%"
              className="border"
              title="Report PDF"
            ></iframe>
          </div>
        )}
      </div>

      <footer className="w-full h-[8vh] flex justify-center items-center bg-black text-white">
        © Copyright
      </footer>
    </div>
  );
}

export default Auditordash;
