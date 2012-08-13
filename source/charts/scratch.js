// Map data to a usable format
var mapData = function(d) {
    var result = [];
    for (var i in d) {
        if (d.hasOwnProperty(i)) {
            d[i] = d[i].sort();
            if (obj.time) {
                var x = new Date(i).getTime();
            } else {
                var x = i;
            }
            for (var z in d[i]) {
                result.push({
                    x: x,
                    y: d[i][z]
                });
            }   
        }
    }
    return result;
};

// Remove duplicates from array
var eliminateDuplicates = function(arr) {
    var i,
        len = arr.length,
        noDupe = [],
        dupe = [],
        sorted_arr = arr.sort();

    for (i = 0; i < len - 1; i++) {
        if ((sorted_arr[i + 1].y !== sorted_arr[i].y) || (sorted_arr[i + 1].x !== sorted_arr[i].x)) {
            noDupe.push(arr[i]);
        }
    }
    noDupe.push(arr[len-1]);
    // dupe = arr.filter(function(i) {
    //     return !(noDupe.indexOf(i) > -1);
    // });
    for(var i=0;i<len;i++) { 
        if(!(noDupe.indexOf(arr[i]) > -1)) { 
            dupe.push(arr[i]); 
        }
    }
    return { noDupe: noDupe, dupe: dupe };
};

console.log(obj.data); console.log(mapData(obj.data));
var processedData = eliminateDuplicates(mapData(obj.data));
console.log('processedData:', processedData);
data = processedData.noDupe;
dataOverlap = processedData.dupe;