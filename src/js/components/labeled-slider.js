import { Observable as $ } from 'rx';
import { div, br, label, input } from '@cycle/dom';
import isolate from '@cycle/isolate';


// INTENT: Reading the input streams from the sources
function intent(DOMSource) {
  const changeSlider$ = DOMSource.select('.labeled-slider__input').events('input')
    .map(ev => ev.target.value);

  return changeSlider$;
};

// MODEL: Updating the internal state based on the outside streams
function model(newValue$, props$) {
  const initialValue$ = props$.map(props => props.init).first();
  const value$ = initialValue$.concat(newValue$);

  return $.combineLatest(value$, props$, (value, props) => {
    return {
      label: props.label,
      unit: props.unit,
      min: props.min,
      max: props.max,
      value: value
    }
  });
};

// VIEW: creating a sink that maps the state to the output
function view(state$) {
  return state$.map(state =>
    div('.labeled-slider', [
      label('.labeled-slider__label', `${state.label}: ${state.value}${state.unit}`),
      input('.labeled-slider__input', { type: 'range', min: state.min, max: state.max, value: state.value})
    ])
  );
};

function component({DOM, props$}) {
  const changeSlider$= intent(DOM);
  const state$ = model(changeSlider$, props$);
  const vtree$ = view(state$);
  return {
    DOM: vtree$,
    value: state$.map( state => state.value )
  }
}

export default (sources) => {
  // Isolating the scope of the reusable component exporting that
  return isolate(component)(sources);
};
