import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursYearsComponent } from './hours-years.component';

describe('HoursYearsComponent', () => {
  let component: HoursYearsComponent;
  let fixture: ComponentFixture<HoursYearsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoursYearsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
