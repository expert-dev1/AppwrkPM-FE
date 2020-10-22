import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'Appwrk-loading-button',
  templateUrl: './appwrk-loading-button.component.html',
  styleUrls: ['./appwrk-loading-button.component.scss']
})
export class AppwrkLoadingButtonComponent implements OnInit {

  @Input() text:string;
  @Input() color:string='warn';
  @Input() loading:any;
  @Input() data:any;
  @Output() onClickEvent = new EventEmitter<string>();
  loader;

  constructor() { }

  ngOnInit(): void {
    this.loader = this.loading == 'true' || this.loading == true ? true : false
    console.log(this.loading, this.loader)
  }


  onClick(){
    console.log("----------")
    this.onClickEvent.emit(this.data || true);
  }

}
