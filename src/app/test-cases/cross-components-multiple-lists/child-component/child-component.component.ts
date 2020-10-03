import { Component, Input } from '@angular/core';
import { SortablejsOptions } from '../../../../../projects/ngx-sortablejs/src/lib/sortablejs-options';

@Component({
  selector: 'app-child-component',
  templateUrl: './child-component.component.html',
  styleUrls: ['./child-component.component.css'],
})
export class ChildComponentComponent {

  @Input()
  list: string[];

  options: SortablejsOptions = {
    group: 'test',
  };

}
