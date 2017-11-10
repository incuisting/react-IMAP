import React, { Component } from 'react';
import Map from '../../components/IMAP/map';
import Marker from '../../components/IMAP/marker';
import PropTypes from 'prop-types';

import './App.css';

export default class App extends Component {

  render() {
    // console.log(this.state)
    return (
      <Map 
      options={{
        minZoom: 3,
        maxZoom: 22,
        zoom: 9,
        animation: true,
        center:new window.IMAP.LngLat(120.18252,30.243753),
      }}
      imapkey="ec85d3648154874552835438ac6a02b2"
      >
        <Marker/>
      </Map>
    )
  }
};

