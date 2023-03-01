import React, { useEffect, useState } from 'react';
// import {Container} from '@mui/material';
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  Circle,
  FeatureGroup,
  Rectangle,
  GeoJSON
} from 'react-leaflet'

import axios from "axios"

import './App.css'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


function App() {
  const [sectorBoundary, setSectorBoundary] = useState()
  const [kamalpurDhakaRoute, setKamalpurDhakaRoute] = useState()
  const [kamalpurDhakaPoints, setKamalpurDhakaPoints] = useState()
  const center = [23.777176, 90.399452]
  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ]

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

  return (
    <MapContainer center={center} zoom={8} scrollWheelZoom={true}>
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
            <GeoJSON data={kamalpurDhakaRoute} style={{color: 'blue'}} />
          </LayersControl.Overlay>
          : null}

        {kamalpurDhakaPoints ?
          <LayersControl.Overlay checked name="Dhaka-Kamalpur Points">
            <GeoJSON
              data={kamalpurDhakaPoints}
              pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, {radius: 4, color: 'red', fill: true, fillColor: 'red', fillOpacity: 0.8})
              }}
            />
          </LayersControl.Overlay>
          : null}

        <LayersControl.Overlay name="Marker with popup">
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Layer group with circles">
          <LayerGroup>
            <Circle
              center={center}
              pathOptions={{ fillColor: 'blue' }}
              radius={200}
            />
            <Circle
              center={center}
              pathOptions={{ fillColor: 'red' }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={[51.51, -0.08]}
                pathOptions={{ color: 'green', fillColor: 'green' }}
                radius={100}
              />
            </LayerGroup>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Feature group">
          <FeatureGroup pathOptions={{ color: 'purple' }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default App;
