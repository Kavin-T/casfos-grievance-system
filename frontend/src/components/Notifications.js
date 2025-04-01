<<<<<<< HEAD
// // import React, { useState, useEffect } from "react";
// // import { fetchNotifications, markNotificationsAsRead } from "../services/notificationApi";
// // import { toast } from "react-toastify";
// // import Spinner from "./Spinner";

// // export default function Notifications() {
// //   const [notifications, setNotifications] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [unreadCount, setUnreadCount] = useState(0);
// //   const [isOpen, setIsOpen] = useState(false);

// //   useEffect(() => {
// //     fetchNotificationsData();
// //   }, []);

// //   const fetchNotificationsData = asy    nc () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetchNotifications();
// //       setNotifications(response);
// //       setUnreadCount(response.filter((notif) => !notif.read).length);
// //     } catch (error) {
// //       toast.error(error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleTabClick = async () => {
// //     setIsOpen(true);
// //     await fetchNotificationsData();

// //     if (unreadCount > 0) {
// //       await markNotificationsAsRead();
// //       setUnreadCount(0);
// //     }
// //   };

// //   return (
// //     <div className="relative">
// //       {/* Notification Tab Button with Badge */}
// //       <div onClick={handleTabClick} className="relative cursor-pointer text-green-600 font-semibold">
// //         <span>Notifications</span>

// //         {/* Red Badge Above "Notifications" */}
// //         {unreadCount > 0 && (
// //           <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
// //             {unreadCount}
// //           </span>
// //         )}
// //       </div>

// //       {/* Notification Panel (Opens on Click) */}
// //       {isOpen && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
// //           <div className="w-96 bg-white shadow-lg rounded-md p-4 z-10">
// //             <h2 className="text-xl font-semibold mb-4 text-center">Notifications</h2>

// //             {loading ? (
// //               <Spinner />
// //             ) : notifications.length > 0 ? (
// //               <div className="max-h-64 overflow-y-auto space-y-2">
// //                 {notifications.map((notification) => (
// //                   <div key={notification._id} className="bg-gray-100 p-3 rounded-md shadow-sm">
// //                     <p className="text-sm text-gray-800">
// //                       <strong>Complaint ID:</strong> {notification.complaintID}
// //                     </p>
// //                     <p className="text-sm text-gray-800">
// //                       <strong>Subject:</strong> {notification.subject}
// //                     </p>
// //                     <p className="text-sm text-green-600">{notification.message}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-gray-500 text-center">No notifications available</p>
// //             )}

// //             {/* Close Button */}
// //             <div className="flex justify-center mt-4">
// //               <button
// //                 onClick={() => setIsOpen(false)}
// //                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
// //               >
// //                 Close
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }




=======
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
// import React, { useState, useEffect } from "react";
// import { fetchNotifications, markNotificationsAsRead } from "../services/notificationApi";
// import { toast } from "react-toastify";
// import Spinner from "./Spinner";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d

//   useEffect(() => {
//     fetchNotificationsData();
//   }, []);

<<<<<<< HEAD
//   const fetchNotificationsData = async () => {
=======
//   const fetchNotificationsData = asy    nc () => {
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
//     try {
//       setLoading(true);
//       const response = await fetchNotifications();
//       setNotifications(response);
<<<<<<< HEAD
=======
//       setUnreadCount(response.filter((notif) => !notif.read).length);
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

<<<<<<< HEAD
//   return (
//     <div className="bg-white shadow rounded-lg p-6">

//       {/* Notification List */}
//       {loading ? (
//         <Spinner />
//       ) : notifications.length > 0 ? (
//         <div className="space-y-3">
//           {notifications.map((notification) => (
//             <div key={notification._id} className="bg-gray-100 p-3 rounded-md shadow-sm">
//               <p className="text-sm text-gray-800">
//                 <strong>Complaint ID:</strong> {notification.complaintID}
//               </p>
//               <p className="text-sm text-gray-800">
//                 <strong>Subject:</strong> {notification.subject}
//               </p>
//               <p className="text-sm text-green-600">{notification.message}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 text-center">No notifications available</p>
=======
//   const handleTabClick = async () => {
//     setIsOpen(true);
//     await fetchNotificationsData();

//     if (unreadCount > 0) {
//       await markNotificationsAsRead();
//       setUnreadCount(0);
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Notification Tab Button with Badge */}
//       <div onClick={handleTabClick} className="relative cursor-pointer text-green-600 font-semibold">
//         <span>Notifications</span>

//         {/* Red Badge Above "Notifications" */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {/* Notification Panel (Opens on Click) */}
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
//           <div className="w-96 bg-white shadow-lg rounded-md p-4 z-10">
//             <h2 className="text-xl font-semibold mb-4 text-center">Notifications</h2>

//             {loading ? (
//               <Spinner />
//             ) : notifications.length > 0 ? (
//               <div className="max-h-64 overflow-y-auto space-y-2">
//                 {notifications.map((notification) => (
//                   <div key={notification._id} className="bg-gray-100 p-3 rounded-md shadow-sm">
//                     <p className="text-sm text-gray-800">
//                       <strong>Complaint ID:</strong> {notification.complaintID}
//                     </p>
//                     <p className="text-sm text-gray-800">
//                       <strong>Subject:</strong> {notification.subject}
//                     </p>
//                     <p className="text-sm text-green-600">{notification.message}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center">No notifications available</p>
//             )}

//             {/* Close Button */}
//             <div className="flex justify-center mt-4">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { fetchNotifications } from "../services/notificationApi";
=======
import { fetchNotifications, markNotificationsAsRead } from "../services/notificationApi";
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
import { toast } from "react-toastify";
import Spinner from "./Spinner";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  const fetchNotificationsData = async () => {
    try {
      setLoading(true);
      const response = await fetchNotifications();
      setNotifications(response);
    } catch (error) {
<<<<<<< HEAD
      toast.error(error);
=======
      toast.error(error.message);
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
<<<<<<< HEAD
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>

=======

      {/* Notification List */}
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
      {loading ? (
        <Spinner />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
<<<<<<< HEAD
            <div
              key={notification._id}
              className="bg-gray-100 p-3 rounded-md shadow-sm"
            >
=======
            <div key={notification._id} className="bg-gray-100 p-3 rounded-md shadow-sm">
>>>>>>> fbd22962950b8d262d843bf7ccb994629bacfa4d
              <p className="text-sm text-gray-800">
                <strong>Complaint ID:</strong> {notification.complaintID}
              </p>
              <p className="text-sm text-gray-800">
                <strong>Subject:</strong> {notification.subject}
              </p>
              <p className="text-sm text-green-600">{notification.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No notifications available</p>
      )}
    </div>
  );
}
