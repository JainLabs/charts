/* HTML CODE:
<select id="chart_selector">
  <option value="line">line</option>
  <option value="grouped_line">grouped line</option>
  <option value="gauge">gauge</option>
  <option value="donut">donut</option>
</select><br /><br />
<div id="chart_area"></div><br />
<pre><code><div id="code_block"></div></code></pre>
*/

$('#chart_selector').change(function() {
  var chart_type = $('#chart_selector').val();
  console.log('Displaying chart: ' + chart_type);
  switch(chart_type) {
  case 'donut':
    $('#code_block').text("charts.donut({\n\
        sections: [{\n\
            data: 2,\n\
            label: 'eating',\n\
          }, {\n\
            data: 8,\n\
            label: 'sleeping',\n\
          }, {\n\
            data: 1.5,\n\
            label: 'Hacker News',\n\
          }, {\n\
            data: 4,\n\
            label: 'coding',\n\
          }],\n\
          centerLabel: 'My day',\n\
          container: '#chart_area',\n\
          width: 300,\n\
          height: 300\n\
        });");
      charts.donut({
        sections: [{
          data: 2,
          label: "eating",
        }, {
          data: 8,
          label: "sleeping",
        }, {
          data: 1.5,
          label: "hacker news",
        }, {
          data: 4,
          label: "coding",
        }],
        centerLabel: 'My day',
        container: '#chart_area',
        width: 300,
        height: 300
      });
    break;
  }
});

/*      String.prototype.escapeHTML = function () {                                        
        return(                                                                 
          this.replace(/>/g,'&gt;').
               replace(/</g,'&lt;').
               replace(/"/g,'&quot;')
        );
      };
      var codeEl = document.getElementById('code_block');
      if (codeEl) {
        codeEl.innerHTML = codeEl.innerHTML.escapeHTML();
      } */