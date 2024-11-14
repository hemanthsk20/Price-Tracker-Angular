import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-years-prices',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './years-prices.component.html',
  styleUrl: './years-prices.component.scss'
})
export class YearsPricesComponent implements OnInit, OnChanges {
  @Input() yearsPriceChartData: any;

  basicData: any;
  basicOptions: any;

  ngOnInit(): void {
  }

  /**
  * Called when any data-bound property of a directive changes
  * @param changes 
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['yearsPriceChartData'] && this.yearsPriceChartData.length > 0) {
      this.createChart(this.yearsPriceChartData);
    }
  }

  /**
  * Create Chart
  * @param data 
  */
  createChart(data: any) {
    // Extract unique years and models, and sort years chronologically
    const years: any[] = Array.from(new Set(data.map((d: any) => d.Baujahr))).sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10));
    const models: string[] = Array.from(new Set(data.map((d: any) => d.Modell)));
  
    // Define color arrays
    const independentColors = [
      'rgba(0, 123, 255, 0.2)', 'rgba(255, 0, 123, 0.2)', 'rgba(123, 0, 255, 0.2)', 'rgba(255, 123, 0, 0.2)',
      'rgba(255, 87, 34, 0.2)', 'rgba(63, 81, 181, 0.2)', 'rgba(0, 188, 212, 0.2)', 'rgba(76, 175, 80, 0.2)',
      'rgba(0, 200, 83, 0.2)', 'rgba(255, 192, 2, 0.2)', 'rgba(156, 39, 176, 0.2)', 'rgba(3, 169, 244, 0.2)',
      'rgba(255, 152, 0, 0.2)', 'rgba(205, 220, 57, 0.2)', 'rgba(186, 104, 200, 0.2)', 'rgba(144, 202, 249, 0.2)',
      'rgba(255, 235, 59, 0.2)', 'rgba(233, 30, 99, 0.2)', 'rgba(121, 85, 72, 0.2)', 'rgba(158, 158, 158, 0.2)',
      'rgba(244, 67, 54, 0.2)', 'rgba(96, 125, 139, 0.2)', 'rgba(100, 221, 23, 0.2)', 'rgba(255, 138, 101, 0.2)',

    ];

    const independentBorderColors = [
      'rgba(0, 123, 255, 1)', 'rgba(255, 0, 123, 1)', 'rgba(123, 0, 255, 1)', 'rgba(255, 123, 0, 1)',
      'rgba(255, 87, 34, 1)', 'rgba(63, 81, 181, 1)', 'rgba(0, 188, 212, 1)', 'rgba(76, 175, 80, 1)',
      'rgba(0, 200, 83, 1)', 'rgba(255, 192, 2, 1)', 'rgba(156, 39, 176, 1)', 'rgba(3, 169, 244, 1)',
      'rgba(255, 152, 0, 1)', 'rgba(205, 220, 57, 1)', 'rgba(186, 104, 200, 1)', 'rgba(144, 202, 249, 1)',
      'rgba(255, 235, 59, 1)', 'rgba(233, 30, 99, 1)', 'rgba(121, 85, 72, 1)', 'rgba(158, 158, 158, 1)',
      'rgba(244, 67, 54, 1)', 'rgba(96, 125, 139, 1)', 'rgba(100, 221, 23, 1)', 'rgba(255, 138, 101, 1)'

    ];
  
    // Prepare datasets for each model
    const modelDatasets = models.map((model, index) => {
      const avgPricesByYear = years.map(year => {
        const entries = data.filter((d: any) => d.Modell === model && d.Baujahr === year);
        const avgPrice = entries.length
          ? entries.reduce((sum: number, d: any) => sum + d.Preis, 0) / entries.length
          : 0;
        return avgPrice.toFixed(2); // Return the average price rounded to 2 decimal places
      });
  
      return {
        label: model, // Label for the dataset (model name)
        data: avgPricesByYear, // Average prices for each year
        backgroundColor: independentColors[index % independentColors.length],
        borderColor: independentBorderColors[index % independentBorderColors.length],
        borderWidth: 1
      };
    });
  
    // Calculate the overall average price for each year based on the average prices of all models
    const overallAvgPricesByYear = years.map(year => {
      const dataForYear = data.filter((d: any) => d.Baujahr === year);
      const modelsInYear: string[] = Array.from(new Set(dataForYear.map((d: any) => d.Modell)));
  
      // Calculate average price for each model and sum them up
      const totalSumByYear = modelsInYear.reduce((totalSum: number, model: string) => {
        // Filter entries for the current model
        const entries = dataForYear.filter((d: any) => d.Modell === model);
        const avgPrice = entries.length
          ? entries.reduce((sum: number, d: any) => sum + d.Preis, 0) / entries.length
          : 0;
        return totalSum + avgPrice; // Sum up the average prices
      }, 0);
      // Compute the average price by dividing the total sum by the number of models
      const overallAvgPrice = modelsInYear.length
        ? totalSumByYear / modelsInYear.length
        : 0;
      return overallAvgPrice.toFixed(2); // Return the average price rounded to 2 decimal places
    });
  
    // Add a line dataset for the overall average
    const overallAvgDataset = {
      label: 'Overall Average',
      data: overallAvgPricesByYear,
      backgroundColor: 'rgba(30, 100, 180, 0.5)',
      borderColor: 'rgba(30, 100, 180, 1)',
      borderWidth: 2,
      type: 'line',
      fill: false,
      tension: 0.2
    };
  
    // Combine the datasets
    const datasets = [...modelDatasets, overallAvgDataset];
  
    // Number formatter for currency
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  
    // Chart.js options
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
    // Prepare data for the chart
    this.basicData = {
      labels: years,
      datasets: datasets
    };
  
    this.basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const datasetLabel = context.dataset.label || '';
              let label = '';
              const formattedPrice = numberFormat.format(context.raw);
              if (context.dataset.type === 'line' && datasetLabel === 'Overall Average') {
                label = `Overall Average Price: ${formattedPrice}`;
              } else {
                label = datasetLabel + ': ';
                label += `Average Price: ${formattedPrice}`;
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          title: {
            display: true,
            text: "Average Price (€)",
            font: {
              size: 15,
              weight: 'bold'
            }
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          title: {
            display: true,
            text: "Build Years",
            font: {
              size: 15,
              weight: 'bold'
            }
          },
        }
      }
    };
  }
  

}
