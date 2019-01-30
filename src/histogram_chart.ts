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

let addingLineChart = function () {
    let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myChart');
    if (!canvas)
        return
    let ctx : CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
    var chart = new chartjs.Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        },
    
        // Configuration options go here
        options: {}
    });    
}


export class Startup {
    public static main(js_scope: any): number {
        addingLineChart();
        return 0;
    }
}
