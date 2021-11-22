import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:5000';

  getAllCategories() {
    return this.http.get(`${this.url}/categories`);
  }

  categorize(id, code) {
    console.log(code)
    const data = {
      catcode: code
    }
    return this.http.post(`${this.url}/transactions/${id}/categorize`, data);
  }

}
