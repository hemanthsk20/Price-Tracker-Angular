import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-prices-hours',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './prices-hours.component.html',
  styleUrl: './prices-hours.component.scss'
})

export class PricesHoursComponent implements OnInit, OnChanges {
  @Input() priceHoursChartData: any;

  basicData: any;
  basicOptions: any;

  ngOnInit(): void {
  }

  /**
  * Called when any data-bound property of a directive changes
  * @param changes 
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceHoursChartData'] && this.priceHoursChartData.length > 0) {
      this.createChart(this.priceHoursChartData);
    }
  }

  /**
  * Create Chart
  * @param data 
  */
  createChart(data: any) {
    // Extract unique hours of usage
    const hours = Array.from(new Set(data.map((d: any) => d.Betriebsstunden))).sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10));

    // Calculate the average price for each hour group
    const averagePricesByHour = hours.map(hour => {
      // Filter data for the current hour group
      const entries = data.filter((d: any) => d.Betriebsstunden === hour);

      // Calculate the average price for this hour group
      const avgPrice = entries.length
        ? entries.reduce((sum: number, d: any) => sum + d.Preis, 0) / entries.length
        : 0;

      return avgPrice.toFixed(2); // Returning the average price rounded to 2 decimal places
    });

    // Chart.js options
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Number formatter for currency
        const numberFormat = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

    // Prepare data for the chart
    this.basicData = {
      labels: hours,
      datasets: [
        {
          label: 'Average Price (€)',
          data: averagePricesByHour,
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
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
              label = `Average Price: ${formattedPrice}`;
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
          type: 'linear',
          min: 1000,
          max: 16500,
          ticks: {
            color: textColorSecondary,
            stepSize: 500,
            callback: function (value:any) {
              return value;
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          title: {
            display: true,
            text: "Operational Hours",
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