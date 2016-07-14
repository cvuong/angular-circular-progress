# Angular Circular Progress Directive

## Instructions
```
<circular-progress actual="0.75" expected="0.15"></circular-progress>
```

This directive takes in two attributes, `actual` and `expected`.

The `actual` progress is the outer arc, and the `expected` progress is the inner arc.

Both attributes should be values between `0` and `1.0`, where `0` represents 0% of the circular arc filled and `1.0` represents 100% of the circular arc filled.

## Demo
Open up index.html in your browser to view the demo for this project.

## Running tests
Run `npm test` to start the Karma test runner.

## Improvements
- Use `templateUrl` that contains all of the SVG elements (text, circle, arcs), rather than rendering them all in the directive's `link` function
- Write tests that check the values of the rendered UI
- Instead of setting explicit styles and attributes on the SVG elements, use classes to represent them (makes it easier to test, too, because we can test the inclusion of class names)
- Use JSDoc comments
