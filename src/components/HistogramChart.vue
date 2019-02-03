
<template>
  <div class="histogram-chart"/>
</template>

<script lang="ts" type = "text/typescript">

import { LineChart } from "../histogram_chart";

let LINE_CHART : LineChart | undefined;

export default {
  name: 'HistogramChart',
  mounted () {
      let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myChart');
      let ctx : CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
      if (canvas && ctx) {
        LINE_CHART = new LineChart(canvas, ctx);
      }
  },
  computed: {
    count: function () : number[] {
      return this.$store.state.histArray.length;
    }
  },
  watch: {
    count (newCount : number[], oldCount : number[]) {
      console.log("count", newCount);
      if (LINE_CHART)
        LINE_CHART.setData(this.$store.state.histArray);
    }
  }
}

</script>

 
