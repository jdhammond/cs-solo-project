import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';
import * as THREE from '/Users/jdh/Documents/codesmith/webpack-test/node_modules/three/build/three.module.js';
// import {
//   MTLLoader,
//   OBJLoader,
// } from '/Users/jdh/Documents/codesmith/webpack-test/node_modules/three/src/loaders/MaterialLoader.js';
// import OrbitControls from '/Users/jdh/Documents/codesmith/webpack-test/node_modules/three/examples/jsm/controls/';

class Visualizer extends Component {
  componentDidMount() {
    console.log('attempting 3js');
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);
    this.mount.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 5;

    // const controls = new OrbitControls(this.camera, this.renderer.domElement);

    const cubes = [
      {
        position: [0, 0, 0],
        color: 0x00ff00,
      },
      {
        position: [1, 1, 1],
        color: 0x0000ff,
      },
      {
        position: [-1, -1, -1],
        color: 0xff0000,
      },
    ];
    for (let cube of cubes) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      let material = new THREE.MeshBasicMaterial({ color: cube.color });
      const newCube = new THREE.Mesh(geometry, material);
      newCube.position.set(...cube.position);
      this.scene.add(newCube);
    }
    // add axes - label them somehow?
    const helper = new THREE.AxesHelper(10);
    this.scene.add(helper);

    let origin = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(origin);

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        style={{ width: '800px', height: '600px' }}
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Visualizer;
