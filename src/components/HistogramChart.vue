
<template>
  <div class="histogram-chart"/>
</template>

<script lang="ts" type = "text/typescript">

import { LineChart } from "../histogram_chart";

export default {
  name: 'HistogramChart',
  mounted () {
      let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myChart');
      let ctx : CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
      if (canvas && ctx) {
        let lineChart: LineChart = new LineChart(canvas, ctx);
        lineChart.addingLineChart();
      }
  } 
}

</script>

 
