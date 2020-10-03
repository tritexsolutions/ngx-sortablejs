import { Component } from '@angular/core';
import { SortablejsOptions } from '../../../../projects/ngx-sortablejs/src/lib/sortablejs-options';

@Component({
  selector: 'app-sortable-with-options',
  templateUrl: './sortable-with-options.component.html',
  styleUrls: ['./sortable-with-options.component.css'],
})
export class SortableWithOptionsComponent {

  draggableItems = [
    { draggable: true, text: '1' },
    { draggable: true, text: '2' },
    { draggable: false, text: '3' },
    { draggable: true, text: '4' },
    { draggable: true, text: '5' },
  ];

  eventItems = [
    '1',
    '2',
    '3',
    '4',
    '5',
  ];

  eventUpdateCounter = 0;

  scrollableItems = Array.from({ length: 30 }).map((u, i) => i + 1);

  draggableOptions: SortablejsOptions = {
    draggable: '.draggable',
  };

  eventOptions: SortablejsOptions = {
    onUpdate: () => this.eventUpdateCounter++,
  };

  scrollableOptions: SortablejsOptions = {
    scroll: true,
    scrollSensitivity: 100,
  };

}
