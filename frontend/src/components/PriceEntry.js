import React, { useState, useEffect } from "react";
import { fetchComplaintsWithPriceLater } from "../services/complaintApi";
import { updateComplaintPrice } from "../services/yourActivity";
import ComplaintBasicDetails from "./ComplaintBasicDetails";
import ComplaintAdditionalDetails from "./ComplaintAdditionalDeatils";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

const PriceEntry = () => {
  const [complaints, setComplaints] = useState([]);
  const [priceUpdates, setPriceUpdates] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("modal");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await fetchComplaintsWithPriceLater();
      setComplaints(data);
    } catch (error) {
      toast.error("Error fetching complaints: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, price) => {
    setPriceUpdates((prevState) => ({
      ...prevState,
      [id]: price,
    }));
  };

  const updatePrice = async (id) => {
    const price = priceUpdates[id];
    if (!price || price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await updateComplaintPrice({ id, price });
      toast.success("Price updated successfully!");
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (error) {
      toast.error("Error updating price: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Price Entry</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setViewMode("modal")}
          className={`px-4 py-2 rounded-lg shadow-md mr-2 ${
            viewMode === "modal"
              ? "bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          View in Card
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded-lg shadow-md ${
            viewMode === "list"
              ? "bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          View in List
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {viewMode === "modal" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {complaints.map((complaint) => {
                const bgColor =
                  complaint.status === "RESOLVED"
                    ? "bg-green-100 border-green-300"
                    : complaint.emergency
                    ? "bg-red-100 border-red-300"
                    : "bg-yellow-100 border-yellow-300";

                return (
                  <div
                    key={complaint._id}
                    className={`p-4 shadow-md rounded-lg border ${bgColor}`}
                  >
                    <ComplaintBasicDetails complaint={complaint} />
                    <div className="flex flex-col gap-2 mt-4">
                      <input
                        type="number"
                        value={priceUpdates[complaint._id] || ""}
                        onChange={(e) =>
                          handlePriceChange(complaint._id, e.target.value)
                        }
                        className="p-2 border rounded"
                        placeholder="Enter price"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updatePrice(complaint._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1"
                        >
                          Update Price
                        </button>
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-3 text-left text-green-700">ID</th>
                    <th className="p-3 text-left text-green-700">Name</th>
                    <th className="p-3 text-left text-green-700">Subject</th>
                    <th className="p-3 text-left text-green-700">Department</th>
                    <th className="p-3 text-left text-green-700">Premises</th>
                    <th className="p-3 text-left text-green-700">Location</th>
                    <th className="p-3 text-left text-green-700">Details</th>
                    <th className="p-3 text-left text-green-700">Emergency</th>
                    <th className="p-3 text-left text-green-700">Status</th>
                    <th className="p-3 text-left text-green-700">Created</th>
                    <th className="p-3 text-left text-green-700">Price</th>
                    <th className="p-3 text-left text-green-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => {
                    const rowBg =
                      complaint.status === "RESOLVED"
                        ? "bg-green-50"
                        : complaint.emergency
                        ? "bg-red-50"
                        : "bg-yellow-50";

                    return (
                      <tr
                        key={complaint._id}
                        className={`${rowBg} hover:bg-green-100`}
                      >
                        <td className="p-3 border-b">
                          {complaint.complaintID}
                        </td>
                        <td className="p-3 border-b">
                          {complaint.complainantName}
                        </td>
                        <td className="p-3 border-b">{complaint.subject}</td>
                        <td className="p-3 border-b">{complaint.department}</td>
                        <td className="p-3 border-b">{complaint.premises}</td>
                        <td className="p-3 border-b">
                          {complaint.specificLocation}
                        </td>
                        <td className="p-3 border-b">{complaint.details}</td>
                        <td className="p-3 border-b">
                          {complaint.emergency ? "Yes" : "No"}
                        </td>
                        <td className="p-3 border-b capitalize">
                          {complaint.status.toLowerCase()}
                        </td>
                        <td className="p-3 border-b">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 border-b">
                          <input
                            type="number"
                            value={priceUpdates[complaint._id] || ""}
                            onChange={(e) =>
                              handlePriceChange(complaint._id, e.target.value)
                            }
                            className="p-2 border rounded w-full"
                            placeholder="Enter price"
                          />
                        </td>
                        <td className="p-3 border-b">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updatePrice(complaint._id)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => setSelectedComplaint(complaint)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-green-800 mb-4">
              Complaint Details
            </h2>
            <ComplaintBasicDetails complaint={selectedComplaint} />
            <ComplaintAdditionalDetails complaint={selectedComplaint} />
            <div className="mt-4">
              <input
                type="number"
                value={priceUpdates[selectedComplaint._id] || ""}
                onChange={(e) =>
                  handlePriceChange(selectedComplaint._id, e.target.value)
                }
                className="p-2 border rounded w-full mb-2"
                placeholder="Enter price"
              />
              <button
                onClick={() => updatePrice(selectedComplaint._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
              >
                Update Price
              </button>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceEntry;
