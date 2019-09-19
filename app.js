function optionChanged(id){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata.filter(function(metadata){
            return metadata.id == id;
        })[0];
        var samples = data.samples.filter(function(samples){
            return samples.id == id;
        })[0];

        // Update the sample-metadata
        var samplePanel = d3.select("#sample-metadata"); 
        samplePanel.html("");
        Object.entries(metadata).forEach(([key, value]) => {
            samplePanel.append("p").text(`${key} : ${value}`)
        });
                
        // * Use `sample_values` as the values for the bar chart.
        var sampleValues = samples.sample_values; 
        // * Use `otu_ids` as the labels for the bar chart.
        var otuIds = samples.otu_ids;
        //* Use `otu_labels` as the hovertext for the chart.
        var otuLabels = samples.otu_labels;
        
        var trace1 = {
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).map(function(e){return "OTU " + e.toString()}).reverse(),
            hovertext: otuLabels.slice(0,10).reverse(),
            orientation: "h",
            hoverinfo: "text",
            type: "bar"
          };
          
        var bardata = [trace1];
          
        Plotly.newPlot("bar", bardata);

        var trace2 = {
            // * Use `otu_ids` for the x values.
            x: otuIds,
            // * Use `sample_values` for the y values.
            y: sampleValues,
            // * Use `sample_values` for the marker size.
            // * Use `otu_ids` for the marker colors.
            mode: "markers",
            marker:{
              size: sampleValues,
              color: otuIds
            },
            // * Use `otu_labels` for the text values.
            text: otuLabels
            };

        bubbleData = [trace2];

        var bubbleLayout = {
              xaxis:{title: "OTU ID"}
            };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      
        

    });
};

function init(){
    var dropDown = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
        var firstId = data.names[0];
        // Populate the dropdown with subjectIDs
        data.names.forEach((id) => {
            dropDown
                .append("option")
                .text(id)
                .property("value",id);
        });

        // Refresh page with data from firstId
        optionChanged(firstId);
    });
};  

init();