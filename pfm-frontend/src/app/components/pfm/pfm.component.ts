import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/models/Transaction';
import { TransactionsService } from 'src/app/services/transactions.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChooseCategoryComponent } from '../choose-category/choose-category.component';
import { SplitComponent } from '../split/split.component';
import { ApexAxisChartSeries, ApexTitleSubtitle, ApexDataLabels, ApexChart, ApexPlotOptions, ApexLegend, ApexXAxis, ApexFill, ApexTheme, ApexTooltip, ApexYAxis, ApexGrid, ApexNonAxisChartSeries, ApexResponsive, ApexOptions } from "ng-apexcharts";
import { _MatTabBodyBase } from '@angular/material/tabs';
import { Category } from 'src/app/models/Category';
import { CategoriesService } from 'src/app/services/categories.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { SingleCategorySplit } from 'src/app/models/SingleCategorySplit';
import { ErrorComponent } from '../error/error.component';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SplitsComponent } from '../splits/splits.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
};

export type BubbleChartOptions = {
  grid: ApexGrid;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  theme: ApexTheme
};

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  options: ApexOptions;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  theme: ApexTheme;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip
};

@Component({
  selector: 'app-pfm',
  templateUrl: './pfm.component.html',
  styleUrls: ['./pfm.component.css']
})
export class PfmComponent implements OnInit {

  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  public chartOptions: Partial<ChartOptions>;
  public chartOptionsSub: Partial<ChartOptions>[] = [];
  public barOptions: Partial<BarChartOptions>;
  public bubbleOptions: Partial<BubbleChartOptions>;
  public donutOptions: Partial<DonutChartOptions>;

  constructor(private observer: BreakpointObserver, private transactionService: TransactionsService, public matDialog: MatDialog, private categoriesService: CategoriesService, private analyticsService: AnalyticsService) {

    //tree map
    this.chartOptions = {
      series: [{data: []}],
      legend: { show: false },
      chart: { toolbar: { show: false },
        height: 400,
        offsetX: 12,
        type: "treemap",
      },
      colors: [ "#0A8AD2", "#029c1b", "#1d466d", "#db5c07", "#787878",  "#EC3C65", "#CDD7B6", "#C1F666", "#D43F97", "#1E5D8C", "#421243", "#7F94B0", "#EF6537", "#C0ADDB"],
      plotOptions: { treemap: { distributed: true, enableShades: false } }
    };

    //bar chart
    this.barOptions = {
      series: [
        {
          name: "USD",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 400,
        toolbar: {show: false}
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      tooltip: {
        x: {show: false}
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
        labels: {
          show: this.isMobile() ? false : true
        }
      }
    }

    //bubble chart
    this.bubbleOptions = {
      series: [],
      chart: {
        height: 400,
        type: "bubble",
        toolbar: {show: false}
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      xaxis: {
        tickAmount: 10,
        min: 1,
        max: 20,
        type: "numeric",
        labels: {
          show: false,
          rotate: 0
        }
      },
      yaxis: {
        max: 40,
        show: false,
      },
      theme: {
        palette: "palette2"
      },
      tooltip: {
        x: {show: false},
        y: {
          formatter: (seriesData) => '',
          title: {
              formatter: (seriesName) => seriesName,
          },
        },
        z: {title: '', formatter: (seriesData) => seriesData.toFixed(2) + " USD"}
      }
    };

    //donut chart
    this.donutOptions = {
      series: [],
      chart: {
        width: 380,
        type: "donut",
        dropShadow: {
          enabled: true,
          color: "#0A8AD2",
          top: -1,
          left: 1,
          blur: 3,
          opacity: 0.1
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        x: {show: false},
        y: {
          formatter: (seriesData) => '',
          title: {
              formatter: (seriesName) => seriesName,
          },
        },
        z: {title: '', formatter: (seriesData) => seriesData.toFixed(2) + " USD"}
      },
      fill: {
        type: "gradient"
      },
      options: {
        plotOptions: {
          pie: {
            customScale: 1.8,
            donut: {
              labels: {
                show: true,
                total : {
                  show: true,
                  showAlways: true,
                  fontSize: "900",
                  label: 'total',
                },
                name: {
                  show: true,
                  formatter: () => "TOTAL"
                }, 
                value: {
                  show: true,
                  formatter: () => "TOTAL"
                }
              }
            }
          }
        }
      },
      labels: [],
      theme: {
        palette: 'palette2'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 1310px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  

  public generateData(size) {
    var i = 0;
    var series = [];
    while (i < 1) {
      var x = Math.floor(Math.random() * (17 - 3 + 1)) + 3;
      var y = parseFloat(size.toFixed(2)) + 5;
      console.log(y)
      var z = size + 20;

      series.push([x, y, z]);
      i++;
    }
    return series;
  }

  isMobile() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 768;
  }

  showMoneySign() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 1400;
  }

  showChooseView() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 750;
  }

  showButtons() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 590;
  }

  showCategorizing() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 690;
  }

  //organize pages
  lowValue: number = 0;
  highValue: number = 5;

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  //dates from datepicker
  dateFrom: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  dateTo: Date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  //categories for charts
  allCategories: Category[] = [];

  //get all categories
  getAllCategories() {
    this.allCategories = [];

    this.categoriesService.getAllCategories().subscribe(response=>{
      response['items'].forEach(item=>{
        let new_c = new Category();
        new_c.code = item.code;
        new_c.name = item.name;
        new_c.parent_code = (item['parent-code'] == null) ? "" : item['parent-code'];
        new_c.total_amount = 0;
        this.allCategories.push(new_c);
      })
    })
  }

  //save total ammount for donut
  donutTotal = 0;

  //error component for dates
  show_error(message) {
    localStorage.setItem('message', JSON.stringify(message));
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight = '100px';
    dialogConfig.minWidth = '250px';

    const modalDialog = this.matDialog.open(ErrorComponent, dialogConfig);
  }

  incorrect_dates: boolean = false;

  //filter analytics by dates (used in constructor and in filter - to get analytics for charts)
  getAnalyticsByDate(dateFrom, dateTo) {

    console.log(dateFrom, dateTo)

    if(dateFrom == null || dateTo == null) {
      dateFrom = ""; dateTo = "";
    }
    else if(parseInt(dateFrom.getTime()) > (dateTo.getTime())) {
      this.incorrect_dates = true;
      this.show_error("Dates are not chosen correctly!");
    }
    else {
    
      this.incorrect_dates = false;

      this.topLevel = [];
      this.allCategories = [];

      let dateFromFormat = "";
      let dateToFormat = "";

      if(dateFrom != "" && dateTo != "") {
        dateFromFormat = dateFrom.getFullYear() + "-" + (dateFrom.getMonth().toString()).padStart(2, '0') + "-" + (dateFrom.getDate().toString()).padStart(2, '0') + "T00:00:00.00Z";
        dateToFormat = dateTo.getFullYear() + "-" + (dateTo.getMonth().toString()).padStart(2, '0') + "-" + (dateTo.getDate().toString()).padStart(2, '0') + "T00:00:00.00Z";
      }

    //assign to each category its spendings
    this.analyticsService.getAnalytics(dateFromFormat, dateToFormat).subscribe(data=>{
      console.log(data)
      data['groups'].forEach(item=>{
        this.allCategories.forEach(category => {
          if(item.catcode == category.code) {
            category.total_amount = item.ammount;
          }
        })
      })
      
      //write data to top-level charts and save top-level codes in array
      let index = 0;
      this.allCategories.forEach(category=>{
        let amountString = "";
        if(category.total_amount != 0) {amountString = category.total_amount.toString();}
        if(category.parent_code == "" && category.total_amount != 0) {
          this.chartOptions.series[0].data[index] = {'x' : category.name, 'y' : amountString}; //tree-map chart
          this.barOptions.series[0].data[index] = category.total_amount; //bar chart
          this.barOptions.xaxis.categories[index] = category.name;
          this.bubbleOptions.series[index] = {'name' : category.name, 'data' : this.generateData(category.total_amount * 100 / 1000)}; //bubble chart
          this.donutOptions.series[index] = category.total_amount; //donut chart
          this.donutOptions.labels[index] = category.name;
          this.donutTotal += parseInt((category.total_amount).toFixed(2));
          this.topLevel[index] = category.code;
          index++;
        }
      })
      this.chartOptions.chart.events= {
        dataPointSelection: (event, chartContext, config) => {
          this.enable_subcategories = true;
            this.enableChart = config.dataPointIndex;
        }
      }

      //go through top-level codes array and for each element list their subcategories and write data to their charts, also create subcategory chart if it doesn't exist
      let indexLevel = 0;
      this.topLevel.forEach(toplevel => {
        let indexGeneral = 0;
        this.chartOptionsSub[indexLevel] = {
          series: [{data: []}],
          legend: { show: false },
          chart: { toolbar: { show: false },
            height: 400,
            offsetX: 18,
            type: "treemap"
          },
          title: {
            text: "SUBCATEGORIES",
            align: "center",
            margin: 40,
            offsetY: 20,
            style : {
              color: "#0A8AD2",
              fontFamily: 'Lucida Sans Regular',
            }
          },
          colors: [ "#0A8AD2", "#029c1b", "#1d466d", "#db5c07", "#787878",  "#EC3C65", "#CDD7B6", "#C1F666", "#D43F97", "#1E5D8C", "#421243", "#7F94B0", "#EF6537", "#C0ADDB"],
          plotOptions: { treemap: { distributed: true, enableShades: false } }
        }
        this.allCategories.forEach(category => {
          let amountString = "";
          if(category.total_amount != 0) amountString = (category.total_amount).toFixed(2).toString() + " USD";
          if(toplevel == category.parent_code && category.total_amount != 0) {
            this.chartOptionsSub[indexLevel].series[0].data[indexGeneral] = {'x' : category.name, 'y' : amountString};
            indexGeneral++;
          }
        })
        indexLevel++;
      })

    })
  }
  }

  //enable chart based on clicked category
  enableChart: number = -1; 
  enable_subcategories: boolean = false;

  //top-level categories that are shown
  topLevel: string[] = [];

  ngOnInit() {

    //empty categories, top level spendings and all categories
    this.items = [];
    this.topLevel = [];
    this.allCategories = [];

    //fetch all categories
    this.getAllCategories();

    //get analytics
    this.getAnalyticsByDate(this.dateFrom, this.dateTo);

    //filter by date
    let dateFromFormat = "";
    let dateToFormat = "";

    if(this.dateFrom != null && this.dateTo != null) {
      dateFromFormat = this.dateFrom.getFullYear() + "-" + ((this.dateFrom.getMonth() + 1).toString()).padStart(2, '0') + "-" + (this.dateFrom.getDate().toString()).padStart(2, '0') + "T00:00:00.00Z";
      dateToFormat = this.dateTo.getFullYear() + "-" + ((this.dateTo.getMonth() + 1).toString()).padStart(2, '0') + "-" + (this.dateTo.getDate().toString()).padStart(2, '0') + "T00:00:00.00Z";
    }

    //get all transactions
    this.transactionService.getTransactionsFiltered(this.transaction_type, dateFromFormat, dateToFormat).subscribe(data=>{

      this.page_size = data['page-size'];
      this.page = data['page'];
      this.total_count = data['total-count'];
      this.sort_by = data['sort-by'];
      this.sort_order = data['sort-order'];

      data['items'].forEach(item=>{
        let new_t = new Transaction();
        new_t.id = item.id;
        new_t.beneficiary_name = item['beneficiary-name'];
        new_t.date = item.date.toString().substring(8, 10) + "." + item.date.toString().substring(5, 7) + "." + item.date.toString().substring(0, 4);
        new_t.direction = item.direction;
        new_t.amount = item.amount + " USD";
        new_t.description = item.description;
        new_t.currency = item.currency;
        item.mcc == null ? new_t.mcc = 0 : new_t.mcc = item.mcc;
        new_t.kind = item.kind;
        if(item.catcode) new_t.catcode = item.catcode;
        else new_t.catcode = "";
        if(new_t.catcode) {
          this.allCategories.forEach(cat => {
            if(new_t.catcode == cat.code) new_t.catname = cat.name;
          })
        }
        if(item.splits.length != 0) {
        item.splits.forEach(split => {
            let newSplit = new SingleCategorySplit();
            newSplit.amount = split.amount;
            newSplit.catcode = split.catcode;
            newSplit.catname = "";
            if(split.catcode != "") {
              this.allCategories.forEach(ca => {
                if(split.catcode == ca.code) newSplit.catname = ca.name;
              })
            }
            new_t.splits.push(newSplit);
          })
        }
        else new_t.splits = [];
        this.items.push(new_t)
      })
      this.dataSource = new MatTableDataSource(this.items)
      this.dataSource.paginator = this.paginator;
    })
  }

  //not important info on transactions
  page_size: number;
  page: number;
  total_count: number;
  sort_by: string;
  sort_order: string;

  //list of transactions
  items: Transaction[] = [];

  //page info
  pageOfItems: Transaction[];

  //parameter for filtering
  transaction_type: string = "";

  //show categorizing button
  categorizing_in_process = false;

  start_categorizing() {
    this.categorizing_in_process = true;
  }

  stop_categorizing() {
    this.categorizing_in_process = false;
  }

  stop_categorizing_clear() {
    this.items.forEach(item=>{
      item.selected = false;
    })
  }

  //categorize single transaction
  choose_single_category(item) {
    localStorage.setItem('length', JSON.stringify(1));
    localStorage.setItem('transactions', JSON.stringify([item]));
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight = '450px';
    dialogConfig.minWidth = '250px';

    const modalDialog = this.matDialog.open(ChooseCategoryComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(res => {
      this.items.forEach(item => {
        if(item.id == res.data[0].id) {
          item.catcode = res.data[0].catcode;
          item.catname = res.data[0].catname;
        }
      })
    })
  }

  split_transaction(transaction) {
    localStorage.setItem('transaction', JSON.stringify(transaction));
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.minHeight = '300px';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.maxWidth = '100vw';

    const modalDialog = this.matDialog.open(SplitComponent, dialogConfig);

    modalDialog.afterClosed().subscribe(res => {
      this.items.forEach(item => {
        if(item.id == res.data.id) {
          item.splits = res.data.splits;
        }
      })
    })
  }

  //show splits if they exist
  showSplits(transaction) {
    localStorage.setItem('splitTransaction', JSON.stringify(transaction));
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.minHeight = '100px';
    dialogConfig.minWidth = '250px';

    const modalDialog = this.matDialog.open(SplitsComponent, dialogConfig);
  }


  //categorize multiple transactions
  choose_multiple_category() {
    let selected_items = [];
    this.items.forEach(item=>{
      if(item.selected) selected_items.push(item);
    })

    if(selected_items.length > 0) {
      localStorage.setItem('length', JSON.stringify(selected_items.length));
      localStorage.setItem('transactions', JSON.stringify(selected_items));
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.minHeight = '450px';
      dialogConfig.minWidth = '300px';

      const modalDialog = this.matDialog.open(ChooseCategoryComponent, dialogConfig);

      modalDialog.afterClosed().subscribe(res => {
        for(let i = 0; i < res.data.length; i++) {
            this.items.forEach(item => {
              item.selected = false;
              if(res.data[i].id == item.id) {
                item.catcode = res.data[i].catcode;
                item.catname = res.data[i].catname;
              }
            })
        }
        this.categorizing_in_process = false;
      })
    }
  }

  //update transaction type
  selectTransactionType(value) {
    this.transaction_type = value;
  }

  //on filter transactions button click
  filter() {

    //empty current lists and get new data
    this.allCategories = [];
    this.topLevel = [];
    
    //update charts if dates are changed
    this.getAllCategories();
    this.getAnalyticsByDate(this.dateFrom, this.dateTo);

    let dateFromFormat = "";
    let dateToFormat = "";

    if(this.dateFrom != null && this.dateTo != null) {
      dateFromFormat = this.dateFrom.getFullYear() + "-" + ((this.dateFrom.getMonth() + 1).toString()).padStart(2, '0') + "-" + (this.dateFrom.getDate().toString()).padStart(2, '0') + "T00:00:00.00Z";
      dateToFormat = this.dateTo.getFullYear() + "-" + ((this.dateTo.getMonth() + 1).toString()).padStart(2, '0') + "-" + (this.dateTo.getDate().toString()).padStart(2, '0') + "T00:00:00.00Z";
    }

    //update list of transactions if type has changed
    if(this.incorrect_dates == false) this.transactionService.getTransactionsFiltered(this.transaction_type, dateFromFormat, dateToFormat).subscribe(data=>{
      this.items = [];
      this.page_size = data['page-size'];
      this.page = data['page'];
      this.total_count = data['total-count'];
      this.sort_by = data['sort-by'];
      this.sort_order = data['sort-order'];
      data['items'].forEach(item=>{
        let new_t = new Transaction();
        new_t.id = item.id;
        new_t.beneficiary_name = item['beneficiary-name'];
        new_t.date = item.date.toString().substring(8, 10) + "." + item.date.toString().substring(5, 7) + "." + item.date.toString().substring(0, 4);
        new_t.direction = item.direction;
        new_t.amount = item.amount + " USD";
        new_t.description = item.description;
        new_t.currency = item.currency;
        item.mcc == null ? new_t.mcc = 0 : new_t.mcc = item.mcc;
        new_t.kind = item.kind;
        if(item.catcode) new_t.catcode = item.catcode;
        else new_t.catcode = "";
        if(new_t.catcode) {
          this.allCategories.forEach(cat => {
            if(new_t.catcode == cat.code) new_t.catname = cat.name;
          })
        }
        if(item.splits) {
        item.splits.forEach(split => {
            let newSplit = new SingleCategorySplit();
            newSplit.amount = split.amount;
            newSplit.catcode = split.catcode;
            newSplit.catname = "";
            if(split.catcode != "") {
              this.allCategories.forEach(ca => {
                if(split.catcode == ca.code) newSplit.catname = ca.name;
              })
            }
            new_t.splits.push(newSplit);
          })
        }
        else new_t.splits = [];
        this.items.push(new_t)
      })
      this.dataSource = new MatTableDataSource(this.items)
      this.dataSource.paginator = this.paginator;
    })
  }

  //data displayed on page
  user_data = {
    "account_number" : "1234 56678 89056",
    "available_ballance" : "12,340.000,00"
  }

  //update paginator
  onChangePage(pageOfItems) {
    this.pageOfItems = pageOfItems;
  }

  //views
  current_view: string = "list";   
  
  change_view(view) {
    this.enable_subcategories = false;
    this.current_view = view;
  }

}


