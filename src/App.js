/* global google */
import React, { useState, useEffect } from 'react'
import Map from './Map'
import './App.css'

const googleMapURL = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=${process.env.REACT_APP_MAPS_API_KEY}`;

const App = () => {
  const [polygons, setPolygons] = useState([])
  const [selectedPolys, setSelectedPolys] = useState([])

  useEffect(() => {
    console.log('polygons', polygons)
    console.log('selected', selectedPolys)
  }, [polygons, selectedPolys])

  const doneDrawing = (poly) => {
    setPolygons(prevPolys => [...prevPolys, poly])
    google.maps.event.addListener(poly, 'click', () => setSelection(poly))
  }

  const removePolygon =  () => {
    selectedPolys.map(poly => poly.setMap(null))
    setPolygons(polygons.filter(polygon => polygon.selected !== true))
    setSelectedPolys([])
  }

  const clearSelection = () => {
    const selectedPoly = selectedPolys
    if (selectedPoly) {
      selectedPoly.map(poly => {
        return (
          poly.setOptions({
            fillColor: `#32CD32`,
            strokeColor: `#32CD32`,
            selected: false,
          })
        )
      })
      setSelectedPolys([])
    }
  }

  const caculatePath = () => {
    polygons.map(poly => {
      return console.log('get polygon path', getCoordinates(poly))
    })
  }

  function getCoordinates(polygon) {
    const polyArray = polygon.getPath().getArray()

    let paths = []
    polyArray.forEach(function (path) {
      paths.push({
        lat: path.lat(),
        lng: path.lng()
      })
    })
    return paths
  }

  function setSelection(shape) {    
    if(shape.selected === false) {
      shape.setOptions({
        fillColor: `#FF1493`,
        strokeColor: `#FF1493`,
        selected: true,
      })
      setSelectedPolys(prevSelected => [...prevSelected, shape])
    }
  }

  function getCurrentPosition() {
    const currentPosition = new google.maps.LatLng(this.state.center.lat, this.state.center.lng);
    return currentPosition;
  }

  let map = null
      map = (<div>
        <Map
          googleMapURL={googleMapURL}
          loadingElement={
            <p>Loading maps...</p>
          }
          containerElement={
            <div className="map-container" />
          }
          mapElement={
            <div className="map" />
          }
          center={{ lat: 22.626151, lng: 120.3021181 }}
          zoom={15}
          doneDrawing={doneDrawing}
        />
      </div>)
  return (
    <div className="App">
      {map}
      <button onClick={removePolygon}>delete selected polygon(s)</button>
      <button onClick={clearSelection}>clearSelection</button>
      <button onClick={caculatePath}>Caculate Path</button>
    </div>
  )
}

export default App