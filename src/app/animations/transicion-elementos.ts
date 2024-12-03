import {
  trigger,
  group,
  style,
  animate,
  transition,
  query,
  animateChild,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [

  //PACIENTE
  transition('login <=> mi-perfil-paciente', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mi-perfil-paciente <=> mis-turnos-paciente', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mi-perfil-paciente <=> solicitar-turnos', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mis-turnos-paciente <=> mi-perfil-paciente', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mis-turnos-paciente <=> solicitar-turnos', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('solicitarTurnos <=> mi-perfil-paciente', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('solicitarTurnos <=> mis-turnos-paciente', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '-100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),

  //ESPECIALISTA
  transition('login <=> mi-perfil-especialista', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mi-perfil-especialista <=> mis-turnos-especialista', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mis-turnos-especialista <=> mi-perfil-especialista', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('seccion-pacientes-x-especialista <=> mi-perfil-especialista', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mi-perfil-especialista <=> seccion-pacientes-x-especialista', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('seccion-pacientes-x-especialista <=> mis-turnos-especialista', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mis-turnos-especialista <=> seccion-pacientes-x-especialista', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
  transition('mis-turnos-especialista <=> guardar-historia-clinica', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true }
    ),

    query(':enter', [style({ left: '-100%' })], { optional: true }),

    group([
      query(':leave', [animate('2s ease-out', style({ left: '100%' }))], {
        optional: true,
      }),
      query(':enter', [animate('2s ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
    ]),
  ]),
]);
