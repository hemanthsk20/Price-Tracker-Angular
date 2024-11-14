import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesManufacturersComponent } from './prices-manufacturers.component';

describe('PricesManufacturersComponent', () => {
  let component: PricesManufacturersComponent;
  let fixture: ComponentFixture<PricesManufacturersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricesManufacturersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricesManufacturersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
