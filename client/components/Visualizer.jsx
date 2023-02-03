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
    this.camera.position.x = 15;
    this.camera.position.y = 15;
    this.camera.position.z = 15;

    // const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // add axes - label them somehow?
    const helper = new THREE.AxesHelper(10);
    this.scene.add(helper);

    this.origin = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(this.origin);

    this.renderer.render(this.scene, this.camera);
  }

  componentDidUpdate() {
    if (this.props.visData.length) {
      const cubes = this.props.visData;
      console.log('from vis: ', JSON.stringify(cubes));

      for (let cube of cubes) {
        console.log(...cube.answers);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const newCube = new THREE.Mesh(geometry, material);
        console.log(newCube);
        newCube.position.set(...cube.answers);
        this.scene.add(newCube);
      }
      this.renderer.render(this.scene, this.camera);

      this.elapsed = 0;
      this.animate();
    }
  }

  animate = () => {
    this.camera.position.x = 20 * Math.cos(this.elapsed);
    this.camera.position.z = 20 * Math.sin(this.elapsed);
    this.camera.position.y = 3 * Math.sin(Math.PI / 4 - this.elapsed);
    this.camera.lookAt(this.origin);
    this.elapsed += 0.01;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <div
        className='canvasDiv'
        style={{ width: '100%', height: '600px' }}
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Visualizer;
