import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import './App.css';

var layers = ['0-1.5', '1.5-3', '3-20', '20-30', '30+'];
var colors = ['#6abe66', '#7ca6cd', '#f2e933', '#feb839', '#ea6347'];

mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsbWVyZW5pcyIsImEiOiJja2ZybXJvMXgwZ3FoMndveHYwbTUyand1In0.tlEjK_iwraGKyLEGXJ0tiA';

const App = () => {
  const pdRef = useRef(null);
  const mapContainerRef = useRef(null);

  // initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: 'mapbox://styles/wilmerenis/ckfvtcv81202k19qmh2s2235n',
      center: [-104.9876, 39.7405],
      zoom: 2,
    });

    map.on('mousemove', function(e) {
      let states = map.queryRenderedFeatures(e.point, {
        layers: ['countries-data']
      });

      if (states.length > 0) {
        pdRef.current.innerHTML = '<h3><strong>' + states[0].properties.covid_score + ' Covid Lvl</strong></h3>';
      } else {
        pdRef.current.innerHTML = '<p>Hover over a state!</p>';
      }
    })

    map.on('click', function(e) {
      let states = map.queryRenderedFeatures(e.point, {
        layers: ['countries-data']
      })

      alert(`${states[0].properties.covid_score}-CovidLvl`)
    })

    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    // Add a single line of code to give the map the default pointer cursor.
    map.getCanvas().style.cursor = 'default';
    // Make sure the map shows the continental U.S. when it's loaded by setting the bounds of the map on load:
    map.fitBounds([[-133.2421875, 16.972741], [-47.63671875, 52.696361]]);

    // clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="map-container" ref={mapContainerRef} />
      <div class='map-overlay' id='features'>
        <h2>COVID lvl</h2>
        <div id='pd' ref={pdRef} ><p>Hover over a country!</p></div>
      </div>
      <div class='map-overlay' id='legend'>
        {layers.map((layer, index) => {
          return(
            <div key={index} >
              <span className="legend-key" style={{ backgroundColor: colors[index] }}></span>
              <span>{layer}</span>
            </div>
          )
        })}
      </div>
    </>
  );
};

export default App;
