import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import BabylonWorld from "./components/BabylonWorld.vue";

const store = new Vuex.Store({
    state: {
        count: 0,
        histArray: [],
    },
    mutations: {
        increment (state) {
            state.count++
        },
        setArray (state, newArray) {
            state.histArray = newArray;
        }
    }
});

store.commit('increment')
  
let v = new Vue({
    el: "#app",
    store,
    template: `
    <div>
        <babylon-world/>
    </div>
    `,
    data: { },
    components: {
        BabylonWorld,
    }
});
