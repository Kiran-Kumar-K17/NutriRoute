import { useEffect, useState } from "react";
import { socket } from "./lib/socket";

const ORDER_ID = "YOUR_ORDER_ID";

const App = () => {
  const [status, setStatus] = useState("Waiting...");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch.get(`/api/orders/${ORDER_ID}/tracking`);

      setStatus(res.data.orderStatus);

      if (res.data.location) {
        setLocation(res.data.location);
      }
    };

    fetchOrder();
  }, []);

  const sendFakeLocation = () => {
    socket.emit("location-update", {
      orderId: ORDER_ID,
      latitude: 12.9716,
      longitude: 77.5946,
    });
  };

  return (
    <div>
      <h1>Order Tracking</h1>

      <h2>Status: {status}</h2>

      <button onClick={sendFakeLocation}>Send Fake Location</button>

      <h3>Driver Location</h3>

      {location && (
        <>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </>
      )}
    </div>
  );
};

export default App;
