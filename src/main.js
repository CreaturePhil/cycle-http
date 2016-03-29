import Cycle from '@cycle/core'
import {makeDOMDriver, button, p, label, div} from '@cycle/dom'
import Rx from 'rx'

function main (sources) {
  const decrementClicks$ = sources.DOM
    .select('.decrement')
    .events('click')
  const incrementClicks$ = sources.DOM
    .select('.increment')
    .events('click')
  const decrementAction$ = decrementClicks$.map((ev) => -1)
  const incrementAction$ = incrementClicks$.map((ev) => +1)
  const number$ = Rx.Observable.merge(
    decrementAction$,
    incrementAction$
  )
  .startWith(0)
  .scan((acc, cur) => acc + cur)

  const sinks = {
    DOM: number$.map((number) =>
      div([
        button('.decrement', 'Decrement'),
        button('.increment', 'Increment'),
        p([
          label(String(number))
        ])
      ])
    )
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers)
