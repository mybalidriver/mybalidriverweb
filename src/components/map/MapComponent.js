"use client";

import React, { useState, useEffect, useRef } from "react";
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Search, MapPin, Navigation, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Formatter for IDR
const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const popularDestinations = [
  { id: 'nusa-penida', name: 'Nusa Penida', lat: -8.739184, lng: 115.53112 },
  { id: 'batur', name: 'Mount Batur', lat: -8.239045, lng: 115.377685 },
  { id: 'ubud', name: 'Ubud', lat: -8.51909, lng: 115.26325 },
  { id: 'uluwatu', name: 'Uluwatu', lat: -8.8267, lng: 115.0938 }
];

const toursData = [
  { id: 1, locationId: 'nusa-penida', price: 450000, name: 'Nusa Penida Day Trip', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=400&q=80' },
  { id: 2, locationId: 'batur', price: 350000, name: 'Mount Batur Sunrise Trek', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80' },
  { id: 3, locationId: 'ubud', price: 250000, name: 'Ubud Highlights & Monkey Forest', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
  { id: 4, locationId: 'ubud', price: 400000, name: 'Ubud Jungle Swing & Rice Terrace', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=400&q=80' },
  { id: 5, locationId: 'uluwatu', price: 300000, name: 'Uluwatu Sunset Temple Tour', image: 'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=400&q=80' },
];

const CATEGORIES = ["Tour", "Spa", "Transport", "Scooter"];

// Inner component for routing logic
function DirectionsEngine({ routeInfo, setPriceData }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLib || !map) return;
    setDirectionsService(new routesLib.DirectionsService());
    setDirectionsRenderer(new routesLib.DirectionsRenderer({ 
      map,
      suppressMarkers: false,
      polylineOptions: { strokeColor: "#1E1E24", strokeWeight: 4 }
    }));
  }, [routesLib, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !routeInfo) return;

    directionsService.route(
      {
        origin: routeInfo.origin,
        destination: routeInfo.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response) {
          directionsRenderer.setDirections(response);
          
          const leg = response.routes[0].legs[0];
          const distKm = typeof leg.distance?.value === "number" ? leg.distance.value / 1000 : 0;
          
          // IDR Grab-style logic: Base Rp 15.000 + Rp 6.500/km
          const basePrice = 15000;
          const pricePerKm = 6500;
          const calculatedPrice = basePrice + (distKm * pricePerKm);
          
          setPriceData({
            distanceText: leg.distance?.text || "",
            durationText: leg.duration?.text || "",
            price: formatIDR(calculatedPrice)
          });
        } else {
          console.error("Directions request failed due to " + status);
          setPriceData(null);
        }
      }
    );
    
    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    }
  }, [routeInfo, directionsService, directionsRenderer]);

  return null;
}

// Inner component for Google Autocomplete Inputs
function PlaceAutocompleteInput({ placeholder, onPlaceSelect, value, onChange, icon: Icon }) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = { fields: ["geometry", "name", "formatted_address"], componentRestrictions: { country: "id" } };
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    const listener = placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      // Prioritize name (like 'Alaya Resort Ubud') over full address.
      onPlaceSelect(place.name || place.formatted_address || "");
    });
    return () => {
      if (listener && window.google) window.google.maps.event.removeListener(listener);
    }
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="flex gap-3 items-center bg-[#F4F4F6] px-4 py-3 rounded-xl border border-border/50">
      {Icon ? <Icon size={14} className="text-secondary stroke-[3]" /> : <div className="w-2.5 h-2.5 rounded-full bg-accent relative after:absolute after:w-0.5 after:h-5 after:bg-border after:top-2.5 after:left-1"></div>}
      <input 
        ref={inputRef}
        type="text" 
        placeholder={placeholder} 
        className="flex-1 outline-none font-semibold text-[14px] bg-transparent text-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// Sub-component wrapper that has child access to APIProvider's hooks
function MapInterface() {
  const router = useRouter();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [priceData, setPriceData] = useState(null);
  
  // States migrated from MapPage
  const [activeMode, setActiveMode] = useState("Tour");
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const serviceParam = searchParams.get("service");
    if (serviceParam && CATEGORIES.includes(serviceParam)) {
      setActiveMode(serviceParam);
    }
  }, []);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [activeRouteInfo, setActiveRouteInfo] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isTransportMinimized, setIsTransportMinimized] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRouteSearch = () => {
    if (pickup && dropoff) {
      setActiveRouteInfo({ origin: pickup, destination: dropoff });
      setIsTransportMinimized(true);
    }
  };

  const showTours = activeMode !== "Transport";

  const displayedTours = selectedRegion 
    ? toursData.filter(t => t.locationId === selectedRegion) 
    : toursData;

  return (
    <>
      <Map
        defaultCenter={{ lat: -8.409518, lng: 115.188919 }}
        defaultZoom={10}
        mapId="DEMO_MAP_ID"
        disableDefaultUI={true}
        gestureHandling="greedy"
        onTilesLoaded={() => setMapLoaded(true)}
      >
        {showTours && popularDestinations.map((dest) => (
          <AdvancedMarker 
            key={dest.id} 
            position={{ lat: dest.lat, lng: dest.lng }} 
            onClick={() => setSelectedRegion(dest.id)}
          >
            <div className={`cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center ${selectedRegion === dest.id ? 'scale-110 z-10' : 'opacity-90'}`} style={{ transform: 'translate(0, -10px)' }}>
              <div className={`px-3.5 py-1.5 rounded-full font-bold text-[13px] shadow-lg whitespace-nowrap transition-colors border ${selectedRegion === dest.id ? 'bg-primary text-accent border-primary' : 'bg-white text-primary border-gray-100'}`}>
                {dest.name}
              </div>
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shadow-sm transition-colors ${selectedRegion === dest.id ? 'bg-primary' : 'bg-gray-400'}`}></div>
            </div>
          </AdvancedMarker>
        ))}

        {/* Dynamic Directions Render */}
        {activeRouteInfo && <DirectionsEngine routeInfo={activeRouteInfo} setPriceData={setPriceData} />}
      </Map>

      {!mapLoaded && <div className="absolute inset-0 bg-[#E8EAED] animate-pulse flex items-center justify-center -z-10"></div>}

      {/* OVERLAY UI */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-8 z-10 pt-12 md:pt-14 flex flex-col items-center gap-3 pointer-events-none">
        
        {activeMode === "Transport" ? (
          isTransportMinimized && activeRouteInfo ? (
            <button 
              onClick={() => setIsTransportMinimized(false)}
              className="bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-white/50 px-5 py-4 flex items-center gap-4 pointer-events-auto active:scale-[0.98] transition-all text-left w-full max-w-[400px] group"
            >
              <div className="w-3 h-3 rounded-full bg-accent relative shrink-0 z-10 shadow-[0_0_8px_rgba(217,251,65,0.8)]" />
              <div className="flex-1 font-bold text-[14.5px] text-primary truncate flex items-center gap-2">
                <span className="truncate max-w-[40%]">{pickup.split(',')[0]}</span>
                <span className="text-text-secondary/60">→</span> 
                <span className="truncate max-w-[40%]">{dropoff.split(',')[0]}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F4F4F6] flex justify-center items-center group-hover:bg-gray-200 transition-colors shrink-0">
                <Search size={14} className="text-primary" />
              </div>
            </button>
          ) : (
          <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-5 shadow-2xl border border-white/50 flex flex-col gap-3.5 pointer-events-auto w-full max-w-[400px] animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Filter Toggle Header for Transport Mode */}
            <div className="flex justify-between items-center px-1 mb-1">
              <h3 className="font-extrabold text-[16px] text-primary">Discover Ride</h3>
              <button onClick={() => setFilterOpen(!filterOpen)} className="w-8 h-8 flex items-center justify-center rounded-full bg-border/40 hover:bg-border/80 transition-colors">
                <SlidersHorizontal size={14} className="text-primary" />
              </button>
            </div>

            {/* If filters open, show category picker */}
            {filterOpen && (
              <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setActiveMode(cat); setActiveRouteInfo(null); setFilterOpen(false); }} className="px-4 py-1.5 rounded-full font-bold text-[12px] bg-[#F4F4F6] text-text-secondary active:scale-95">{cat}</button>
                ))}
              </div>
            )}

            <PlaceAutocompleteInput 
              placeholder="Pick-up Location..." 
              value={pickup} 
              onChange={setPickup} 
              onPlaceSelect={(val) => setPickup(val)} 
            />
            <PlaceAutocompleteInput 
              placeholder="Where to?" 
              value={dropoff} 
              onChange={setDropoff} 
              onPlaceSelect={(val) => setDropoff(val)} 
              icon={MapPin} 
            />
            
            <button 
              onClick={handleRouteSearch}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md mt-1 active:scale-[0.98] transition-transform"
            >
              Calculate Route
            </button>
          </div>
          )
        ) : (
          <div className="flex flex-col gap-2 pointer-events-auto relative w-full max-w-[400px]">
            <div className="bg-white/95 backdrop-blur-md rounded-full flex gap-3 items-center px-4 py-3.5 shadow-xl border border-white/50 relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)} 
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 text-primary active:scale-95 transition-all"
              >
                <span className="font-extrabold text-[14px] tracking-tight">{activeMode}</span>
                <ChevronDown size={14} className={`text-text-secondary transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="h-5 w-px bg-border/80"></div>
              
              <input 
                type="text" 
                placeholder={`Search ${activeMode.toLowerCase()}s nearby...`}
                className="flex-1 outline-none font-medium text-[15px] bg-transparent text-primary"
              />
            </div>
            
            {/* Expanded Dropdown Filters */}
            {filterOpen && (
              <div className="absolute top-[60px] left-0 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex flex-col min-w-[140px] border border-white/50 animate-in fade-in zoom-in-95 duration-200">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { setActiveMode(cat); setFilterOpen(false); }} 
                    className={`px-4 py-2.5 rounded-xl font-bold text-[13px] text-left transition-colors ${activeMode === cat ? 'bg-primary text-accent' : 'bg-transparent text-text-secondary hover:bg-gray-50 hover:text-primary'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grab-like Pricing Overlay Box */}
      {activeMode === "Transport" && priceData && (
        <div className="absolute bottom-[96px] left-6 right-6 z-20 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-border pointer-events-auto">
            <div className="flex justify-between items-start mb-3">
               <div>
                 <h3 className="font-bold tracking-tight text-[18px] text-primary">Discover Ride</h3>
                 <p className="text-[13px] text-text-secondary font-semibold">{priceData.distanceText} • {priceData.durationText} arrival</p>
               </div>
               <div className="text-right">
                 <div className="text-[18px] font-extrabold text-primary">{priceData.price}</div>
                 <p className="text-[11px] text-text-secondary uppercase tracking-wider font-bold">Standard</p>
               </div>
            </div>
            <button className="w-full bg-accent text-primary font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-transform flex justify-center items-center gap-2">
              Confirm Ride
            </button>
          </div>
        </div>
      )}
      
      {/* Bottom Swipable Tour Cards Overlay */}
      {activeMode !== "Transport" && (
        <div className="absolute bottom-[96px] left-0 right-0 z-10 w-full animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-none">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 gap-4 pb-4 pointer-events-auto">
            {displayedTours.map((tour) => (
              <div key={tour.id} onClick={() => router.push(`/tours/${tour.id}`)} className="snap-center shrink-0 w-[calc(100vw-64px)] max-w-[320px] bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl flex gap-4 items-center border border-white/50 cursor-pointer active:scale-[0.98] transition-transform">
                <img src={tour.image} alt={tour.name} className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm" />
                <div className="flex-1 flex flex-col justify-center overflow-hidden">
                  <h3 className="font-bold text-[15px] leading-tight text-primary mb-1 truncate">{tour.name}</h3>
                  <p className="text-[13px] text-text-secondary font-semibold">Available now</p>
                  <div className="text-primary font-extrabold mt-1.5">{formatIDR(tour.price)}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent flex justify-center items-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer">
                  <Navigation size={18} className="text-primary" />
                </div>
              </div>
            ))}
            {displayedTours.length === 0 && (
              <div className="snap-center shrink-0 w-[calc(100vw-64px)] max-w-[320px] bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center border border-white/50 text-center">
                <p className="font-bold text-[15px] text-primary">No tours found here yet.</p>
                <button onClick={() => setSelectedRegion(null)} className="mt-3 text-[13px] font-bold text-accent bg-primary px-4 py-2 rounded-full">View All Tours</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function MapComponent() {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyBvRg3xJ6dSPKSOwTRSmGUmaEfYRQ5WRCQ";
  return (
    <div className="w-full h-[100dvh] absolute inset-0 z-0">
      <APIProvider apiKey={API_KEY}>
        <MapInterface />
      </APIProvider>
    </div>
  );
}
