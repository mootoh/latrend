$.ajax({
  url: "/stats",
  success: function(response) {
    function pickup(key) {
      return response.map(function(stat) {
        return stat[key];
      });
    };

    var unreads = pickup('unread');
    var archives = pickup('archived');
    var totals = pickup('total');
    var dates = pickup('date').reverse();

    function makeSeries(array) {
      var i = 0;
      return array.reverse().map(function(val) {
        return {x:dates[i++], y:val};
      });
    }

    unreads = makeSeries(unreads);
    archives = makeSeries(archives);
    totals = makeSeries(totals);

    var graph = new Rickshaw.Graph({
    element: document.querySelector("#chart"),
    renderer: 'area',
    width: 230,
    stroke: true,
    series: [{
      name: 'Unread',
      data: unreads,
      color: 'steelblue'
    }, {
      name:'Archived',
      data: archives,
      color: 'lightblue'
    }]
    });
    var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );
    var y_axis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: document.querySelector('#y_axis'),
    });

    var legend = new Rickshaw.Graph.Legend({
      element: document.querySelector('#legend'),
      graph: graph
    });

    graph.render();
  }
});