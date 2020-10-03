import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SortablejsModule } from '../../projects/ngx-sortablejs/src/lib/sortablejs.module';
import { SortableWithOptionsComponent } from './sortable-with-options.component';

describe('SortableWithOptionsComponent', () => {
  let component: SortableWithOptionsComponent;
  let fixture: ComponentFixture<SortableWithOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SortableWithOptionsComponent],
      imports: [
        SortablejsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableWithOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
