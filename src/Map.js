/* global google */
import React from 'react';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
} from 'react-google-maps';

import { DrawingManager } from 'react-google-maps/lib/components/drawing/DrawingManager'

export default withScriptjs(withGoogleMap(props => (
  <GoogleMap
    defaultZoom={15}
    center={props.center}
  >
    <DrawingManager
      defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
          ],
        },
        polygonOptions: {
          fillColor: `#32CD32`,
          fillOpacity: 0.5,
          strokeWeight: 2,
          strokeColor: `#32CD32`,
          zIndex: 1,
          selected: false,
        },
      }}
      onPolygonComplete={props.doneDrawing}
    />
  </GoogleMap>
)));