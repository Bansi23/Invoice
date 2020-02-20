import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
  // @Input() val;

  // val: number = 1;
  // increment() {
  //   this.val++;
  // }


  constructor() { }

  ngOnInit() {
  }

}
