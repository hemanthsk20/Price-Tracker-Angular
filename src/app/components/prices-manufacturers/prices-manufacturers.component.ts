import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-prices-manufacturers',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './prices-manufacturers.component.html',
  styleUrl: './prices-manufacturers.component.scss'
})
export class PricesManufacturersComponent implements OnInit, OnChanges {
  @Input() pricesManufacturersChartData: any;

  basicData: any;
  basicOptions: any;

  ngOnInit(): void {
  }

  /**
  * Called when any data-bound property of a directive changes
  * @param changes 
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pricesManufacturersChartData'] && this.pricesManufacturersChartData.length > 0) {
      this.createChart(this.pricesManufacturersChartData);
    }
  }

  /**
  * Create Chart
  * @param data 
  */
  createChart(data: any) {
    // Extract unique manufacturers (Händler) and models (Modell)
    const manufacturers = Array.from(new Set(data.map((d: any) => d.Händler)));
    const models = Array.from(new Set(data.map((d: any) => d.Modell)));

    // Define color arrays
    const independentColors = [
      'rgba(0, 123, 255, 0.2)', 'rgba(255, 0, 123, 0.2)', 'rgba(123, 0, 255, 0.2)', 'rgba(255, 123, 0, 0.2)',
      'rgba(0, 200, 83, 0.2)', 'rgba(255, 192, 2, 0.2)', 'rgba(156, 39, 176, 0.2)', 'rgba(3, 169, 244, 0.2)',
      'rgba(255, 87, 34, 0.2)', 'rgba(63, 81, 181, 0.2)', 'rgba(0, 188, 212, 0.2)', 'rgba(76, 175, 80, 0.2)',
      'rgba(255, 152, 0, 0.2)', 'rgba(205, 220, 57, 0.2)', 'rgba(186, 104, 200, 0.2)', 'rgba(144, 202, 249, 0.2)',
      'rgba(255, 235, 59, 0.2)', 'rgba(233, 30, 99, 0.2)', 'rgba(121, 85, 72, 0.2)', 'rgba(158, 158, 158, 0.2)',
      'rgba(244, 67, 54, 0.2)', 'rgba(96, 125, 139, 0.2)', 'rgba(100, 221, 23, 0.2)', 'rgba(255, 138, 101, 0.2)',

    ];

    const independentBorderColors = [
      'rgba(0, 123, 255, 1)', 'rgba(255, 0, 123, 1)', 'rgba(123, 0, 255, 1)', 'rgba(255, 123, 0, 1)',
      'rgba(0, 200, 83, 1)', 'rgba(255, 192, 2, 1)', 'rgba(156, 39, 176, 1)', 'rgba(3, 169, 244, 1)',
      'rgba(255, 87, 34, 1)', 'rgba(63, 81, 181, 1)', 'rgba(0, 188, 212, 1)', 'rgba(76, 175, 80, 1)',
      'rgba(255, 152, 0, 1)', 'rgba(205, 220, 57, 1)', 'rgba(186, 104, 200, 1)', 'rgba(144, 202, 249, 1)',
      'rgba(255, 235, 59, 1)', 'rgba(233, 30, 99, 1)', 'rgba(121, 85, 72, 1)', 'rgba(158, 158, 158, 1)',
      'rgba(244, 67, 54, 1)', 'rgba(96, 125, 139, 1)', 'rgba(100, 221, 23, 1)', 'rgba(255, 138, 101, 1)'

    ];

    // Chart.js options
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Create a dataset for each manufacturer
    const datasets = models.map((model, index) => {
      return {
        label: model,
        data: manufacturers.map((manufacturer) => {
          // Filter entries for the current model and manufacturer
          const entries = data.filter(
            (d: any) => d.Modell === model && d.Händler === manufacturer
          );

          // Calculate the average price for the filtered entries
          const avgPrice = entries.length
            ? entries.reduce((sum: number, d: any) => sum + d.Preis, 0) / entries.length
            : 0;
          return avgPrice.toFixed(2); // Return the average price or 0 if not found
        }),
        backgroundColor: independentColors[index % independentColors.length],
        borderColor: independentBorderColors[index % independentBorderColors.length],
        borderWidth: 1
      };
    });

    // Number formatter for currency
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Chart.js data structure
    this.basicData = {
      labels: manufacturers,
      datasets: datasets // Datasets for each manufacturer     
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
              let label = context.dataset.label || '';
              const formattedPrice = numberFormat.format(context.raw);
              if (label) {
                label += ': ';
              }
              label += `Average Price: ${formattedPrice}`;
              return label;
            }
          }
        },
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
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          title: {
            display: true,
            text: "Dealers",
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
