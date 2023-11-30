import { Component, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import { Product } from "src/models/products.class";
import { User } from "src/models/user.class";
import { DatabaseService } from "../database.service";

export type ChartOptions = {
  series: any;
  chart: any;
  responsive: any[];
  labels: any;
  fill: any;
  legend: any;
  dataLabels: any;
};

@Component({
  selector: 'app-chart-products-sold',
  templateUrl: './chart-products-sold.component.html',
  styleUrls: ['./chart-products-sold.component.scss']
})
export class ChartProductsSoldComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  usersList: User[] = [];
  products: Product[] = [];
  productCountsObject: any = {};
  mostPopularProduct: any;
  leastPopularProduct: any = 0;


  constructor(private database: DatabaseService) {
    this.implementChart();
    this.subUsersList();
  }


  /**
   * Finds the key with the maximum value in the product counts object and updates the mostPopularProduct property.
   */
  findMaxKey() {
    let maxKey = null;
    let maxValue = 0;
    const obj = this.productCountsObject;

    for (const key in obj) {
      if (obj[key] > maxValue) {
        maxValue = obj[key];
        maxKey = key;
      }
    }

    this.mostPopularProduct = maxKey;
    this.findMinKey(maxValue);
  }


  /**
   * Finds the key with the minimum value, given the maxKey, in the product counts object and updates the leastPopularProduct property.
   * 
   * @param {any} maxKey - The maximum key value obtained from findMaxKey.
   */
  findMinKey(maxKey: any) {
    let minKey = null;
    let minValue = maxKey;
    const obj = this.productCountsObject;

    for (const key in obj) {
      if (obj[key] < minValue!) {
        minValue = obj[key];
        minKey = key;
      }
    }

    this.leastPopularProduct = minKey;
  }


  /**
   * Updates the chart options with the latest data from the users list.
   */
  updateChart() {
    if (this.usersList.length > 0) {
      const productCounts = this.countProductPurchases(this.usersList);
      this.productCountsObject = productCounts;
      this.findMaxKey();

      this.chartOptions.series = Object.values(productCounts);
      this.chartOptions.labels = Object.keys(productCounts);
    }
  }


  /**
   * Counts the number of purchases for each product in the given list of users.
   * 
   * @param {User[]} users - The list of users.
   * @returns {Object} An object representing the count of purchases for each product.
   */
  countProductPurchases(users: User[]): { [productName: string]: number } {
    const productCountMap: { [productName: string]: number } = {};

    for (const user of users) {
      for (const purchase of user.purchases) {
        const { title: productName } = purchase;
        const currentCount = productCountMap[productName] || 0;
        const amount = purchase.amount;
        productCountMap[productName] = currentCount + 1 * amount;
      }
    }

    return productCountMap;
  }


  /**
   * Subscribes to the usersList$ observable from the database and updates the usersList, triggering a chart update.
   */
  async subUsersList() {
    await this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
      this.updateChart();
    });
  }


  /**
   * Sets up the initial chart options for display.
   */
  implementChart() {
    this.chartOptions = {
      series: [],
      chart: {
        width: '500px',
        height: '300px',
        type: "donut",
        foreColor: '#fff',
        events: {
          dataPointMouseEnter: function (event: any) {
            event.target.style.cursor = "pointer";
          }
        },
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
        formatter: function (val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%'
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
