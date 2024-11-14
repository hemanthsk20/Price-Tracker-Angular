import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsPricesComponent } from './years-prices.component';

describe('YearsPricesComponent', () => {
  let component: YearsPricesComponent;
  let fixture: ComponentFixture<YearsPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearsPricesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearsPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
