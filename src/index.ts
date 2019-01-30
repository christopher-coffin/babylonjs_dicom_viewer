import Vue from "vue";
import BabylonWorld from "./components/BabylonWorld.vue";
import HistogramChart from "./components/HistogramChart.vue";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <babylon-world/>
        <histogram-chart/>
    </div>
    `,
    data: { },
    components: {
        BabylonWorld,
        HistogramChart
    }
});
