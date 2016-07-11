import { Observable as $ } from 'rx';
import { div, br, label, input, h2 } from '@cycle/dom';
import { Input } from './helpers';


const LabeledSlider = require('./components/labeled-slider.js').default;


const heightSliderProps = $.of({
  label: 'Height',
  unit: 'cm',
  min: 140,
  max: 220,
  init: 170
});

const weightSliderProps = $.of({
  label: 'Weight',
  unit: 'kg',
  min: 40,
  max: 180,
  init: 80
});

function view(DOM) {
    const weightSliderSinks = LabeledSlider({ DOM, props$: weightSliderProps });
    const heightSliderSinks = LabeledSlider({ DOM, props$: heightSliderProps });

    const weightValue$ = weightSliderSinks.value;
    const heightValue$ = heightSliderSinks.value;

    const bmi$ = $.combineLatest(weightValue$, heightValue$, (weight, height) => (weight / (height / 100) ** 2).toFixed(1));

    const vtree$ = $.combineLatest(weightSliderSinks.DOM, heightSliderSinks.DOM, bmi$, (weightVTree, heightVTree, bmi) =>
      div([
        weightVTree,
        heightVTree,
        h2(`BMI is ${bmi}`)
      ])
    );

    return vtree$
  }

export default ({ DOM }) => {
  const vtree$ = view(DOM);

  return {
    DOM: vtree$
  }
}
