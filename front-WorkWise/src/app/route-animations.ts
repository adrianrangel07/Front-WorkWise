import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [

    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0
      })
    ], { optional: true }),

    group([

      // Página saliente
      query(':leave', [
        animate('200ms ease-out', style({
          opacity: 0,
          transform: 'scale(0.98)'
        }))
      ], { optional: true }),

      // Página entrante
      query(':enter', [
        style({
          opacity: 0,
          transform: 'scale(1.02)'
        }),
        animate('260ms ease-out', style({
          opacity: 1,
          transform: 'scale(1)'
        }))
      ], { optional: true })

    ])

  ])
]);
