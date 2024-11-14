import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesModelsComponent } from './prices-models.component';

describe('PricesModelsComponent', () => {
  let component: PricesModelsComponent;
  let fixture: ComponentFixture<PricesModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricesModelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricesModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
