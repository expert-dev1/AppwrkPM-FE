import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'Appwrk-layout-div',
  templateUrl: './content-div.component.html',
  styleUrls: ['./content-div.component.scss']
})
export class ContentDivComponent implements OnInit {
  @Input() title;
  constructor() { }

  ngOnInit(): void {
  }

}
