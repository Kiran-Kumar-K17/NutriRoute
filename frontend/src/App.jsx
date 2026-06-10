import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./lib/leafletIcon";
import { socket } from "./lib/socket";

function RecenterMap({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
}

function App() {
  const [location, setLocation] = useState({
    lat: 12.9716,
    lng: 77.5946,
  });
  const ORDER_ID = "6a292733635997572797015e";
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);

      socket.emit("join-order-room", ORDER_ID);
    });

    socket.on("driver-location", (data) => {
      console.log("Live Location:", data);

      setLocation({
        lat: data.latitude,
        lng: data.longitude,
      });
    });

    return () => {
      socket.off("driver-location");
      socket.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <button
        onClick={() => {
          socket.emit("location-update", {
            orderId: ORDER_ID,
            latitude: 12.975,
            longitude: 77.599,
          });
        }}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
        }}
      >
        Send Test Location
      </button>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={location.lat} lng={location.lng} />

        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div>
              <h3>Delivery Partner</h3>

              <p>Latitude: {location.lat}</p>

              <p>Longitude: {location.lng}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
