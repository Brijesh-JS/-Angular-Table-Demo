
var app = angular.module('myApp', ['ui.bootstrap'])
 .filter('startFrom', function () {
            return function (input, start) {
                start = +start; //parse to int
                if (input)
                    return input.slice(start);
            }
        });
app.controller('myCtrl', ['$scope','$timeout','$filter','$http', function($scope,$timeout,$filter,$http) {
    
  //Menu list  
  $scope.menuList = ["Immunisation Alerts","Lab Alerts","DI Alerts","Prodedure Alerts",
                            "RX Specific Alerts","DX Specific Alerts", "Patient Specific Alerts"];
  
  //Function call after data loaded from json file  
  $scope.dispayRecords = function() {
      $scope.totalRecord = $scope.reportInfo.length;
      $scope.idIndex = $scope.reportInfo[$scope.reportInfo.length - 1].id + 1;
    
    //Pagination functionality code 
      $scope.curPage = 1;
      $scope.itemsPerPage = 5;
      $scope.maxSize = 5;
    
      $scope.changeInput = function(test) {
        console.log(test);
      }
      
       $scope.numOfPages = function () {
           return Math.ceil($scope.reportInfo.length / $scope.itemsPerPage);
          
      };
        
      $scope.$watch('curPage + numPerPage', function() {
        var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
        end = begin + $scope.itemsPerPage;
        var tmpInfo = $filter("filter")($scope.reportInfo, $scope.search);
        $scope.filteredItems = tmpInfo.slice(begin, end);
      });
      
    //Selection functionality code
      $scope.options = [];
          
      $scope.selectAll = false;

      $scope.toggleInfoTr = function(selectedId) {

        var tmpObj = $filter('filter')($scope.reportInfo, {id: selectedId}, true)[0];

        if (tmpObj != undefined) {
          tmpObj.checked = !tmpObj.checked;
        }

        if (!tmpObj.checked) {
           $scope.selectAll = false;
        }

       };

      $scope.toggleAll = function() {
        var checked = $scope.selectAll;
        for (var i = 0; i < $scope.reportInfo.length; i++) {
          $scope.options[$scope.reportInfo[i].id] = checked;
          $scope.reportInfo[i].checked = checked;
        }
      };
      
    //Delete records functionality code
      $scope.deleteItem = function() {
         var listToDelete = [];
        for (var i=0;i<$scope.reportInfo.length;i++) {
            if ($scope.reportInfo[i].checked == true) {
                listToDelete.push($scope.reportInfo[i].id);
            }
        }
        var  newArray = $scope.reportInfo.filter(function(obj) {
              return listToDelete.indexOf(obj.id) == -1;
        });
        
        $scope.filteredItems = newArray; 
        $scope.reportInfo = newArray;  

        var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
        end = begin + $scope.itemsPerPage;
        
        $scope.filteredItems = $scope.reportInfo.slice(begin, end);
        $scope.totalRecord = $scope.reportInfo.length;
        $timeout(function () {
              $scope.$apply()
           }, 10);
      }
      
    //Add records functionality code
      $scope.addRecord = function(newName, newDec, newWeb) {
        $scope.isError = false;
        if (newName != "" && newName != undefined && newDec != "" && newDec != undefined && newWeb != undefined && newWeb != "") {
            var tmpObj = {
              "id": $scope.idIndex,
              "name": newName,
              "description": newDec,
              "webReference": newWeb
            };

            $scope.reportInfo.push(tmpObj);
            $scope.idIndex++;

            $scope.filteredItems = $scope.reportInfo; 
            
            var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;
              
            $scope.filteredItems = $scope.reportInfo.slice(begin, end);
            $scope.totalRecord = $scope.reportInfo.length;

            $scope.newName = "";
            $scope.newDec = "";
            $scope.newWeb = "";
        }  else {
          $scope.isError = true;
          $scope.nameError = "";
          $scope.decError = "";
          $scope.webError = "";

          if (newName == "" || newName == undefined) {
             $scope.nameError = "Name must required";
          }
          if (newDec == "" || newDec == undefined) {
             $scope.decError = "Description must required";
          }
          if (newWeb == "" || newWeb == undefined) {
             $scope.webError = "Web Reference must required";
          }
        } 
          

        $timeout(function () {
            $scope.$apply()
         }, 0);

      }
      
      //Display selected menu
      $scope.selMenu = "Immunisation Alerts";
      $scope.changeMenu = function(selMenu) {
        console.log(selMenu);
        $scope.selMenu = selMenu;
      }

    
      //Sort Functionality
       $scope.column = 'sno';
       $scope.reverse = false; 
       
       $scope.sortColumn = function(col) {
        $scope.column = col;
        if($scope.reverse){
         $scope.reverse = false;
         $scope.reverseclass = 'arrow-up';
        }else{
         $scope.reverse = true;
         $scope.reverseclass = 'arrow-down';
        }
       };
       
       $scope.sortClass = function(col) {
        if($scope.column == col ){
         if($scope.reverse){
          return 'arrow-down'; 
         }else{
          return 'arrow-up';
         }
        }else{
         return '';
        }  
      }
       
      //For apply changes to render in view
       $timeout(function () {
          $scope.$apply()
       }, 0);
    }

    $http.get('demo.json').then(function(response) {
       $scope.reportInfo = response.data;
       console.log(response.data)
       $scope.dispayRecords();
    });

 
}]);

//Active-Inactive menu selection
function myFunction(e) {
  var elems = document.querySelectorAll(".active");
  [].forEach.call(elems, function(el) {
    el.classList.remove("active");
  });
  e.target.className = "active";
}