import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Transaction } from 'igniteui-angular';
import { SingleCategorySplit } from 'src/app/models/SingleCategorySplit';

@Component({
  selector: 'app-splits',
  templateUrl: './splits.component.html',
  styleUrls: ['./splits.component.css']
})
export class SplitsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SplitsComponent>) { }

  ngOnInit(): void {
    let trans = JSON.parse(localStorage.getItem('splitTransaction'))
    trans['splits'].forEach(split => {
      let new_s = new SingleCategorySplit();
      new_s.catname = split['catname']
      new_s.amount = split['amount']
      this.splits.push(new_s)
    })
    console.log(this.splits)
  }

  splits: SingleCategorySplit[] = [];

  close() {
    this.dialogRef.close();
  }

}
