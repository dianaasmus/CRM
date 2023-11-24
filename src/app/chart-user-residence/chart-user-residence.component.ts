import { Component, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import { Product } from "src/models/products.class";
import { User } from "src/models/user.class";
import { DatabaseService } from "../database.service";


export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  dataLabels: any;
  plotOptions: any;
  colors: any;
  fill: any;
};

@Component({
  selector: 'app-chart-user-residence',
  templateUrl: './chart-user-residence.component.html',
  styleUrls: ['./chart-user-residence.component.scss']
})
export class ChartUserResidenceComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  usersList: User[] = [];
  products: Product[] = [];
  productCountsObject: any = {};
  mostPopularProduct: any;
  leastPopularProduct: any = 0;


  constructor(private database: DatabaseService) {
    this.subUsersList();
  }


  countCityUsers(users: User[]): { [city: string]: number } {
    const cityUserCountMap: { [city: string]: number } = {};

    for (const user of users) {
      const city = user.city;

      if (cityUserCountMap[city]) {
        cityUserCountMap[city]++;
      } else {
        cityUserCountMap[city] = 1;
      }
    }

    return cityUserCountMap;
  }


  async subUsersList() {
    await this.database.usersList$.subscribe(usersList => {
      this.usersList = usersList;
      this.implementChart()
    });
  }


  implementChart() {
    const cityUserCounts = this.countCityUsers(this.usersList);

    this.chartOptions = {
      series: [
        {
          name: "User",
          data: Object.values(cityUserCounts)
        }
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: Object.keys(cityUserCounts)
      }
    }
  }
}
