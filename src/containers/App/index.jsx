import React, { Component } from 'react';
import { increment, decrement } from 'actions/counter';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import point from './loc.png';

import './App.css';

export default class App extends Component {
  constructor() {
    super()
    this.state={
      map:null
    };
  }

  componentDidMount() {
    this.setState({
      map: new window.IMAP.Map(this.map, {
        minZoom: 3,
        maxZoom: 22,
        zoom: 10,
        center: new window.IMAP.LngLat(120.18252, 27.5917),
        animation: true,
    
      })
    })
  }

  componentDidUpdate(){
    this.state.map.plugin(['IMAP.Tool']);
    // console.log(this.state);
  }

  addPoint() {
    // this.state.map.plugin(['IMAP.Tool']);
    // console.log(window.IMAP)    
    let tool = new window.IMAP.MarkerTool(new window.IMAP.Icon(point,{"size":{
      "width":200,
      "height":200  
    }}));
    tool.follow = true;
    tool.title = '右键取消,左键标记';
    tool.autoClose = false;
    console.log(this.state);
    this.state.map.addTool(tool);
    tool.open();
    tool.addEventListener(window.IMAP.Constants.ADD_OVERLAY)
  }
  render() {
    // console.log(this.state)
    return (
      <div>
        <h1>
          hello world
      </h1>

        <div ref={(map)=>this.map = map} className='map' />
        <button className='point' onClick={this.addPoint.bind(this)}>Add point</button>

      </div>
    )
  }
};

