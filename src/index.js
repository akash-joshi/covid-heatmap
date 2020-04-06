import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, Marker, Circle } from "react-leaflet";
import { useSearchParam } from "react-use";
import axios from "axios";
import "./styles.css";

export default function App() {
  const lat = useSearchParam("lat");
  const long = useSearchParam("long");

  const initialPolygons = [];

  const [circles, setCircles] = useState(initialPolygons);

  const [zoom, setZoom] = useState(16);

  // [18.52043, 73.856743]
  const state = {
    center: lat && long ? [parseFloat(lat), parseFloat(long)] : [17.426352, 78.43494],
    zoom: 17
  };

  useEffect(() => {
    const reqData = {
      lat: state.center[0],
      long: state.center[1],
      radius: 3 + (zoom - 16),
      web: 1
    };

    axios.post(`https://defeatcovid.herokuapp.com/heatmap`, reqData).then(r => {
      console.log(r.data);
      const nextCircles = r.data.map(circle => {
        return {
          points: [circle.lat, circle.long],
          color: circle.color
        };
      });
      setCircles(nextCircles);
    });
  }, [zoom, state]);

  return (
    <div>
      <Map
        maxZoom={19}
        onZoomEnd={e => setZoom(e.target._zoom)}
        center={state.center}
        zoom={state.zoom}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={state.center} />
        {circles.map((circle, index) => (
          <Circle
            key={index}
            color={circle.color}
            fillOpacity={1}
            center={circle.points}
            radius={50}
          />
        ))}
      </Map>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
