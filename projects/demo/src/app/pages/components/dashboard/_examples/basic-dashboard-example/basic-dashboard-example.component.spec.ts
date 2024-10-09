import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDashboardExampleComponent } from './basic-dashboard-example.component';

describe('BasicDashboardExampleComponent', () => {
  let component: BasicDashboardExampleComponent;
  let fixture: ComponentFixture<BasicDashboardExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDashboardExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDashboardExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
