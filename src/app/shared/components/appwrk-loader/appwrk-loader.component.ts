import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'Appwrk-loader',
  templateUrl: './appwrk-loader.component.html',
  styleUrls: ['./appwrk-loader.component.scss']
})
export class AppwrkLoaderComponent implements OnInit {

  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  diameter = 30;

  constructor() { }

  ngOnInit(): void {
  }

}
