import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, AccordionModule, DecimalPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableData: any;

  averagePrices: any[] = [];
  yearAveragePrices: any[] = [];
  uniqueYears: string[] = [];
  averagePricesPerPlatform: { Model: string;[platform: string]: string | number }[] = [];
  uniqueModels: string[] = [];
  uniquePlatforms: string[] = [];
  data: any;

  ngOnInit(): void {
  }

  /**
  * Called when any data-bound property of a directive changes
  * @param changes 
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && this.tableData.length > 0) {
      this.data = this.tableData;
      this.calculateGeneralAverage();
      this.calculateAverageBasedOnYear();
      this.calculateAverageBasedOnPlatform();
    }
  }


  /**
  * Group data by Modell
  * @param changes 
  */
  calculateGeneralAverage() {
    const groupedData = this.data.reduce((acc: { [key: string]: number[] }, curr: any) => {
      if (typeof curr.Preis === 'number') {
        if (!acc[curr.Modell]) {
          acc[curr.Modell] = [];
        }
        acc[curr.Modell].push(curr.Preis);
      }
      return acc;
    }, {});

    // Calculate average price for each model
    this.averagePrices = Object.entries(groupedData).map(([model, prices]) => {
      const sum = (prices as number[]).reduce((acc: any, price: number) => acc + price, 0);
      const avg = (sum / (prices as number[]).length).toFixed(2);
      return { Model: model, AvgPrice: avg, MachineCount: (prices as number[]).length };
    });

  }

  /**
  * Calculate avg based on year
  * @returns 
  */

  calculateAverageBasedOnYear() {
    // Group data by model and year
    const groupedData = this.data.reduce((acc: { [key: string]: { [key: number]: number[] } }, curr: any) => {
      if (typeof curr.Preis === 'number') {
        if (!acc[curr.Modell]) {
          acc[curr.Modell] = {};
        }
        if (!acc[curr.Modell][curr.Baujahr]) {
          acc[curr.Modell][curr.Baujahr] = [];
        }
        acc[curr.Modell][curr.Baujahr].push(curr.Preis);
  
        // Collect unique years
        if (!this.uniqueYears.includes(curr.Baujahr.toString())) {
          this.uniqueYears.push(curr.Baujahr.toString());
        }
      }
      return acc;
    }, {});
  
    // Sort the years to ensure they're in chronological order
    this.uniqueYears.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  
    // Calculate average prices and counts for each model and year
    this.yearAveragePrices = Object.entries(groupedData).map(([model, yearsData]) => {
      const yearAverages: { [key: number]: { average: number, count: number } } = {};
  
      for (const [year, prices] of Object.entries(yearsData as { [key: string]: number[] })) {
        const sum = prices.reduce((acc, price) => acc + price, 0);
        const avg = sum / prices.length;
        yearAverages[year as any] = {
          average: parseFloat(avg.toFixed(2)), // Round to 2 decimal places
          count: prices.length                 // Number of machines
        };
      }
  
      return { Model: model, ...yearAverages };
    });
  }
  

  /**
  * Calculate avg based on platform
  * @returns 
  */
  calculateAverageBasedOnPlatform(): void {
    // Filter out entries with invalid or non-numeric 'Preis'
    const filteredData = this.data.filter((item: any) => !isNaN(Number(item.Preis)));
  
    // Collect unique models and platforms
    const modelsSet = new Set<string>();
    const platformsSet = new Set<string>();
  
    filteredData.forEach((item: any) => {
      modelsSet.add(item.Modell);
      platformsSet.add(item.Plattform);
    });
  
    this.uniqueModels = Array.from(modelsSet).sort();
    this.uniquePlatforms = Array.from(platformsSet).sort();
  
    // Initialize maps to store prices and counts
    const priceMap = new Map<string, Map<string, number[]>>();
    const countMap = new Map<string, Map<string, number>>();
  
    filteredData.forEach((item: any) => {
      const model = item.Modell;
      const platform = item.Plattform;
      const price = Number(item.Preis);
  
      if (!priceMap.has(model)) {
        priceMap.set(model, new Map<string, number[]>());
      }
  
      const platformMap = priceMap.get(model)!;
  
      if (!platformMap.has(platform)) {
        platformMap.set(platform, []);
      }
  
      platformMap.get(platform)!.push(price);
  
      // Update the count map
      if (!countMap.has(model)) {
        countMap.set(model, new Map<string, number>());
      }
  
      const countPlatformMap = countMap.get(model)!;
  
      if (!countPlatformMap.has(platform)) {
        countPlatformMap.set(platform, 0);
      }
  
      countPlatformMap.set(platform, countPlatformMap.get(platform)! + 1);
    });
  
    // Calculate averages
    this.averagePricesPerPlatform = this.uniqueModels.map(model => {
      const result: { Model: string; [platform: string]: string | number } = { Model: model };
      const platformMap = priceMap.get(model);
      const countPlatformMap = countMap.get(model);
  
      this.uniquePlatforms.forEach(platform => {
        if (platformMap && platformMap.has(platform)) {
          const prices = platformMap.get(platform)!;
          const sum = prices.reduce((acc, curr) => acc + curr, 0);
          const avg = sum / prices.length;
          result[`${platform}Avg`] = avg.toFixed(2); // Round to 2 decimal places
          result[`${platform}Count`] = countPlatformMap?.get(platform) || '--'; // Show count
        } else {
          result[`${platform}Avg`] = '--';
          result[`${platform}Count`] = '--';
        }
      });
  
      return result;
    });
  }
  
}
