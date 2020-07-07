function buildMetadata(sample){
    // Using `d3.json` to fetch the metadata for a sample
    d3.json("/data/samples.json").then((data) => {
        console.log(data);
        //filtering the metadata for one or more results
        var metadata = data.metadata;
        var results = metadata.filter(d => d.id == sample);
        //Assigning the first value if multiple values found
        var result = results[0];
        // Using d3 to select the panel with id of `#sample-metadata`
        var panel = d3.select("#sample-metadata");
        // Using `.html("") to clear any existing metadata
        panel.html("");
        // Using `Object.entries` to add each key and value pair to the panel
        // Using d3 to append new tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}:${value}`);
        });    
    });
}    


function buildPlot(sample){
    console.log(sample);
    // Use `d3.json` to fetch the sample data for the plots
    d3.json("/data/samples.json").then((data) => {
        samples = data.samples;
        // filtering the samples
        var results = samples.filter(x => x.id === sample);
        // assgning the first value to result
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


function init(){
    // Grab a reference to the dropdown select element
    var dropdownMenu = d3.select("#selDataset");
     // Use the list of sample names to populate the select options
    d3.json("/data/samples.json").then((data) => {
        var name = data.names;
        name.forEach((sample)=> {
            dropdownMenu
            .append("option")
            .text(sample)
            .property("value",sample);

        });
        // Use the first sample from the list to build the initial plots
        buildPlot(name[0]);
        buildMetadata(name[0]);

    });
}    

function optionChanged(newValue) {
     // Fetch new data each time a new sample is selected
    buildPlot(newValue);
    buildMetadata(newValue);
}
// Initialize the dashboard
init();