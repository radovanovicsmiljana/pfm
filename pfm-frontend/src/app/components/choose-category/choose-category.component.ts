import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/models/Category';
import { Transaction } from 'src/app/models/Transaction';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-choose-category',
  templateUrl: './choose-category.component.html',
  styleUrls: ['./choose-category.component.css']
})
export class ChooseCategoryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ChooseCategoryComponent>, private categoriesService: CategoriesService) { }

  idT: number;

  ngOnInit(): void {

    //empty transactions array
    this.transactions = [];

    //get array of transactions for categorizing and length of that array
    this.length = parseInt(JSON.parse(localStorage.getItem('length') || '{}'));
    let ids = JSON.parse(localStorage.getItem('transactions') || '{}');
    
    //push transactions to transactions array - splits not included
    let length_temp = 0;
    while(length_temp < this.length) {
      
      let new_t = new Transaction();
      new_t.id = ids[length_temp].id;
      this.idT = new_t.id;
      new_t.beneficiary_name = ids[length_temp].beneficiary_name;
      new_t.direction = ids[length_temp].direction;
      new_t.amount = ids[length_temp].amount;
      new_t.description = ids[length_temp].description;
      new_t.currency = ids[length_temp].currency;
      ids[length_temp].mcc == ids[length_temp].mcc;
      new_t.kind = ids[length_temp].kind;
      new_t.catcode = ids[length_temp].catcode;
      new_t.catname = ids[length_temp].catname;
      this.transactions.push(new_t)

      length_temp++;
    }
    
    //set data that is shown on dialog
    this.length > 1 ? this.length_str = 'multiple' : this.length_str = 'single';

    //empty categories and subcategories array
    this.categories = [];
    this.subcategories = [];

    //get all categories and sort them either in categories or subcategories array
    this.categoriesService.getAllCategories().subscribe(response=>{
      response['items'].forEach(item=>{
        if(item['parent-code'] == null) {
          let new_c = new Category();
          new_c.code = item.code;
          new_c.name = item.name;
          new_c.parent_code = "";
          this.categories.push(new_c);
          if(this.length == 1 && this.transactions[0].catcode == item.code) {
            this.preselectedExist = true;
            this.disabled_sub = false;
            this.selected_category = item.code;
            this.selected_category_name = item.name;
            this.categories.splice(this.categories.indexOf(new_c), 1)
            this.categoriesService.getAllCategories().subscribe(su => {
              su['items'].forEach(suitem => {
                if(suitem['parent-code'] == this.selected_category) this.selected_subcategories.push(suitem);
              })
            })
          }
        }
        else {
          let new_c = new Category();
          new_c.code = item.code;
          new_c.name = item.name;
          new_c.parent_code = item['parent-code'];
          this.subcategories.push(new_c);
          if(this.length == 1 && this.transactions[0].catcode == item.code) {
            this.preselectedExist = true;
            this.disabled_sub = false;
            this.selected_subcategory = item.code;
            this.selected_subcategory_name = item.name;
            this.categoriesService.getAllCategories().subscribe(rs => {
              rs['items'].forEach(itm => {
                if(itm.code == new_c.parent_code) {
                  this.selected_category = itm.code;
                  this.selected_category_name = itm.name;
                  let x = null;
                  this.categories.forEach(caa => {
                    if(caa.code == itm.code) x = caa;
                  })
                  this.categories.splice(this.categories.indexOf(x), 1)
                  this.categoriesService.getAllCategories().subscribe(rss => {
                    rss['items'].forEach(itmm => {
                      if(itmm['parent-code'] == this.selected_category) this.selected_subcategories.push(itmm)
                    })
                    if(this.selected_subcategories.length != 0) {
                      this.selected_subcategories.forEach(selsub => {
                        if(selsub.code == this.selected_subcategory) this.selected_subcategories.splice(this.selected_subcategories.indexOf(selsub), 1)
                      })
                    }
                  })
                }
              })
            })
          }
        }
      })
    })
  }

  //if there are preselected categories
  preselectedExist: boolean = false;

  //transactions sent for categorizing, number of transactions
  transactions: Transaction[] = [];
  length: number;
  length_str: string;

  //subcategories are not shown if category is not selected
  disabled_sub: boolean = true;

  //all categories available
  categories: Category[] = [];
  
  //all subcategories available
  subcategories: Category[] = [];

  //subcategories that are shown for selected category
  selected_subcategories: Category[] = [];

  //selected category and subcategory for categorizing OR codes for previosly set categories
  selected_category: string = "";
  selected_subcategory: string = "";

  //names of previosly set categories
  selected_category_name: string = "Choose category"; ///ovde ubaciti vec odabranu kategoriju
  selected_subcategory_name: string = "Choose subcategory (optional)" ///ovde ubaciti vec odabranu potkategoriju

  //last category and last subcategory chosen for transaction
  lastCategory: string = "";
  lastSubcategory: string = "";
  isSub: boolean = true;

  //if category is selected, show all subcategories for that category in a dropdown
  onChange(value) {
    if(value != "Choose category") {
      this.preselectedExist = false;
      this.selected_subcategory = "";
      this.selected_subcategory_name = "";
      this.selected_category = value;
      this.categories.forEach(cat => {
        if(cat.code == this.selected_category) this.selected_category_name = cat.name;
      })
      this.selected_subcategories = [];
      this.disabled_sub = false;
      this.subcategories.forEach(item=>{
        if(item.parent_code == value) this.selected_subcategories.push(item)
      })
    }
  }

  //when subcategory is changed
  onChangeSub(value) {
    this.selected_subcategory = value;
    this.selected_subcategories.forEach(sub => {
      if(sub.code == this.selected_subcategory) this.selected_subcategory_name = sub.name;
    })
  }

  //list of updated transactions to send through dialogRef
  transToSend: Transaction[] = [];

  //categorizing
  categorize() {

    for(let i = 0; i < this.length; i++) {

      let trans = this.transactions.pop();
      let id_to_send = trans.id;
  
      if(this.selected_subcategory != "") {
        this.categoriesService.categorize(id_to_send, this.selected_subcategory.toString()).subscribe(response=>{
          trans.catcode = this.selected_subcategory;
          trans.catname = this.selected_subcategory_name;
          this.transToSend.push(trans);
          if(i == this.length-1) {this.close()}
        })
      }
      else if(this.selected_category != "") {
        this.categoriesService.categorize(id_to_send, this.selected_category).subscribe(response=>{
          trans.catcode = this.selected_category;
          trans.catname = this.selected_category_name;
          this.transToSend.push(trans)
          if(i == this.length-1) {this.close()}
        })
      }
    }
    
  }

  close() {
    this.dialogRef.close({data: this.transToSend});
  }

}
