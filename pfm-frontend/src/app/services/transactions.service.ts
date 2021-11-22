import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SplitCommand } from '../models/SplitCommand';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:5000';

  getAllTransactions() {
    return this.http.get(`${this.url}/transactions`, { params: {'page-size': 100, 'sort-by' : 'date', 'sort-order' : 'desc' } });
  }

  getTransactionsFiltered(type, dateFrom, dateTo) {
    console.log(type, dateFrom, dateTo)
    if(type != "" && dateFrom != "" && dateTo != "") return this.http.get(`${this.url}/transactions`, { params: {'page-size': 100, 'transaction-kind': type, 'start-date': dateFrom, 'end-date' : dateTo, 'sort-by' : 'date', 'sort-order' : 'desc' }});
    else if(type != "") return this.http.get(`${this.url}/transactions`, { params: {'page-size': 100, 'transaction-kind': type, 'sort-by' : 'date', 'sort-order' : 'desc' }});
    else if(dateFrom != "" && dateTo != "") return this.http.get(`${this.url}/transactions`, { params: {'page-size': 100, 'start-date': dateFrom, 'end-date' : dateTo, 'sort-by' : 'date', 'sort-order' : 'desc' }});
    else return this.http.get(`${this.url}/transactions`, { params: {'page-size': 100, 'sort-by' : 'date', 'sort-order' : 'desc' } });
  }

  splitTransaction(id, splitsAr) {
    const data = {
      splits : []
    }
    data.splits = splitsAr
    console.log(data)
    return this.http.post(`${this.url}/transactions/${id}/split`, data);
  }
}
