global.self = global;
global.window = {};
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const {makeServer} = require("./src/mocks/server");
makeServer({environment: "development"});
