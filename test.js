import React, { useEffect, useRef, useState } from "react";

const LocationMap = () => {
  const mapRef = useRef(null);
  const [selectedCenter, setSelectedCenter] = useState(null); // State for selected treatment center
  const userLocation = { lat: 24.8607, lng: 67.0011 }; // Default location if geolocation fails
  const mapRefInstance = useRef(null); // Create a ref for the map instance

  const loadScript = (url) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => {
      if (window.initMap) window.initMap(); // Call initMap once the script is loaded
    };
    document.body.appendChild(script);
  };

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 13,
      mapTypeControl: true,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: false,
      disableDefaultUI: true,
    });

    mapRefInstance.current = map; // Store the map instance

    // Create the "My Location" button with Google Maps style
    const locationButton = document.createElement("button");
    locationButton.style.backgroundColor = "white";
    locationButton.style.border = "none";
    locationButton.style.borderRadius = "2px";
    locationButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    locationButton.style.cursor = "pointer";
    locationButton.style.margin = "10px";
    locationButton.style.padding = "10px";
    locationButton.title = "My Location";

    // Use the "My Location" icon from Google Maps
    const locationIcon = document.createElement("img");
    locationIcon.src =
      "https://maps.gstatic.com/mapfiles/ms/icons/blue-dot.png"; // Google Maps blue dot icon
    locationIcon.style.width = "20px"; // Adjust the icon size
    locationIcon.style.height = "20px";
    locationButton.appendChild(locationIcon);

    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(
      locationButton
    );

    // Add click event to the location button
    locationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            map.setCenter(pos); // Center the map on user's location
            new window.google.maps.Marker({
              position: pos,
              map,
              title: "Your Location",
            });
          },
          () => {
            handleLocationError(true, map.getCenter(), map);
          }
        );
      } else {
        handleLocationError(false, map.getCenter(), map);
      }
    });

    // Add treatment center coordinates
    const treatmentCenters = [
      {
        lat: 33.6727362885491,
        lng: 73.08032189903332,
        title:
          "Kiran Aamir - Clinical Psychologist, Suit # 992, Street 92, I-8/4, Islamabad",
      },
      {
        lat: 33.6938,
        lng: 73.0652,
        title:
          "Dr Harmain (psychologist), House Number 1, Rehara House, New, Jinnah Ave, Rehara, Islamabad",
      },
      {
        lat: 33.7098,
        lng: 73.0551,
        title:
          "PsychCare | Dr. Semra Salik - Consultant Clinical Psychologist | Psychotherapist, First Floor, Time Square Plaza, Office 1, G-8 Markaz Islamabad",
      },
      {
        lat: 24.8607,
        lng: 67.0011,
        title:
          "Karachi Treatment Center - 9-c, Sunset Commercial Street #1, Phase 2 Ext Defence Housing Authority, Karachi",
      },
      {
        lat: 31.584745068399844,
        lng: 74.31923408091777, // Coordinates for Lahore
        title:
          "Samad Khan Psychologist In Lahore - Mental Health Counsellor, 54/2 Lane 1, Block A Model Town, Lahore, Punjab",
      },
      {
        lat: 30.34998871427291,
        lng: 71.4286639470031,
        title:
          "Dr.Haleema Psychologist, 6C3W+8JF, Khan center, Nishtar Rd, Justice Hamid Colony, Multan, Punjab",
      },
      {
        lat: 34.072241312667146,
        lng: 71.417032372931,
        title:
          "Huma Mughal Psychologist, Sugar Hospital, Phase 5 Hayatabad, Peshawar, 25000",
      },
    ];

    const bounds = new window.google.maps.LatLngBounds();

    treatmentCenters.forEach((center) => {
      const centerMarker = new window.google.maps.Marker({
        position: center,
        map,
        title: center.title,
      });

      // Extend the bounds to include this marker's position
      bounds.extend(centerMarker.getPosition());

      centerMarker.addListener("click", () => {
        setSelectedCenter(center); // Update the selected center when clicked
        fetchUserLocation(center); // Fetch the user's location and get directions
        // Set the zoom level and center the map on the clicked treatment center
        map.setCenter(centerMarker.getPosition());
        map.setZoom(16); // Adjust zoom level as needed
      });
    });

    // Adjust the map to fit all treatment center markers
    map.fitBounds(bounds);
  };

  const handleLocationError = (browserHasGeolocation, pos, map) => {
    const infoWindow = new window.google.maps.InfoWindow({
      position: pos,
    });
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  };

  // Function to fetch the user's current location and open directions
  const fetchUserLocation = (destination) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          openGoogleMapsDirections(origin, destination);
        },
        () => {
          // If fetching the user's location fails, use the default location as the origin
          openGoogleMapsDirections(userLocation, destination);
        }
      );
    } else {
      // If geolocation is not available, use the default location as the origin
      openGoogleMapsDirections(userLocation, destination);
    }
  };

  const openGoogleMapsDirections = (origin, destination) => {
    const originStr = `${origin.lat},${origin.lng}`;
    const destinationStr = `${destination.lat},${destination.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}&travelmode=driving`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    window.initMap = initMap;
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyC7gzfgeesqlH1hSlLkWUecRMdQ1be7A98&libraries=places`
    );
  }, []);

  // Effect to center the map on the selected treatment center
  useEffect(() => {
    if (selectedCenter && mapRefInstance.current) {
      mapRefInstance.current.setCenter(selectedCenter); // Center map on selected center
      mapRefInstance.current.setZoom(16); // Zoom in when a center is selected
    }
  }, [selectedCenter]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-xl font-bold mb-4">Location Map</h1>
      <div ref={mapRef} className="h-[500px] w-full max-w-screen-lg"></div>
    </div>
  );
};

export default LocationMap;
