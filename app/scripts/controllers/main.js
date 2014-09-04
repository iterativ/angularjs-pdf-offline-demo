'use strict';

angular.module('pdfofflineApp')
    .controller('MainCtrl', function ($scope, PdfFileService) {
        $scope.pdfFiles = [];

        var fetchPdfFiles = function() {
            PdfFileService.listPdfFiles().then(function(response) {
                console.log(response);
                $scope.pdfFiles = angular.copy(response);
            });
        };

        $scope.pdfDownload = function(file) {
            PdfFileService.downloadOfflinePdf(file).then(function(localFileURL) {
                console.log(localFileURL);
                file.localURL = localFileURL;
            });
        };

        $scope.deleteLocal = function(file) {
            file.localURL = null;
            PdfFileService.deleteLocal(file);
        };

        fetchPdfFiles();

        $scope.test = fetchPdfFiles;
    });
