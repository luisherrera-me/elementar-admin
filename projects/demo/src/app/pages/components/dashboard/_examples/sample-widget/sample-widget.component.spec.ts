import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleWidgetComponent } from './sample-widget.component';

describe('SampleWidgetComponent', () => {
  let component: SampleWidgetComponent;
  let fixture: ComponentFixture<SampleWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
