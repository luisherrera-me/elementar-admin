import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFileComponent } from './list-file.component';

describe('ListFileComponent', () => {
  let component: ListFileComponent;
  let fixture: ComponentFixture<ListFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
