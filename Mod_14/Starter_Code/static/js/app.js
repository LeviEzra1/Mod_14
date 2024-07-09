// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    function selectID(object) {
      return object.id == sample;
    };
    let object = metadata.filter(selectID)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(object)) {
      panel.append('p').text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    function selectID(object) {
      return object.id == sample;
    }
    let object = samples.filter(selectID)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = object.otu_ids;
    let otu_labels = object.otu_labels;
    let sample_values = object.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      mode: "markers",
      x: otu_ids,
      y: sample_values,
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    }];

    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: {text: 'OTU ID'}},
      yaxis: {title: {text: 'Number of Bacteria'}}
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    otu_ids = otu_ids.map(id => `OTU ${id} `);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    otu_ids = otu_ids.slice(0,10).reverse();
    sample_values= sample_values.slice(0,10).reverse();
    otu_labels = otu_labels.slice(0,10).reverse();

    let barData = [{
      type: 'bar',
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      orientation: 'h'
    }];

    let barLayout = {
      title: 'Top Ten Bacteria Cultures Found',
      xaxis: {title: {text: 'Number of Bacteria'}},
      height: 500
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let name of names) {
      dropdown.append('option').attr('value', name).text(name);

    };

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
