import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridStackComponent } from './grid-stack.component';

describe('GridStackComponent', () => {
  let component: GridStackComponent;
  let fixture: ComponentFixture<GridStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
