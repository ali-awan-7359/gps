import React, { useState, useEffect } from "react";
import UserLocation from "../components/UserLocation";
import TreatmentCenterList from "../components/TreatmentCenterList";
import LocationMap from "../components/LocationMap";

const HomeScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [centers, setCenters] = useState([]);

  const updatedCenters = [
    {
      name: "Kiran Aamir - Clinical Psychologist",
      address:
        "Suit # 992, Street 92, I-8/4, Islamabad, Islamabad Capital Territory 44000",
      phone: "051-123-4567",
      email: "contact@kiranpsychologist.com",
      website: "http://kiranpsychologist.com",
      coordinates: { lat: 33.6727362885491, lng: 73.08032189903332 },
    },
    {
      name: "Dr Harmain (psychologist)",
      address:
        "House Number 1, Rehara House, New, Jinnah Ave, Rehara, Islamabad, Islamabad Capital Territory 54000",
      phone: "051-987-6543",
      email: "contact@drharmain.com",
      website: "http://drharmain.com",
      coordinates: { lat: 33.6938, lng: 73.0652 },
    },
    {
      name: "PsychCare | Dr. Semra Salik - Consultant Clinical Psychologist | Psychotherapist",
      address:
        "First Floor, Time Square Plaza, Office 1, G-8 Markaz, Islamabad",
      phone: "051-345-6789",
      email: "contact@psychcare.com",
      website: "http://psychcare.com",
      coordinates: { lat: 33.7098, lng: 73.0551 },
    },
    {
      name: "Karachi Treatment Center",
      address:
        "9-c, Sunset Commercial Street #1, Phase 2 Ext Defence Housing Authority, Karachi, Karachi City, Sindh 75500",
      phone: "021-123-4567",
      email: "contact@karachicenter.com",
      website: "http://karachicenter.com",
      coordinates: { lat: 24.8607, lng: 67.0011 },
    },
    {
      name: "Samad Khan Psychologist",
      address: "54/2 Lane 1, Block A Model Town, Lahore, Punjab",
      phone: "042-123-4567",
      email: "contact@samadkhan.com",
      website: "http://samadkhan.com",
      coordinates: { lat: 31.584745068399844, lng: 74.31923408091777 },
    },
    {
      name: "Dr. Haleema Psychologist",
      address:
        "6C3W+8JF, Khan center, Nishtar Rd, Justice Hamid Colony, Multan, Punjab",
      phone: "061-123-4567",
      email: "contact@drhaleema.com",
      website: "http://drhaleema.com",
      coordinates: { lat: 30.34998871427291, lng: 71.4286639470031 },
    },
    {
      name: "Huma Mughal Psychologist",
      address: "Sugar Hospital, Phase 5 Hayatabad, Peshawar, 25000",
      phone: "091-123-4567",
      email: "contact@humamughal.com",
      website: "http://humamughal.com",
      coordinates: { lat: 34.072241312667146, lng: 71.417032372931 },
    },
  ];

  useEffect(() => {
    setCenters(updatedCenters); // Update centers with the new data
  }, []); // Empty array ensures this effect only runs once, at mount.

  const handleCenterSelect = (coordinates) => {
    setUserLocation(coordinates);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to the GPS App</h1>
      <UserLocation onLocationChange={setUserLocation} />
      <LocationMap
        center={userLocation || { lat: 33.6844, lng: 73.0479 }} // Default to Islamabad if no user location
        zoom={13}
        markers={centers.map((center) => ({
          position: [center.coordinates.lat, center.coordinates.lng],
          description: center.name,
        }))}
      />
      <TreatmentCenterList
        centers={centers}
        onCenterSelect={handleCenterSelect}
      />
    </div>
  );
};

export default HomeScreen;
