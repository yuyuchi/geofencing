/* global google */
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import Map from './Map';
import './App.css';

const googleMapURL = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing&key=${process.env.REACT_APP_MAPS_API_KEY}`;

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      polygons: [],
      selectedPolygons: [],
    }
  }

  getCoordinates(polygon) {
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

  doneDrawing(polygon) {
    console.log('get polygon path', this.getCoordinates(polygon))

    this.setState({ polygons: this.state.polygons.concat(polygon) });
    console.log('new state of polygons', this.state.polygons)

    this.setState({
      fence: new google.maps.Polygon({
        paths: polygon.getPaths(),
      }),
    });

    let newShape = polygon
    google.maps.event.addListener(newShape, 'click', () => this.setSelection(newShape))
    
  }

  setSelection(shape) {
    shape.setOptions({
      fillColor: `#FF1493`,
      strokeColor: `#FF1493`,
      selected: true,
    })
    this.setState({
      selectedPolygons: this.state.selectedPolygons.concat(shape)
    })
  }

  removePolygon() {
    console.log('this.state.selectedPolygons: ', this.state.selectedPolygons)
    this.state.selectedPolygons.map(poly => poly.setMap(null))
    this.setState({
      polygons: this.state.polygons.filter(polygon => polygon.selected !== true)
    })    
  }

  getCurrentPosition() {
    const currentPosition = new google.maps.LatLng(this.state.center.lat, this.state.center.lng);
    return currentPosition;
  }

  clearSelection() {
    const selectedPoly = this.state.selectedPolygons
    if (selectedPoly) {
      selectedPoly.map(poly => {
        return (
          poly.setOptions({
            fillColor:  `#32CD32`,
            strokeColor: `#32CD32`,
            selected: false,
          })
        )
      })
      
      this.setState({
        selectedPolygons: []
      })
    }
  }

  render() {
    let map = null;
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
          doneDrawing={(e) => this.doneDrawing(e)}
        />
      </div>)

    return (
      <div className="App">
        {map}
        <button onClick={() => this.removePolygon()}>delete selected polygon(s)</button>
        <button onClick={() => this.clearSelection()}>clearSelection</button>
      </div>
    );
  }
}

export default App;
