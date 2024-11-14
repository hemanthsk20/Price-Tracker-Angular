import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableComponent } from "../table/table.component";
import { SliderModule } from 'primeng/slider';
import { HoursYearsComponent } from "../hours-years/hours-years.component";
import { PricesHoursComponent } from '../prices-hours/prices-hours.component';
import { YearsPricesComponent } from '../years-prices/years-prices.component';
import { PortalsModalsComponent } from "../portals-modals/portals-modals.component";
import { PricesManufacturersComponent } from '../prices-manufacturers/prices-manufacturers.component';
import { PricesModelsComponent } from '../prices-models/prices-models.component';


@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [FormsModule, HeaderComponent, PricesManufacturersComponent, PricesModelsComponent, DropdownModule, CalendarModule, TableComponent, SliderModule, HoursYearsComponent, PricesHoursComponent, YearsPricesComponent, PortalsModalsComponent,PortalsModalsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chart-container.component.html',
  styleUrl: './chart-container.component.scss'
})
export class ChartContainerComponent implements OnInit {
  date: Date[] | undefined;
  // Dropdown options
  brands: string[] = [];
  models: string[] = [];
  years: number[] = [];
  hoursUsage: number[] = [];
  portals: string[] = [];
  manufacturers: string[] = [];
  prices: number[] = [];

  // Selected values
  selectedBrand: string = '';
  selectedModel: string = '';
  selectedYear: number | string | null = '';
  selectedHoursUsage: number | string | null = '';
  selectedPortal: string | undefined;
  selectedManufacturer: string | undefined;

  //Data
  filteredData: any[] = [];
  originalData: any[] = [];
  minHoursUsage: number = 0;
  maxHoursUsage: number = 0;
  minYear: number = 0;
  maxYear: number = 0;
  selectedYearsRange: any[] = [];
  selectedHoursUsageRange: any[] = [];
  availableHoursUsageValues: number[] = [];
  availableYearsValues: number[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getMachineData();
  }

  getMachineData() {
    this.dataService.getMachineData().subscribe((res) => {
      this.originalData = res.filter(d => typeof d.Preis !== 'string');
      this.populateDropdowns();
      this.filteredData = [...this.originalData];

      this.availableHoursUsageValues = Array.from(new Set(this.originalData.map(d => d.Betriebsstunden)));
      this.availableYearsValues = Array.from(new Set(this.originalData.map(d => d.Baujahr)));

      // Calculate the minimum and maximum values for the range slider
      this.minHoursUsage = Math.min(...this.availableHoursUsageValues);
      this.maxHoursUsage = Math.max(...this.availableHoursUsageValues);
      this.minYear = Math.min(...this.availableYearsValues);
      this.maxYear = Math.max(...this.availableYearsValues);

      this.selectedHoursUsageRange = [this.minHoursUsage, this.maxHoursUsage];
      this.selectedYearsRange = [this.minYear, this.maxYear];
    });
  }

  // Populate dropdown options based on data
  populateDropdowns(): void {
    this.brands = Array.from(new Set(this.originalData.map(d => d.Hersteller))).sort();
    this.models = Array.from(new Set(this.originalData.map(d => d.Modell))).sort();
    this.years = Array.from(new Set(this.originalData.map(d => d.Baujahr))).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)); 
    this.hoursUsage = Array.from(new Set(this.originalData.map(d => d.Betriebsstunden))).sort((a, b) => a - b); 
    this.portals = Array.from(new Set(this.originalData.map(d => d.Plattform))).sort();
    this.manufacturers = Array.from(new Set(this.originalData.map(d => d.Händler))).sort();
    this.prices = Array.from(new Set(this.originalData.map(d => d.Preis))).sort((a, b) => a - b);
  } 

  // Filter data based on selected dropdown values
  filterData(): any[] {
    this.filteredData =
      this.originalData.filter(d => {
        const matchesBrand = !this.selectedBrand || d.Hersteller === this.selectedBrand;
        const matchesModel = !this.selectedModel || d.Modell === this.selectedModel;
        const roundedYears = this.roundToNearestValue(d.Baujahr, this.availableYearsValues);
        const matchesYear = roundedYears >= this.selectedYearsRange[0] && roundedYears <= this.selectedYearsRange[1];
        // !Number(this.selectedYear) || d.Baujahr === Number(this.selectedYear);

        // const matchesHoursUsage = !Number(this.selectedHoursUsage) || d.Betriebsstunden === Number(this.selectedHoursUsage);
        const matchesPortal = !this.selectedPortal || d.Plattform === this.selectedPortal;
        const matchesManufacturer = !this.selectedManufacturer || d.Händler === this.selectedManufacturer;
        const roundedHours = this.roundToNearestValue(d.Betriebsstunden, this.availableHoursUsageValues);
        const matchesHoursUsage = roundedHours >= this.selectedHoursUsageRange[0] && roundedHours <= this.selectedHoursUsageRange[1];
    
        return matchesBrand && matchesModel && matchesYear && matchesHoursUsage && matchesPortal && matchesManufacturer;
      });
    return this.filteredData;
  }

  roundToNearestValue(value: number, availableValues: number[]): number {
    return availableValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }

  // Handle dropdown changes
  onDropdownChange(): void {
    this.filterData();
  }

}
