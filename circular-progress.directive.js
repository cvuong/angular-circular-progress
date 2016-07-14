app.directive('circularProgress', function() {
  return {
    restrict: 'E',
    template: '<div class="circular-progress"></div>',
    link: function(scope, elem, attr) {
      // Format input floats such that:
      // - They are non-null (or else, they default to 0)
      // - They are numbers (or else, they default to 0)
      // - The bounds get capped between 0 and 1.0
      scope.formatInput = function(float) {
        if (!float || isNaN(float)) {
          float = 0;
        }
        float = Math.min(float, 1.0);
        float = Math.max(float, 0);
        return float
      };

      // Return a float between 0 to 1.0 as a string with a percent
      // (i.e., 0.4567 -> "45"), we always truncate to two digits.
      scope.getPctString = function(num) {
        return (num * 100).toFixed(0)
      }

      // Converts a float between 0 to 1.0 into a radians value between
      // 0 to 2PI.
      scope.convertPctToRadians = function(num) {
        return num * (2 * Math.PI)
      }

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

      // Color threshold percentages
      var ORANGE_THRESHOLD = -25;
      var RED_THRESHOLD    = -50;

      // Returns the hex color value for the actual progress arc when passed
      // in an actual progress pct string and an expected progress pct string.
      scope.getActualProgressEndColor = function(actualProgress, expectedProgress) {
        var diff = actualProgress - expectedProgress;
        if ((diff < ORANGE_THRESHOLD) && (diff >= RED_THRESHOLD)) {
          return COLORS.ORANGE
        } else if (diff < RED_THRESHOLD) {
          return COLORS.RED
        } else {
          return COLORS.DARK_GREEN
        }
      }

      // Format the "actual" and "expected" float values
      // (just in case they are invalid)
      attr.actual = scope.formatInput(attr.actual);
      attr.expected = scope.formatInput(attr.expected);

      // Time constants (units: ms)
      var TRANSITION_DELAY = 200,
          TRANSITION_TIME  = 1000;

      // Size constants (units: px)
      var RADIUS                         = 70,
          ACTUAL_PROGRESS_THICKNESS      = 5,
          ACTUAL_PROGRESS_OUTER_RADIUS   = RADIUS,
          ACTUAL_PROGRESS_INNER_RADIUS   = ACTUAL_PROGRESS_OUTER_RADIUS - ACTUAL_PROGRESS_THICKNESS,
          PROGRESS_SPACING               = 3,
          CIRCLE_MARGIN                  = 5,
          EXPECTED_PROGRESS_THICKNESS    = 3,
          EXPECTED_PROGRESS_OUTER_RADIUS = ACTUAL_PROGRESS_INNER_RADIUS - PROGRESS_SPACING,
          EXPECTED_PROGRESS_INNER_RADIUS = EXPECTED_PROGRESS_OUTER_RADIUS - EXPECTED_PROGRESS_THICKNESS,
          CIRCLE_RADIUS                  = EXPECTED_PROGRESS_INNER_RADIUS - CIRCLE_MARGIN;

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
        var actualProgress = scope.getPctString(attr.actual);
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

        // Add transition to the progress arcs
        // https://bl.ocks.org/mbostock/5100636
        setTimeout(function() {
          var actualProgressAngle    = scope.convertPctToRadians(attr.actual);
          var expectedProgressAngle  = scope.convertPctToRadians(attr.expected);

          var actualProgress         = scope.getPctString(attr.actual);
          var expectedProgress       = scope.getPctString(attr.expected);
          var actualProgressEndColor = scope.getActualProgressEndColor(actualProgress, expectedProgress);

          actualProgressRing.transition()
            .duration(TRANSITION_TIME)
            .style('fill', actualProgressEndColor)
            .call(arcTween, actualProgressAngle, actualProgressArc);
          expectedProgressRing.transition()
            .duration(TRANSITION_TIME)
            .call(arcTween, expectedProgressAngle, expectedProgressArc);
        }, TRANSITION_DELAY);

        function arcTween(transition, newAngle, arc) {
          transition.attrTween('d', function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function(t) {
              d.endAngle = interpolate(t);
              return arc(d)
            }
          });
        }
    }
  }
});
