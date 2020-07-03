
function buildPlot(sample){
    // Use `d3.json` to fetch the sample data for the plots
    d3.json("/data/samples.json").then((data) => {
        samples = data.samples;
        var results = samples.filter(x => x.id === sample);
        var result = results[0];
        var sample_values = result.sample_values;
        var otu_ids = result.otu_ids;
        //console.log(otu_ids);
        var otu_labels = result.otu_labels;
        
        //Build a Bar Chart using the sample data
        var barData = [{
        type: "bar",
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
        orientation : 'h',
        text: otu_labels.slice(0,10).reverse()
        }];

        var barLayout = {
            title: "Top 10 OTUs"
        };

        Plotly.newPlot("bar", barData, barLayout);

        //Build a Bubble Chart using the sample data
        var bubbleData = [{
            type: 'scatter',
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: 'markers',
            marker : {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
             
        }];

        var bubbleLayout = {
            margin: {t:30},
            xaxis: {title:"OTU ID"},
            yaxis: {title:"Sample Values"},
            title: "Belly Button Bacteria Bubble Chart"
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });  
        
 
}
function buildMetadata(sample){
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json("/data/samples.json").then((data) => {
        
        var metadata = data.metadata;
        var results = metadata.filter(d => d.id == sample);
        var result = results[0];
        var boxData = d3.select("#sample-metadata");
        boxData.html("");
        Object.entries(result).forEach(([key, value]) => {
            boxData.append("h6").text(`${key}:${value}`);
        });    
    });
}    

function init(){
    var dropdownMenu = d3.select("#selDataset");
    d3.json("/data/samples.json").then((data) => {
        var name = data.names;
        name.forEach((sample)=> {
            dropdownMenu
            .append("option")
            .text(sample)
            .property("value",sample);

        });

        buildPlot(name[0]);
        buildMetadata(name[0]);

    });
}    

function optionChanged(newValue) {
    buildPlot(newValue);
    buildMetadata(newValue);
}
init();