function renderGraph(series, name, renderer) {
  var graph = new Rickshaw.Graph({
    element: document.querySelector('#' + name + " .chart"),
    renderer: renderer,
    stroke: true,
    series: series,
  });
  var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );
  var y_axis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      orientation: 'left',
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      element: document.querySelector('#' + name + ' .y_axis'),
  });

  var legend = new Rickshaw.Graph.Legend({
    element: document.querySelector('#' + name + ' .legend'),
    graph: graph
  });

  graph.render();
}

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

    var unreadsVelocity = [];
    for (var i=1; i<unreads.length; i++) {
      unreadsVelocity[i-1] = {x:unreads[i].x, y:(unreads[i].y - unreads[i-1].y)};
    }

    var archivedVelocity = [];
    for (var i=1; i<archives.length; i++) {
      archivedVelocity[i-1] = {x:archives[i].x, y:(archives[i].y - archives[i-1].y)};
    }

    var countSeries = [{
      name: 'Unread',
      data: unreads,
      color: 'steelblue'
    },
    {
      name:'Archived',
      data: archives,
      color: 'lightblue'
    }]

    var velocitySeries = [{
      name:'Unread Velocity',
      data: unreadsVelocity,
      color: 'steelblue'
    },
    {
      name:'Archived Velocity',
      data: archivedVelocity,
      color: 'lightblue'
    }];

    renderGraph(countSeries, 'count', 'line');
    if (velocitySeries.length > 0)
      renderGraph(velocitySeries, 'velocity', 'line');
  }
});