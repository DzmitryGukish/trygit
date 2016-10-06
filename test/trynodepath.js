var express = require('express');


// console.log(JSON.stringify(process.env));
for(entity in process) {
  // console.log(JSON.stringify(entity), typeof entity);
  // if ((typeof entity === String) || (typeof entity === Array) || (typeof entity === Object) || (typeof entity === Number)) {
    console.log(JSON.stringify(entity) + " : { " + JSON.stringify(process[entity]) + " }");
  // }
}
