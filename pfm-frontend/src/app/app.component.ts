import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pfm-frontend';

  constructor(private router: Router) {
  }

  sidenav_data = {
    "title" : "telenor | banka",
    "items" : [
      ["HOME", "home"],
      ["MY ACCOUNTS", "attach_money"],
      ["PAYMENTS", "account_balance_wallet"],
      ["CARDS", "credit_card"],
      ["CURRENCY EXCHANGE", "compare_arrows"],
      ["PRODUCT CATALOGUE", "library_books"],
      ["PFM", "timeline"],
      ["SELF CARE", "settings"],
      ["SUPPORT", "contact_support"]
    ],
    "images" : [
      "home", "attach_money", "account_balance_wallet", "credit_card", "compare_arrows", "library_books", "timeline", "settings", "contact_support"
    ]
  }

  path = "Home";

  goTo(name: any) {
    if(name == "PFM") {
      this.path = "PFM";
      this.router.navigate(['pfm'])
    }
    else {
      this.path = "Home";
      this.router.navigate([''])
    }
  }
}
