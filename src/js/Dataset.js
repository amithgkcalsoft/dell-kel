import { Config } from '../js/config';

export function Dataset() {

   let config = Config();
   
    // Dataset.dataset = datasets[7];
    let dataset = {
        category: "hpcc",
        date: "17 Feb 2020",
        description: "",
        formatType: "json",
        group: "sample",
        id: "influxdb17Feb_2020_withoutJobLoad",
        name: "HPC data - 17 Feb 2020 (with job data)",
        url: "./data/influxdb17Feb_2020_withoutJobLoad.json",
    };
    let currentDataset = undefined;  // dataset before update
    let stats = {};
    let type = undefined;

    let typeOrder = {
      nominal: 0,
      ordinal: 0,
      geographic: 2,
      temporal: 3,
      quantitative: 4
    };

    let fieldOrderBy = {};

    fieldOrderBy.type = function(fieldDef) {
      if (fieldDef.aggregate==='count') return 4;
      return typeOrder[fieldDef.type];
    };

    fieldOrderBy.typeThenName = function(fieldDef) {
      return Dataset.fieldOrderBy.type(fieldDef) + '_' +
        (fieldDef.aggregate === 'count' ? '~' : fieldDef.field.toLowerCase());
        // ~ is the last character in ASCII
    };

    fieldOrderBy.original = function() {
      return 0; // no swap will occur
    };

    fieldOrderBy.field = function(fieldDef) {
      return fieldDef.field;
    };

    let fieldOrder = fieldOrderBy.typeThenName;

    // update the schema and stats
    let onUpdate = [];
    let onUpdateFinish = [];

    let update = function(dataset) {
      debugger;
      var updatePromise;

      if (dataset.values) {
        updatePromise = $q(function(resolve, reject) {
          // jshint unused:false
          type = undefined;
          console.log(dataset);
          console.log("dataset.values");
          updateFromData(dataset, dataset.values);
          resolve();
        });
      } else {
        updatePromise = new Promise(function(resolve, reject){
            resolve(updateFromData(dataset, []));
        }).then();
      }

      onUpdate.forEach(function(listener) {
        updatePromise = updatePromise.then(listener);
      });

      // Copy the dataset into the config service once it is ready
        updatePromise = updatePromise.then(function() {
          config.updateDataset(dataset, Dataset.type);
      });
debugger;
      onUpdateFinish.forEach(function(listener) {
            updatePromise = updatePromise.then(listener);
      });

      return updatePromise;
    };


    function updateFromData(dataset, data) {
      Dataset.data = data;
      Dataset.currentDataset = dataset;

      // TODO: find all reference of Dataset.stats.sample and replace
    }

    let add = function(dataset) {
      debugger;
      if (!dataset.id) {
        dataset.id = dataset.url;
      }
      datasets.push(dataset);

      return dataset;
    };

    let Dataset = {
      dataset,
      currentDataset,
      stats,
      type,
      fieldOrderBy,
      add,
      fieldOrder,
      onUpdate,
      onUpdateFinish,
      update
    };
 
    return Dataset;

}