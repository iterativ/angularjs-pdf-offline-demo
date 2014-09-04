# PDF Offline demo application

This repository holds the source code for the PDF-Offline demo application hosted on:

[http://pdfoffline.iterativ.ch/](http://pdfoffline.iterativ.ch/)


## How to run

This application uses the python flask server as a backend. In the frontend the AngularJS library is used.
You need to execute the following steps to make the sample application work on your machine:

1. Install the needed python libraries:
    
    > pip install -r env/dev/dev.pip
    
2. Install the grunt and bower dependencies:

    > npm install
    > bower install
    
3. Run the local flask server:

    > grunt serve
