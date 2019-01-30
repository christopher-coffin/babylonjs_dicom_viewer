
<template>
  <div class="histogram-chart"/>
</template>

<script type = "text/typescript">

import { Startup } from "../histogram_chart.ts";

export default {
  name: 'HistogramChart',
  mounted () {
      Startup.main();
  } 
}

</script>

 
