var jsonData;
// INITIAL FUNCTION 
init();
function init(name='940') {
    d3.json('samples.json').then(data => {
        jsonData = data;
        data.names.forEach(name => {
            d3.select("select").append('option').text(name);
        });

        var selected = d3.select("#selDataset").property("value");
        var pnl = d3.select('.panel-body');
        pnl.html('');
        var meta = data.metadata.filter(obj => obj.id == selected)[0];
        Object.entries(meta).forEach(([key,value]) => {
            pnl.append('h5').text(`${key.toUpperCase()}: ${value}`);
        });    
        data.samples.forEach(sample => {
                if (sample.id === selected ) {
                    // Bar chart
                var otu_ids= sample.otu_ids
                var values=sample.sample_values
                var text= sample.otu_labels
                var data =[{
                    x: values.slice(0,10).reverse(),
                    y: otu_ids.slice(0, 10).reverse().map(obj => `OTU ${obj}`),
                    type: "bar",
                    orientation: "h",
                    hoverinfo: "x+y"
                }]
                Plotly.newPlot("bar", data)
                // Bubble chart
                var trace={
                    x: otu_ids,
                    y: values,
                    text: text, 
                    mode: 'markers',
                    marker: {
                        color: otu_ids,
                        size: values,
                    }
                };
                var data1=[trace]
                var layout={
                    xaxis: {
                        title: "OTU ID"
                    }
                }
                Plotly.newPlot("bubble", data1)
                // Gauge chart              
                var frq = meta.wfreq;
                var data = [
                    {
                      domain: { x: [0, 1], y: [0, 1] },
                      value: frq,
                      type: "indicator",
                      mode: "gauge+number",
                      delta: { reference: 400 },
                      gauge: { axis: { range: [null, 9] } }
                    }
                  ];
                  var layout = { width: 600, height: 400 , title: {text: "<b> Belly Button Washing Frequency </b> <br> Scrubs per Week"}};
                  Plotly.newPlot('gauge', data, layout);      
            }
            });
    });
}
// ON CHANGE OF FILTER SELECTS NEW VALUE
d3.select("#selDataset").on("change", update);

// FUNCTION TO UPDATE BAR PLOT AND DATA ON CHANGE OF FILTER
function update() {
    d3.event.preventDefault();
    init()
    };

