import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:5000';

  getAnalytics(dateFrom, dateTo) {
    return this.http.get(`${this.url}/spending-analytics`, { params: {'start-date': dateFrom, 'end-date': dateTo}});
  }

}
