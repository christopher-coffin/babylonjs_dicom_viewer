import * as chartjs from 'chart.js';

let addingChart = function () {
    let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myChart');
    if (!canvas)
        return
    let ctx : CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
    new chartjs.Chart(canvas, {
        type: 'bar',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [2478,5267,734,784,433]
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
    });
}


export class LineChart {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    chart: Chart;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.chart = new chartjs.Chart(this.ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: Array(256).fill(''),
                datasets: [{
                    label: "Intesity histogram",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                }]
            },
        
            // Configuration options go here
            options: {}
        });
    }

    public setData(data: number[]){
        if (this.chart && this.chart.data.datasets && this.chart.data.datasets.length > 0) {
            this.chart.data.datasets[0].data = data;
            this.chart.update();
        }
    }
}
