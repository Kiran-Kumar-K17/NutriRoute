import { useEffect, useState } from "react";
import { socket } from "./lib/socket";

const ORDER_ID = "6a292733635997572797015e";

function App() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Waiting for GPS...");
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.emit("join-order-room", ORDER_ID);

    socket.on("driver-location", (data) => {
      console.log("Location received:", data);
      setLocation(data);
    });

    return () => {
      socket.off("driver-location");
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("Sending:", latitude, longitude);

        setStatus("Tracking...");

        socket.emit("location-update", {
          orderId: ORDER_ID,
          latitude,
          longitude,
        });
      },
      (error) => {
        console.error(error);
        setStatus(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setStatus("Tracking Stopped");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Food Delivery GPS Test</h1>

      <h3>{status}</h3>

      <button onClick={startTracking}>Start GPS Tracking</button>

      <button onClick={stopTracking} style={{ marginLeft: "10px" }}>
        Stop GPS Tracking
      </button>

      <hr />

      <h2>Latest Location</h2>

      {location ? (
        <>
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>

          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
        </>
      ) : (
        <p>No location received yet.</p>
      )}
    </div>
  );
}

export default App;
