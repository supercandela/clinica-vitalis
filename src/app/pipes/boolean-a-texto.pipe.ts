import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanATexto',
  standalone: true
})
export class BooleanATextoPipe implements PipeTransform {
  transform(value: boolean | null | undefined | unknown, trueText: string = 'Sí', falseText: string = 'No'): string {
    if (value == true) return trueText;
    if (value == false) return falseText;
    return value as string;
  }
}