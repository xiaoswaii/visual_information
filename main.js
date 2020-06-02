let wholeData;
let sourceData = [];
let rawData = [];
let dateData = [];
let choosenMonth = 1;
let choosenType = 1;
let choosenEffect = false;
//1. daily added case
//2. daily death case
//3. total case
//4. total death case
let choosenTypeWord = '';
let chartType = 'column';
//1. column
//2. line
let dict = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May'}
getData();
async function getData(obj) {
    console.log(obj)
    let result;
    try {
      result = await $.ajax({
          url: './response.json',
          type: 'GET',
          success: function(e){
            wholeData = e.timelineitems[0];
            console.log(wholeData)
            classifyData(wholeData,choosenMonth,choosenType,chartType,choosenEffect);
          }
      });
    } 
    catch (error) {
     if(error.status === 400){
        alert('資料壞了！');
      } 
    }
}

function classifyData(wholeData,choosenMonth,choosenType,chartType,choosenEffect) {
    console.log(chartType)
    dateData = [];
    sourceData = [];
    rawData = [];
    for (let key in wholeData) {
        if(key[0] == choosenMonth){
            dateData.push(key.substr(2,2))
            rawData.push(wholeData[key])
        }
    }
    if(choosenType == 1){
        choosenTypeWord = 'New Daily Case';
        for(var i = 0 ; i < rawData.length ; i ++) {
            sourceData.push(rawData[i].new_daily_cases)
        }
        console.log(sourceData)
    }
    else if(choosenType == 2){
        choosenTypeWord = 'New Daily Death';
        for(var i = 0 ; i < rawData.length ; i ++) {
            sourceData.push(rawData[i].new_daily_deaths)
        }
        console.log(sourceData)
    }
    else if(choosenType == 3){
        choosenTypeWord = 'Total Case';
        for(var i = 0 ; i < rawData.length ; i ++) {
            sourceData.push(rawData[i].total_cases)
        }
        console.log(sourceData)
    }
    else if(choosenType == 4){
        choosenTypeWord = 'Total Death';
        for(var i = 0 ; i < rawData.length ; i ++) {
            sourceData.push(rawData[i].total_deaths)
        }
        console.log(sourceData)
    }

    Highcharts.chart('container', {
        chart: {
            type: chartType, 
            options3d: {
                enabled: choosenEffect,
                alpha: 15,
                beta: 15,
                depth: 50
            }
        },
        title: {
            text: `Covid-19 in Malaysia:${choosenTypeWord} of ${dict[choosenMonth]}`
        },
        subtitle: {
            text: 'Source: '
        },
        xAxis: {
            categories: dateData,
            crosshair: true,
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Amount'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: choosenTypeWord,
            data: sourceData
    
        }]
    });
}

$( "#selectedMonth" ).change(function() {
    choosenMonth =  $( "#selectedMonth" ).val();
    classifyData(wholeData,choosenMonth,choosenType,chartType,choosenEffect);
});

$( "#selectedType" ).change(function() {
    choosenType =  $( "#selectedType" ).val();
    classifyData(wholeData,choosenMonth,choosenType,chartType,choosenEffect);
});

$( "#selectedChartType" ).change(function() {
    chartType =  $( "#selectedChartType" ).val();
    classifyData(wholeData,choosenMonth,choosenType,chartType,choosenEffect);
});

$( "#selectedEffect" ).change(function() {
    let temp =  $( "#selectedEffect" ).val();
    if(temp == 1) {
        choosenEffect = true;
    }
    else {
        choosenEffect = false;
    }
    classifyData(wholeData,choosenMonth,choosenType,chartType,choosenEffect);
});
