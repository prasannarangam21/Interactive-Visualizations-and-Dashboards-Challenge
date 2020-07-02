function buildPlot(sample){
    d3.json("/data/samples.json").then((data) => {
        samples = data.samples;
        var results = samples.filter(x => x.id === sample);
        var result = results[0];
        var sample_values = result.sample_values;
        var otu_ids = result.otu_ids;
        console.log(otu_ids);
        var otu_labels = result.otu_labels;
        
        var trace = [{
        type: "bar",
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
        orientation : 'h',
        text: otu_labels.slice(0,10).reverse()
        }];

        var layout = {
            title: "Top 10 OTUs"
        };

        Plotly.newPlot("bar", trace, layout);

        //bubble code
        var trace1 = [{
            type: "bubble",
            y: sample_values.slice(0,10).reverse(),
            x: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            mode: 'markers',
            marker : {
                size: sample_values.slice(0,10).reverse(),
                color: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse()
            }
            
            
        }];

        var layout = {
            title: "Belly Button Bacteria Bubble Chart"
        };

        Plotly.newPlot("bubble", trace1, layout);
    });  

}
function buildMetadata(newValue){
    d3.json("/data/samples.json").then((data) => {
        var metadata = d3.select("#sample-metadata");

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

    });
}    

function optionChanged(newValue) {
    buildPlot(newValue);
    buildMetadata(newValue);
}
init();