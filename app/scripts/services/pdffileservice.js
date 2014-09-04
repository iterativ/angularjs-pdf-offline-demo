'use strict';

angular.module('pdfofflineApp').factory('PdfFileService', function PdfFileService($q, $http, $localForage) {

    var getOnlinePdfFileNames = function() {
        return $http.get('/listpdf.json').then(function(response) {
            var pdfFileList = response.data.files;

            // store the fetched pdf list locally so that we can access the list, when we are offline
            return $localForage.setItem('listpdf', JSON.stringify(pdfFileList)).then(function() {
                return pdfFileList;
            });

        }, function() {
            // the error indicates that we are offline -> get the locally stored list
            console.log("catch from /listpdf failed, get it locally");
            return $localForage.getItem('listpdf').then(function(item) {
                return JSON.parse(item);
            });
        });
    };

    var getLocallyStoredPdfFileNames = function() {
        return $localForage.getKeys();
    };

    var listPdfFiles = function() {
        return $q.all([
            getOnlinePdfFileNames(),
            getLocallyStoredPdfFileNames()
        ]).then(function(values) {
            var onlineFileNames = values[0];
            var localFileNames = values[1];

            var createPdfFileEntryObject = function(pdfFilename) {
                var result = {
                    filename: pdfFilename,
                    webURL: '/pdf/' + pdfFilename,
                    localURL: null,
                    offline: false
                };

                if(_.contains(localFileNames, pdfFilename)) {
                    return $localForage.getItem(pdfFilename).then(function(pdfData) {

                        // We have to explicitly set the type pdf here again. Otherwise the file is opened as clear text
                        var pdfBlob = new Blob([pdfData], {type: 'application/pdf'});
                        result.localURL = URL.createObjectURL(pdfBlob);
                        result.offline = true;
                        return result;
                    });
                }
                else {
                    return $q.when(result);
                }
            };

            var resultPromises = _.map(onlineFileNames, createPdfFileEntryObject);

            return $q.all(resultPromises);
        });
    };

    var downloadOfflinePdf = function(file) {
        return $http.get(file.webURL, {responseType:'blob'}).then(function (response) {
            // store the pdf data for offline use
            return $localForage.setItem(file.filename, response.data).then(function() {
                var pdfBlob = response.data;
                file.localURL = URL.createObjectURL(pdfBlob);
                file.offline = true;
                return file.localURL;
            });
        });
    };

    var deleteLocal = function(file) {
        return $localForage.removeItem(file.filename).then(function() {
            URL.revokeObjectURL(file.localURL);
            file.localURL = null;
            file.offline = false;
            return file;
        });
    };

    return {
        listPdfFiles: listPdfFiles,
        downloadOfflinePdf: downloadOfflinePdf,
        deleteLocal: deleteLocal
    };
});
