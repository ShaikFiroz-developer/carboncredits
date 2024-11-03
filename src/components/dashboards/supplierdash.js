import React, { useEffect, useState, useContext } from "react";
import { Nav } from "../../utils/Header";
import TransferCreditsComp from "./transfercct";
import SubmittingrepoComp from "./submitrepocomp";
import ShareAddressComp from "./share";
import { LoginContext } from "../../utils/logincontext";
import Checkbalance from "./checkbalance";
import { BrowserProvider, Contract } from "ethers";
import contractabi from "../../utils/contractabi";

const Card = ({ name, setreq }) => (
  <div
    onClick={() => setreq(name)}
    className="bg-green-500 cursor-pointer flex items-center text-black font-semibold justify-center p-4 m-2 shadow-lg rounded"
  >
    <h1>{name}</h1>
  </div>
);

function Supplierdash() {
  const [req, setreq] = useState("");
  const { userdetails } = useContext(LoginContext);
  const [useraccount, setuseraccount] = useState("");
  const [acceptedReports, setAcceptedReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [loadingAccepted, setLoadingAccepted] = useState(false);
  const [loadingRejected, setLoadingRejected] = useState(false);

  const contractAddress = "0x1212cAb94Cc1DAFeb98D0836d211942c762C4f49"; // Replace with actual contract address

  useEffect(() => {
    const setData = async () => {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setuseraccount(address); // Sets the correct address
        } catch (error) {
          console.error("Error fetching user account:", error);
        }
      } else {
        console.log("Ethereum provider not found");
      }
    };
    setData();
  }, []);

  const loadAcceptedReports = async () => {
    setLoadingAccepted(true);
    setAcceptedReports([]); // Reset accepted reports list
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractabi, signer);
      const reports = await contract.getApprovedReportsForSupplier(); // Assuming this function exists in your contract
      setAcceptedReports(reports);
    } catch (error) {
      console.error("Error loading accepted reports:", error);
    } finally {
      setLoadingAccepted(false);
    }
  };

  const loadRejectedReports = async () => {
    setLoadingRejected(true);
    setRejectedReports([]); // Reset rejected reports list
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractabi, signer);
      const reports = await contract.getRejectedReportsForSupplier(); // Assuming this function exists in your contract
      setRejectedReports(reports);
    } catch (error) {
      console.error("Error loading rejected reports:", error);
    } finally {
      setLoadingRejected(false);
    }
  };

  return (
    <div className="w-full bg-slate-800 min-h-screen flex flex-col">
      <header className="w-full h-[12vh] shadow-2xl flex flex-col justify-between">
        <Nav />
      </header>
      <div className="flex-1 p-4 text-left">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Supplier Dashboard
        </h1>
        <div className="grid grid-cols-4 gap-4 bg-slate-900 rounded font-medium place-items-center p-4">
          {[
            "Submit Report",
            "Balance Check",
            "Transfer CCT",
            "Receive CCT",
          ].map((item, index) => (
            <Card name={item} key={index} setreq={setreq} />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={loadAcceptedReports}
            className="bg-green-200 text-black font-bold p-2 rounded"
            disabled={loadingAccepted}
          >
            {loadingAccepted ? "Loading..." : "Load Accepted Reports"}
          </button>
          <button
            onClick={loadRejectedReports}
            className="bg-red-200 text-black font-bold p-2 rounded"
            disabled={loadingRejected}
          >
            {loadingRejected ? "Loading..." : "Load Rejected Reports"}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded overflow-y-auto max-h-60">
            <h2 className="text-xl font-bold mb-2 text-green-300">
              Accepted Reports
            </h2>
            {acceptedReports.length > 0 ? (
              acceptedReports.map((report, index) => (
                <div key={index} className="p-2 bg-green-100 mb-2 rounded">
                  <p>
                    <strong>ID:</strong> {Number(report.id)}{" "}
                    {/* Convert BigInt to Number */}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(Number(report.timestamp) * 1000).toLocaleString()}{" "}
                    {/* Convert BigInt timestamp */}
                  </p>
                  <p>
                    <strong>Details:</strong> {report.details}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No accepted reports available</p>
            )}
          </div>
          <div className="bg-slate-700 p-4 rounded overflow-y-auto max-h-60">
            <h2 className="text-xl font-bold mb-2 text-red-300">
              Rejected Reports
            </h2>
            {rejectedReports.length > 0 ? (
              rejectedReports.map((report, index) => (
                <div key={index} className="p-2 bg-red-100 mb-2 rounded">
                  <p>
                    <strong>ID:</strong> {Number(report.id)}{" "}
                    {/* Convert BigInt to Number */}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(Number(report.timestamp) * 1000).toLocaleString()}{" "}
                    {/* Convert BigInt timestamp */}
                  </p>
                  <p>
                    <strong>Reason:</strong> {report.reason}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No rejected reports available</p>
            )}
          </div>
        </div>
      </div>
      {req === "Transfer CCT" && <TransferCreditsComp setreq={setreq} />}
      {req === "Submit Report" && <SubmittingrepoComp setreq={setreq} />}
      {req === "Receive CCT" && <ShareAddressComp setreq={setreq} />}
      {req === "Balance Check" && (
        <Checkbalance setreq={setreq} supplieraddress={useraccount} />
      )}
      <footer className="w-full h-[8vh] flex justify-center items-center bg-black text-white">
        © Copyright
      </footer>
    </div>
  );
}

export default Supplierdash;
