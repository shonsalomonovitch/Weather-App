import React, { useEffect, useState } from "react";

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
      {!isOnline && (
        <div style={{ color: "red", padding: "10px", background: "#ffe5e5" }}>
          You are currently offline. Please check your internet connection.
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
