var express = require('express');

for (entity in process) {
  console.log(
    JSON.stringify(entity) +
    ' : { ' +
    JSON.stringify(process[entity]) + ' }');
}
