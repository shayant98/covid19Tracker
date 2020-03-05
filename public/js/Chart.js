 export default class DataChart {
    constructor(ctx, options) {
        this.chart = new Chart(ctx, options)
    }


    clearChart = () => {
        this.chart.data.datasets.splice(0, this.chart.data.datasets.length);
    };


    updateChart = (label, color, data) => {
        this.chart.data.datasets.push({
            label: label,
            borderColor: color,
            data: data,
        });

        this.chart.update();
    };

}