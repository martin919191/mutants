#!/usr/bin/env node
const Mutants = require('./../lib/mutants');

/* REPLACE BELOW CODE TO LOAD CONFIG FILE*/
const host = 'localhost';
const port = '8080'

Mutants(host, port);