app.directive('circularProgress', function() {
  return {
    restrict: 'E',
    template: '<div class="circular-progress"></div>',
    link: function(scope, elem, attr) {
      // Default the value of float to 0
      function formatInput(float) {
        if (!float || isNaN(float)) {
          float = 0;
        }
        float = Math.min(float, 1.0);
        float = Math.max(float, 0);
        return float
      }

      attr.actual = formatInput(attr.actual);
      attr.expected = formatInput(attr.expected);

      // Color constants
      var COLORS = {
        'DARK_GREEN':    '#64BA00',
        'LIGHT_GREEN':   '#B9E17D',
        ORANGE:          '#FFA500',
        RED:             '#FF0000',
        GREY:            '#F1F1F1',
        'PROGRESS_GREY': '#A9A9A9',
        'PCT_GREY':      '#4C4C4C'
      };

      // Return a float between 0 to 1.0 as a string with a percent
      // (i.e., 0.4567 -> "45%"), we always truncate to two digits.
      function getPctString(num) {
        return (num * 100).toFixed(0)
      }

      // Converts a float between 0 to 1.0 into a radians value between
      // 0 to 2PI.
      function convertPctToRadians(num) {
        return num * (2 * Math.PI)
      }

      // Returns the color value of the actual progress arc when passed
      // in an actual progress pct string and an expected progress pct string.
      function getActualProgressEndColor(actualProgress, expectedProgress) {
        var diff = actualProgress - expectedProgress;
        //console.log('diff', diff)
        if ((diff < -25) && (diff >= -50)) {
          //console.log('orange');
          return COLORS.ORANGE
        } else if (diff < -50) {
          //console.log('red');
          return COLORS.RED
        } else {
          //console.log('dark green');
          return COLORS.DARK_GREEN
        }
      }

      // Size constants
      var RADIUS = 70,
          ACTUAL_PROGRESS_THICKNESS = 5, // px
          ACTUAL_PROGRESS_OUTER_RADIUS = RADIUS, // px
          ACTUAL_PROGRESS_INNER_RADIUS = ACTUAL_PROGRESS_OUTER_RADIUS - ACTUAL_PROGRESS_THICKNESS, // px
          PROGRESS_SPACING = 3, // px
          CIRCLE_MARGIN = 5, // px
          EXPECTED_PROGRESS_THICKNESS = 3, // px
          EXPECTED_PROGRESS_OUTER_RADIUS = ACTUAL_PROGRESS_INNER_RADIUS - PROGRESS_SPACING, // px
          EXPECTED_PROGRESS_INNER_RADIUS = EXPECTED_PROGRESS_OUTER_RADIUS - EXPECTED_PROGRESS_THICKNESS, // px
          CIRCLE_RADIUS = EXPECTED_PROGRESS_INNER_RADIUS - CIRCLE_MARGIN; // px

      // Render the SVG container element
      var svg = d3.select(elem.children()[0])
        .append('svg')
        .attr('width', RADIUS * 2)
        .attr('height', RADIUS * 2)
        .append('g')
        .attr('transform', 'translate(' + RADIUS + ', ' + RADIUS + ')');

        // Render the actual progress arc
        var actualProgressArc = d3.arc()
          .outerRadius(ACTUAL_PROGRESS_OUTER_RADIUS)
          .innerRadius(ACTUAL_PROGRESS_INNER_RADIUS)
          .startAngle(0);

        // Render the expected progress arc
        var expectedProgressArc = d3.arc()
          .outerRadius(EXPECTED_PROGRESS_OUTER_RADIUS)
          .innerRadius(EXPECTED_PROGRESS_INNER_RADIUS)
          .startAngle(0)

        // Append the actual progress ring
        var actualProgressRing = svg.append('path')
          .datum({endAngle: 0})
          .attr('class', 'arc')
          .style('fill', COLORS.DARK_GREEN)
          .attr('d', actualProgressArc);

        // Append the expected progress ring
        var expectedProgressRing = svg.append('path')
          .datum({endAngle: 0})
          .attr('class', 'arc')
          .style('fill', COLORS.LIGHT_GREEN)
          .attr('d', expectedProgressArc);

        // Append the inner circle
        svg.append('circle')
          .attr('r', CIRCLE_RADIUS)
          .style('fill', COLORS.GREY);

        // Append the inner circle progress value
        var actualProgress = getPctString(attr.actual);
        svg.append('text')
          .text(actualProgress)
          .attr('font-family', 'Helvetica')
          .attr('font-size', '32px')
          .style('fill', COLORS.PCT_GREY)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'center')
            .append('tspan')
            .text('%')
            .attr('font-size', '16px')


          // Append the progress label
          svg.append('text')
            .text('Progress')
            .attr('y', '20px')
            .attr('font-family', 'Helvetica')
            .attr('font-size', '14px')
            .attr('fill', COLORS.PROGRESS_GREY)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'center')

        actualProgressRing.transition()
          .attr('fill', 'red');

        // Transition the arc
        // https://bl.ocks.org/mbostock/5100636
        setTimeout(function() {
          var actualProgressAngle = convertPctToRadians(attr.actual);
          var expectedProgressAngle = convertPctToRadians(attr.expected);

          var actualProgress = getPctString(attr.actual);
          var expectedProgress = getPctString(attr.expected);
          var actualProgressEndColor = getActualProgressEndColor(actualProgress, expectedProgress);

          actualProgressRing.transition()
            .duration(1000)
            .style('fill', actualProgressEndColor)
            .call(arcTweenActual, actualProgressAngle);
          expectedProgressRing.transition()
            .duration(1000)
            .call(arcTweenExpected, expectedProgressAngle);
        }, 100);

        function arcTweenActual(transition, newAngle) {
          transition.attrTween('d', function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function(t) {
              d.endAngle = interpolate(t);
              return actualProgressArc(d)
            }
          });
        }

        function arcTweenExpected(transition, newAngle) {
          transition.attrTween('d', function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function(t) {
              d.endAngle = interpolate(t);
              return expectedProgressArc(d)
            }
          });
        }

    }
  }
});
