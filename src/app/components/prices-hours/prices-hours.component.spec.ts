import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesHoursComponent } from './prices-hours.component';

describe('PricesHoursComponent', () => {
  let component: PricesHoursComponent;
  let fixture: ComponentFixture<PricesHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricesHoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricesHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
