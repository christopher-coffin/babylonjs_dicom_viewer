<template>
  <div class="babylon-container">
    <h3>{{ msg }}</h3>
    <div class="linewrapper">
      <table class="lineitem">
        <tr> 
          <td> Red Threshold </td> 
          <td> <input v-model="rThreshold" id= "slider_rThreshold" type="range" min="0" max="255" class="slider"> </td>
          <td> {{ rThreshold }} </td>

          <td> X Clip </td> 
          <td> <input v-model="xClip" id= "slider_xClip" type="range" min="-100" max="100" class="slider"> </td>
          <td> {{ xClip }} </td>

          <td> Enable Color </td> 
          <td> <input v-model="colorEnabled" id= "checkbox_colorEnabled" type="checkbox" min="-100" max="100"> </td>
        </tr>
        <tr> 
          <td> Green Threshold </td>
          <td> <input v-model="gThreshold" id= "slider_gThreshold" type="range" min="0" max="255" class="slider">  </td>
          <td> {{ gThreshold }} </td> 

          <td> Y Clip </td> 
          <td> <input v-model="yClip" id= "slider_yClip" type="range" min="-100" max="100" class="slider"> </td>
          <td> {{ yClip }} </td>

        </tr>
        <tr> 
          <td> Blue Threshold </td>
          <td> <input v-model="bThreshold" id= "slider_bThreshold" type="range" min="0" max="255" class="slider">  </td>
          <td> {{ bThreshold }} </td> 

          <td> Z Clip </td> 
          <td> <input v-model="zClip" id= "slider_zClip" type="range" min="-100" max="100" class="slider"> </td>
          <td> {{ zClip }} </td>
        </tr>
        <tr> 
          <td> White Min Threshold </td>
          <td> <input v-model="wMinThreshold" id= "slider_wMinThreshold" type="range" min="0" max="255" class="slider"> </td>
          <td> {{ wMinThreshold }} </td> 
        </tr>
        <tr> 
          <td> White Max Threshold </td>
          <td> <input v-model="wMaxThreshold" id= "slider_wMaxThreshold" type="range" min="0" max="255" class="slider"> </td>
          <td> {{ wMaxThreshold }} </td> 
        </tr>
      </table>
      <div class="lineitem">
        <canvas id="myChart"></canvas>
      </div>
    </div>
    <canvas id="renderCanvas" class="lineitem"></canvas>
    <histogram-chart></histogram-chart>
  </div>
</template>


<script type = "text/typescript">

import HistogramChart from "./HistogramChart.vue";

import { Startup } from "../babylon_main.ts";

export default {
  name: 'BabylonWorld',
  components: {
    'histogram-chart': HistogramChart,
  },
  props: {
    msg: String,
  }, 
  data: () => {
    return {
      fps: 49,
      xClip: 100,
      yClip: 100,
      zClip: 100,
      colorEnabled: false,
      rThreshold: 80.0,
      gThreshold: 160.0,
      bThreshold: 255.0,
      wMinThreshold: 0.0,
      wMaxThreshold: 255.0,
      mode: "debug",
    };
  },
  mounted() {
    Startup.main(this);
  },
  watch: {
    fps: function (event) {
      console.log('fps update', event);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.linewrapper {
   white-space: nowrap;
   overflow-x: auto
}

.lineitem {
  display: inline-block;
}

h3 {
  margin: 40px 0 0;
  font-weight: 100;
}
.slidecontainer {
  width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds [≈ Blink of an eye] transition on hover */
  transition: opacity .2s;
  display: inline-block;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */ 
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

html, body {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

#renderCanvas {
    width: 100%;
    height: 80%;
    touch-action: none;
}

</style>
