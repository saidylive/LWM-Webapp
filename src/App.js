import React, { useEffect, useState } from 'react';
// import {Container} from '@mui/material';
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Marker,
  Popup,
  GeoJSON
} from 'react-leaflet'

import axios from "axios"

import './App.css'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import EventData from './data/Events';
import EventGallery from './data/EventGallery';
import GallerySlider from './components/gallery_slider';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

let SmallIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [3, 5]
});

L.Marker.prototype.options.icon = DefaultIcon;


function App() {
  const [map, setMap] = useState(null)
  const [markerPosition, setMarkerPosition] = useState([0, 0])
  const [marker, setMarker] = useState(null)
  const [showAnimation, setShowAnimation] = useState(true)
  const [showGallery, setGallery] = useState(false)
  const [sectorBoundary, setSectorBoundary] = useState()
  const [kamalpurDhakaRoute, setKamalpurDhakaRoute] = useState()
  const [kamalpurDhakaPoints, setKamalpurDhakaPoints] = useState()
  const [killingSitePoints, setKillingSitePoints] = useState()
  const [currentGalleryItems, setCurrentGalleryItems] = useState([])
  const [eventPos, setEventPos] = useState(0)
  const center = [23.777176, 90.399452]
  const AUTO_SLIDER_NAME = "Auto Slider"

  const changeEvent = () => {
    // if (!showAnimation) return
    let pos = eventPos + 1
    if (pos >= EventData.length) {
      pos = 0
    }
    const currentEvent = EventData[pos]
    // console.log("eventPos", pos)
    const code = currentEvent.Code
    let coordinates = null
    if (kamalpurDhakaPoints) {
      const tfs = kamalpurDhakaPoints.features.filter(item => item.properties.Code.indexOf(code) >= 0)
      const feature = tfs[0]
      if (feature) {
        coordinates = feature.geometry.coordinates
        const cr0 = coordinates[0]
        const cr1 = coordinates[1]
        coordinates = [cr1, cr0]
        setMarkerPosition(coordinates)
        // console.log("coordinates", coordinates)
      }
    }
    setEventPos(pos)
    if (coordinates && showAnimation) {
      if (map) {
        map.flyTo(coordinates, 9)
      }
      if (marker) {
        marker.openPopup()
      }
    }
  }

  const onGalleryClose = e => {
    setGallery(false)
  }

  const renderCurrentEvent = () => {
    const ev = EventData[eventPos]
    return <table className='table-events'>
      <tbody>
        <tr>
          <th>Place</th>
          <td>:</td>
          <td>{ev.Place}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>:</td>
          <td>{ev.Date}</td>
        </tr>
        <tr>
          <th>Target</th>
          <td>:</td>
          <td>{ev.Target}</td>
        </tr>
        <tr>
          <th>Event</th>
          <td>:</td>
          <td>{ev.Event}</td>
        </tr>
        <tr>
          <th>Team</th>
          <td>:</td>
          <td>{ev.Team}</td>
        </tr>
        <tr>
          <th>Pak. Leader</th>
          <td>:</td>
          <td>{ev.PakLeader}</td>
        </tr>
      </tbody >
    </table>
  }

  const handleEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        // setFeatureId(feature.properties.cartodb_id);
      }
    })
  }

  const handleEachFeatureKillingSite = (feature, layer) => {
    layer.on({
      click: (e) => {
        const name = feature.properties.Name
        if (Object.hasOwnProperty.call(EventGallery, name)) {
          const items = [{
            key: name,
            url: EventGallery[name]
          }]
          console.log(items)
          setCurrentGalleryItems(items)
          setGallery(true)
        }

      }
    })
  }

  useEffect(() => {
    if (!sectorBoundary) {
      axios.get("geojson/Sector_Bnd.json")
        .then((res) => {
          // console.log(res)
          if (res.status === 200) {
            setSectorBoundary(res.data)
          }
        })
        .catch()
    }
  }, [sectorBoundary])

  useEffect(() => {
    if (!kamalpurDhakaRoute) {
      axios.get("geojson/kamalpur_dhaka_route.json")
        .then((res) => {
          // console.log(res)
          if (res.status === 200) {
            setKamalpurDhakaRoute(res.data)
          }
        })
        .catch()
    }
  }, [kamalpurDhakaRoute])

  useEffect(() => {
    if (!kamalpurDhakaPoints) {
      axios.get("geojson/kamalpur_dhaka_points.json")
        .then((res) => {
          // console.log(res)
          if (res.status === 200) {
            setKamalpurDhakaPoints(res.data)
          }
        })
        .catch()
    }
  }, [kamalpurDhakaPoints])

  useEffect(() => {
    if (!killingSitePoints) {
      axios.get("geojson/KillingSiteVisited.json")
        .then((res) => {
          // console.log(res)
          if (res.status === 200) {
            setKillingSitePoints(res.data)
          }
        })
        .catch()
    }
  }, [killingSitePoints])

  useEffect(() => {
    const id = setInterval(changeEvent, 5000);
    return () => clearInterval(id);
  }, [eventPos])

  useEffect(() => {
    if (map) {
      // console.log("layout change callback")
      map.on("overlayadd", e => {
        // console.log(e)
        if (e.name === AUTO_SLIDER_NAME) {
          setShowAnimation(true)
        }
      })

      map.on("overlayremove", e => {
        // console.log(e)
        if (e.name === AUTO_SLIDER_NAME) {
          setShowAnimation(false)
        }
      })
    }
  }, [map])

  return (
    <MapContainer ref={setMap} center={center} zoom={8} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        {sectorBoundary ?
          <LayersControl.Overlay name="Sector Boundary">
            <GeoJSON data={sectorBoundary} />
          </LayersControl.Overlay>
          : null}

        {kamalpurDhakaRoute ?
          <LayersControl.Overlay checked name="Dhaka-Kamalpur Route">
            <GeoJSON data={kamalpurDhakaRoute} style={{ color: 'blue' }} />
          </LayersControl.Overlay>
          : null}

        {kamalpurDhakaPoints ?
          <LayersControl.Overlay checked name="Dhaka-Kamalpur Points">
            <GeoJSON
              data={kamalpurDhakaPoints}
              onEachFeature={handleEachFeature}
              pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, { radius: 4, color: 'red', fill: true, fillColor: 'red', fillOpacity: 0.8 })
              }}
            />
          </LayersControl.Overlay>
          : null}

        {killingSitePoints ?
          <LayersControl.Overlay checked name="Killing Sites">
            <GeoJSON
              data={killingSitePoints}
              onEachFeature={handleEachFeatureKillingSite}
              pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, { radius: 4, color: 'orange', fill: true, fillColor: 'red', fillOpacity: 0.8 })
              }}
            />
          </LayersControl.Overlay>
          : null}

        <LayersControl.Overlay checked name={AUTO_SLIDER_NAME}>
          <Marker ref={setMarker} position={markerPosition} icon={SmallIcon}>
            <Popup>
              {renderCurrentEvent()}
            </Popup>
          </Marker>
        </LayersControl.Overlay>

      </LayersControl>

      {showGallery ?
        <GallerySlider images={currentGalleryItems} onClose={onGalleryClose} />
        : null}
    </MapContainer>
  );
}

export default App;
