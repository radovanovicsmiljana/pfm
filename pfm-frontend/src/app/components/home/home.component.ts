import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  user_data = {
    "name" : "Milana",
    "surname" : "Ognjenovic",
    "messages" : "12",
    "image" : "profile_photo.jpg"
  }

  isMobile() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 600;
  }

}
