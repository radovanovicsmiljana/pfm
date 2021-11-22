import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/models/Category';
import { SingleCategorySplit } from 'src/app/models/SingleCategorySplit';
import { SplitCommand } from 'src/app/models/SplitCommand';
import { Transaction } from 'src/app/models/Transaction';
import { CategoriesService } from 'src/app/services/categories.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css']
})
export class SplitComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SplitComponent>, private categoriesService: CategoriesService, public matDialog: MatDialog, private transactionsService: TransactionsService) { }

  ngOnInit(): void {
    this.transaction = JSON.parse(localStorage.getItem('transaction') || '{}');
    localStorage.setItem('split', JSON.stringify(2));

    let split1 = new SingleCategorySplit();
    split1.catcode = "";
    split1.subcode = "";
    split1.disabled_sub = true;
    split1.id = 0;
    split1.subs = [];
    this.splits_available.push(split1);
    
    let split2 = new SingleCategorySplit();
    split2.catcode = "";
    split2.subcode = "";
    split2.disabled_sub = true;
    split2.id = 1;
    split2.subs = [];
    this.splits_available.push(split2);

    this.categories = [];
    this.subcategories = [];
    this.categoriesService.getAllCategories().subscribe(response=>{
      response['items'].forEach(item=>{
        if(item['parent-code'] == null || item['parent-code'] == "") {
          let new_c = new Category();
          new_c.code = item.code;
          new_c.name = item.name;
          new_c.parent_code = "";
          this.categories.push(new_c);
        }
        else {
          let new_c = new Category();
          new_c.code = item.code;
          new_c.name = item.name;
          new_c.parent_code = item['parent-code'];
          this.subcategories.push(new_c);
        }
      })
    })
  }

  transaction: Transaction;

  categories: Category[] = [];
  subcategories: Category[] = [];

  splits_available: SingleCategorySplit[] = [];

  sum: number = 0;
  splitToSend: SplitCommand[] = [];
  split() {
    let noData = false;
    let noNum = false;
    this.sum = 0;
    this.splitToSend = [];
    this.splits_available.forEach(split=>{
      if(split.amount != null) this.sum += parseFloat(split.amount.toString());
    })
    if(this.sum != this.parseAmount(this.transaction.amount)) {
      this.show_error("Sum of amounts from split transactions must be equal to amount of original transaction!");
    }
    else {this.splits_available.forEach(split => {
      let new_s = new SplitCommand();
      split.subcode != "" ? new_s.catcode = split.subcode : split.catcode != "" ? new_s.catcode = split.catcode : new_s.catcode = "";
      if(new_s.catcode != "" && split.amount != null && split.amount != 0) {
        new_s.amount = parseFloat(split.amount.toString());
        this.splitToSend.push(new_s);
      }
      else if(new_s.catcode == "") noData = true;
      else if(split.amount == null) noNum = true;
    })
    if(noData) this.show_error("You have to choose a category for each split!");
    else if(noNum) this.show_error("You have to choose amount for each split!");
    else this.transactionsService.splitTransaction(this.transaction.id, this.splitToSend).subscribe(response=>{
      this.transaction.splits = [];
      let i = 0;
      this.splitToSend.forEach(spl => {
        this.transaction.splits[i] = new SingleCategorySplit();
        this.transaction.splits[i].amount = spl.amount;
        this.transaction.splits[i].catcode = spl.catcode;
        this.categories.forEach(cat => {
          if(cat.code == spl.catcode) this.transaction.splits[i].catname = cat.name;
        })
        this.subcategories.forEach(sub => {
          if(sub.code == spl.catcode) this.transaction.splits[i].catname = sub.name;
        })
        i++;
      })
      this.close();
    })}
  }

  show_error(message) {
    localStorage.setItem('message', JSON.stringify(message));
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight = '100px';
    dialogConfig.minWidth = '300px';

    const modalDialog = this.matDialog.open(ErrorComponent, dialogConfig);
  }

  parseAmount(amount) {
    let num_part = amount.split(' ')[0];
    let num = parseFloat(num_part);
    return num;
  }

  add_split() {
    let new_s = new SingleCategorySplit();
    new_s.catcode = "";
    new_s.subcode = "";
    new_s.disabled_sub = true;
    new_s.subs = [];
    new_s.id = parseInt(JSON.parse(localStorage.getItem('split')))
    localStorage.setItem('split', JSON.stringify(new_s.id + 1));
    this.splits_available.push(new_s);
  }

  close_split(id) {
    let index = 0;
    let id_to_remove = -1;
    this.splits_available.forEach(split=>{
      if(split.id == id) id_to_remove = index;
      index++;
    })
    this.splits_available.splice(id_to_remove, 1);
  }

  onChange(value, split_id) {
    if(value != "Choose category") {
      this.splits_available.forEach(split=>{
        if(split.id == split_id) {
          split.catcode = value;
          split.subs = [];
          split.disabled_sub = false;
          this.subcategories.forEach(sub=>{
            if(sub.parent_code == value) split.subs.push(sub)
          })
        }
      })
    }
  }

  onChangeSub(value, split_id) {
    if(value != "Choose subcategory (optional)") {
      this.splits_available.forEach(split=>{
        if(split.id == split_id) {
          split.subcode = value;
        }
      })
    }
  }

  close() {
    this.dialogRef.close({data: this.transaction});
  }

}
