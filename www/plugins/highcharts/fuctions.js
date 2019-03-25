$(document).ready(function(){
    Highcharts.SparkLine = function (options, callback) {
        var defaultOptions = {
            chart: {
                renderTo: (options.chart && options.chart.renderTo) || this,
                backgroundColor: null,
                borderWidth: 0,
                type: 'area',
                margin: [2, 0, 2, 0],
                style: {
                    overflow: 'visible'
                },
                skipClone: true
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            exporting:{
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                startOnTick: false,
                endOnTick: false,
                tickPositions: []
            },
            yAxis: {
                endOnTick: false,
                startOnTick: false,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickPositions: [0]
            },
            legend: {
                enabled: false
            },
            tooltip: {
                shared: true
            }
        };
        options = Highcharts.merge(defaultOptions, options);

        return new Highcharts.Chart(options, callback);
    };

    Highcharts.setOptions({
        lang: {
            loading: 'Aguarde...',
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            exportButtonTitle: "Exportar",
            printButtonTitle: "Imprimir",
            rangeSelectorFrom: "De",
            rangeSelectorTo: "Até",
            rangeSelectorZoom: "Período",
            contextButtonTitle: 'Exportar',
            printChart: 'Imprimir gráfico',
            downloadPNG: 'Imagem PNG',
            downloadJPEG: 'Imagem JPEG',
            downloadSVG: 'Imagem SVG',
            downloadPDF: 'Documento PDF',
            resetZoom: "",
            resetZoomTitle: "",
            thousandsSep: ".",
            decimalPoint: ','
        },
        tooltip: {
            valueDecimals: 2
        },
        legend: {
            itemStyle: {
                fontWeight: 'inherit'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    style: {fontWeight: 'normal'}
                }
            }
        }
    });
});