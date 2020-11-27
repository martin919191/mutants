# Mutant Detector
Application to help Magneto find new mutants based on DNA sequence. Each DNA Sequence is represented in a string array like the example below:

`var dna = ["CTGCCA", "CAGTGC", "TTATGT", "AGAAGG", "CTCCTA", "TCACTG"];`

The array can be also interpreted as a char matrix. There are only four possible chars, A, T, G and C (each one represnt a nitrgenous base). Mutant DNAs have more than one sequence of 4 identical chars, as shown in the image below:

Mutant:

![Mutant DNA](/images/mutant.png)

Human:

![Human DNA](/images/human.png)



## Application Components
* HTTPServer
* MutantDetector
* Database

### Component communication
![Component Communication](/images/componentCommunication.png)

### HTTPServer
Provides an API to run tests against the MutantDetector. This is the only starting point to any client. There are two available endpoints:

|Method|URL|Description|
|------|---|-----------|
|POST|/mutant|Scan a DNA sequence passed in the body of the request. A 200-OK response means the DNA is mutant, 403-Forbidden means it's human.|
|GET|/stats|Get scan statistics.| 

Default port is 3001, but it can be changed by setting environment variable `PORT` or `HTTP_PORT` with the new desired port.

### MutantDetector
This component contains the logic to detect whether a DNA is mutant or not. 
A function `isMutant(dna)` is implemented inside the module and returns `true` when the passed DNA is mutant and `false` when it's human.

### Database
This module is intended to provide a seamless interatction between the HTTPServer and a database. This module is implemented to work with two database engines:

* **SQLite3** - For local and development use. This is the default engine.
* **BigQuery** - To use in an environment suitable to handle many API calls in a short period of time.

## How to run the application
To run the application in local mode (with a local SQLite DB), simply run the following commands:

```
git clone https://github.com/martin919191/mutants.git
cd mutants
npm install
npm start
```

To run the application using BigQuery engine instead, run the following commands:

```
git clone https://github.com/martin919191/mutants.git
cd mutants
npm install
export DBTYPE=BIGQUERY
npm start
```
To run with BigQuery engine, it is required to be in a Google Cloud environment, and to set up a dataset named `mutant_data`.

To test a local instante, run the following commands (change the port in URL in case it was changed before running the application):

```
# Get application stats
curl -X GET https://localhost:3001/stats 

# Test application with a mutant DNA
curl -X POST \
    -d '{"dna": ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CTCCTA","TCACTG"]}' \
    -H 'Content-Type: application/json' \
    https://localhost:3001/mutant
    
# Test application with a human DNA
curl -X POST \
    -d '{"dna": ["CTGCCA", "CAGTGC", "TTATGT", "AGAAGG", "CTCCTA", "TCACTG"]}' \
    -H 'Content-Type: application/json' \
    https://localhost:3001/mutant
```

### Deploy application to Google AppEngine
This application is ready to be deployed to an AppEngine environment. To do that, run the following command (Google Cloud CLI must be configured in the environment):

`gcloud app deploy`

## Live instance
An instance of the application is already deployed and is accessible on the following URL: [https://project-mutants.uc.r.appspot.com/](https://project-mutants.uc.r.appspot.com/)

Run the following commands to interact with the deployed application:

```
# Get application stats
curl -X GET https://project-mutants.uc.r.appspot.com/stats 

# Test application with a mutant DNA
curl -X POST \
    -d '{"dna": ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CTCCTA","TCACTG"]}' \
    -H 'Content-Type: application/json' \
    https://project-mutants.uc.r.appspot.com/mutant
    
# Test application with a human DNA
curl -X POST \
    -d '{"dna": ["CTGCCA", "CAGTGC", "TTATGT", "AGAAGG", "CTCCTA", "TCACTG"]}' \
    -H 'Content-Type: application/json' \
    https://project-mutants.uc.r.appspot.com/mutant
```

