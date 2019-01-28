import Vue from "vue";
import BabylonWorld from "./components/BabylonWorld.vue";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        <babylon-world/>
        </div>
    `,
    data: { },
    components: {
        BabylonWorld
    }
});
