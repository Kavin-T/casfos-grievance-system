import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const confirmAction = (message) => {
  return new Promise((resolve, reject) => {
    confirmAlert({
      title: "Confirm",
      message: "",
      buttons: [
        {
          label: "Ok",
          onClick: () => resolve(true),
          className: "confirm-ok",
        },
        {
          label: "Cancel",
          onClick: () => resolve(false),
          className: "confirm-cancel",
        },
      ],
      customUI: ({ onClose }) => {
        return (
          <div className="p-6 rounded-lg shadow-lg bg-white max-w-sm mx-auto">
            <h2 className="text-center text-xl font-semibold mb-4">Confirm</h2>
            <div className="text-center font-bold mb-6">{message}</div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => {
                  resolve(false);
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={() => {
                  resolve(true);
                  onClose();
                }}
              >
                Ok
              </button>
            </div>
          </div>
        );
      },
    });
  });
};

export default confirmAction;
