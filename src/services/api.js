"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var api = axios_1.default.create({
    baseURL: "https://api.exemplo.com", // Mude para sua API
    timeout: 5000,
});
exports.default = api;
