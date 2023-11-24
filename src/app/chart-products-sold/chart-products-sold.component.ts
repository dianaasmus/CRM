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



  updateChart() {
    if (this.usersList.length > 0) {
      const productCounts = this.countProductPurchases(this.usersList);
      this.productCountsObject = productCounts;
      this.findMaxKey();

      this.chartOptions.series = Object.values(productCounts);
      this.chartOptions.labels = Object.keys(productCounts);
    }
  }


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


  async subUsersList() {
    await this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
      this.updateChart();
    });
  }


  implementChart() {
    this.chartOptions = {
      series: [],
      chart: {
        width: '500px',
        height: '300px',
        type: "donut"
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
