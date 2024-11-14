import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-hours-years',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './hours-years.component.html',
  styleUrl: './hours-years.component.scss'
})
export class HoursYearsComponent implements OnInit, OnChanges {
  @Input() hoursYearsChartData: any;

  basicData: any;
  basicOptions: any;

  ngOnInit(): void {
  }

  /**
  * Called when any data-bound property of a directive changes
  * @param changes 
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hoursYearsChartData'] && this.hoursYearsChartData.length > 0) {
      this.createChart(this.hoursYearsChartData);
    }
  }

  /**
  * Create Chart
  * @param data 
  */
  createChart(data: any) {
    // Extract unique years and models
    const years = Array.from(new Set(data.map((d: any) => d.Baujahr))).sort((a: any, b: any) => parseInt(a, 10) - parseInt(b, 10));
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

    // Calculate average build hours for each model per year
    const modelDatasets = models.map((model, index) => {
      const avgHoursByYear = years.map(year => {
        const entries = data.filter((d: any) => d.Modell === model && d.Baujahr === year);
        const avgHours = entries.length
          ? entries.reduce((sum: number, d: any) => sum + d.Betriebsstunden, 0) / entries.length
          : 0;
        return avgHours.toFixed(2);
      });

      return {
        label: model,
        data: avgHoursByYear,
        backgroundColor: independentColors[index % independentColors.length],
        borderColor: independentBorderColors[index % independentBorderColors.length],
        borderWidth: 1,
        type: 'bar'
      };
    });

    // Calculate overall average build hours per year based on model averages
    const overallAvgHoursByYear = years.map(year => {
      const modelAverages = models.map(model => {
        const entries = data.filter((d: any) => d.Modell === model && d.Baujahr === year);
        const avgHours = entries.length
          ? entries.reduce((sum: number, d: any) => sum + d.Betriebsstunden, 0) / entries.length
          : 0;
        return avgHours;
      });

      const overallAvgHours = modelAverages.length
        ? modelAverages.reduce((sum: number, avg: number) => sum + avg, 0) / modelAverages.length
        : 0;

      return overallAvgHours.toFixed(2);
    });
    console.log(overallAvgHoursByYear)

    // Add the line dataset for overall average
    modelDatasets.push({
      label: 'Overall Average',
      data: overallAvgHoursByYear,
      // borderColor: 'rgba(75, 192, 192, 1)',
      // backgroundColor: 'rgba(75, 192, 192, 0.2)',
      backgroundColor: 'rgba(30, 100, 180, 0.5)',
      borderColor: 'rgba(30, 100, 180, 1)',
      type: 'line',
      borderWidth: 2,
    });

    // Chart.js options
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    console.log(modelDatasets);
    // Prepare data for the chart
    this.basicData = {
      labels: years,
      datasets: modelDatasets
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
              if (context.dataset.type === 'line' && datasetLabel === 'Overall Average') {
                label = `Overall Average Operational Hours: ${context.raw}`;
              } else {
                label = datasetLabel + ': ';
                label += `Average Operational Hours: ${context.raw}`;
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
            text: "Average Operational Hours",
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
