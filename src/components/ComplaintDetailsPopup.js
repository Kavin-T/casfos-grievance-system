import React from "react";
import { statusFormat,priceFormat,dateFormat } from "../utils/formatting";
import { handleMediaOpen } from "../services/fileApi";

const ComplaintDetailsPopup = ({selectedComplaint}) =>{
    return (
        <>
            <h2 className="text-xl font-semibold text-green-800">
            {selectedComplaint.subject}
            </h2>
            <p>
            <strong>Raiser:</strong> {selectedComplaint.raiserName}
            </p>
            <p>
            <strong>Department:</strong> {selectedComplaint.department}
            </p>
            <p>
            <strong>Premises:</strong> {selectedComplaint.premises}
            </p>
            <p>
            <strong>Location:</strong> {selectedComplaint.location}
            </p>
            <p>
            <strong>Status:</strong> {statusFormat(selectedComplaint.status)}
            </p>
            <p>
            <strong>Created At:</strong>{" "}
            {dateFormat(selectedComplaint.createdAt)}
            </p>
            <p>
            <strong>Details:</strong>
            </p>
            <div className="max-h-[150px] overflow-y-auto border border-gray-300 p-2 rounded bg-gray-100">
            {selectedComplaint.details}
            </div>
            {selectedComplaint.resolvedName && (
            <p>
                <strong>Resolved by:</strong> {selectedComplaint.resolvedName}
            </p>
            )}
            {parseFloat(selectedComplaint.price.$numberDecimal) > 0 && (
                <div className="text-green-600 font-bold border border-green-600 p-2 my-5">
                Price: ₹ {priceFormat(selectedComplaint.price.$numberDecimal)}
                </div>
            )}
            <div className="grid grid-cols-2 gap-4 mt-4">
            {selectedComplaint.media.imgBefore && (
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                onClick={() =>
                    handleMediaOpen(selectedComplaint.media.imgBefore)
                }
                >
                Image Before
                </button>
            )}
            {selectedComplaint.media.vidBefore && (
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                onClick={() =>
                    handleMediaOpen(selectedComplaint.media.vidBefore)
                }
                >
                Video Before
                </button>
            )}
            {selectedComplaint.media.imgAfter && (
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                onClick={() =>
                    handleMediaOpen(selectedComplaint.media.imgAfter)
                }
                >
                Image After
                </button>
            )}
            {selectedComplaint.media.vidAfter && (
                <button
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                onClick={() =>
                    handleMediaOpen(selectedComplaint.media.vidAfter)
                }
                >
                Video After
                </button>
            )}
            </div>
        </>
    );
}

export default ComplaintDetailsPopup;