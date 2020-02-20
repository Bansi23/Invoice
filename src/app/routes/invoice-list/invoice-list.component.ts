import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { CreateInvoicesComponent } from '../create-invoices/create-invoices.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {

  lstInvoices: any = [];
  invoice: any = [];
  total: any;
  item: any;
  data: any = [];
  lstitem: any = [];

  @ViewChild('invoiceDetails') invoiceDetail: ModalDirective;
  invoiceLink(invoiceNo) {
    this.invoiceDetail.show();
    this.invoice = this.lstInvoices.filter((item) => item.invoices == invoiceNo);
    for (let i = 0; i < this.invoice.length; i++) {
      this.item = this.invoice[i].itemRows;
    }
    this.total = this.item.map(o => o.amount).reduce((a, c) => a + c);
  }
  editRecord(i) {
    this.data = this.lstInvoices[i];
    localStorage.setItem('index', this.data.invoices);
    this.lstitem = localStorage.getItem('Idata');
    this._router.navigate(['/createinvoices']);
  }

  close() {
    this.invoiceDetail.hide();
  };

  constructor(private _router: Router, private _cS: CommonService) { }
  ngOnInit() {
    if (localStorage.getItem("Indata") != null) {
      this.lstInvoices = JSON.parse(localStorage.getItem("Indata"));
    }
  }
}
