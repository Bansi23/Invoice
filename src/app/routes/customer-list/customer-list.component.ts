import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../common.service';
import { environment } from '../../../environments/environment';

const emailPattern = environment.emailPattern;

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  lstCustomerData: any = [];
  updateIndex: number = -1;
  editData: any = null;
  customerLocalData: any = [];
  @ViewChild('addRecord') addRecordModal: ModalDirective;
  customerForm: FormGroup;
  fbCustomer() {
    this.customerForm = this.fb.group({
      cname: [null, Validators.required],
      address: ['', Validators.required],
      mono: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]\\d{9}')])],
      mail: ['', Validators.compose([Validators.required, Validators.pattern(emailPattern)])],
    });
  }
  lstexistrec: any = [];

  isexist: boolean = false;
  DeleteRecord(index) {
    this.isexist = false;
    if (this.lstInvoices != null && this.lstInvoices.length > -1) {
      for (let i = 0; i < this.lstInvoices.length; i++) {
        const element = this.lstInvoices[i].cname.id;
        if (element == index) {
          this.isexist = true;
          break;
        }
      }
    }
    if (this.isexist) {
      alert('Can not delete this Record');
    }
    else {
      if (confirm(" Are you sure you want to delete this record?")) {
        for (let i = 0; i < this.lstCustomerData.length; ++i) {
          if (this.lstCustomerData[i].id == index) {
            this.lstCustomerData.splice(i, 1);
            localStorage.setItem("Cdata", JSON.stringify(this.lstCustomerData));
          }
        }
      }
    }
  }

  AddRecord() {
    this.customerForm.reset();
    this.addRecordModal.show();
  }

  existRec: any
  CustRec: any;
  add_Record() {
    for (let val in this.customerForm.controls) {
      this.customerForm.controls[val].markAsTouched();
    };
    if (this.customerForm.valid) {
      let Cform = this.customerForm.value;
      const index = this.lstCustomerData.findIndex(x => x.id == Cform.id);
      if (index > -1) {
        this.lstCustomerData.splice(index, 1, Cform);
      } else {
        Cform.id = (new Date()).getTime();
        Cform.mono = +Cform.mono;
        this.existRec = this.lstCustomerData.find((item) => item.mono == Cform.mono);
        if (this.existRec) {
          alert('This Mobile Number is arleady added');
        }
        else {
          Cform.mono = +Cform.mono;
          this.lstCustomerData.push(Cform);
        }
        localStorage.setItem("Cdata", JSON.stringify(this.lstCustomerData));
      }
      this.close();
    }
  }

  editRecord(index) {
    this.updateIndex = index;
    if (index > -1) {
      let data = this.lstCustomerData[index];
      this.CustRec = this.lstCustomerData[index].mono;
      this.lstCustomerData[index] = {
        id: data.id,
        cname: data.cname,
        mono: data.mono,
        mail: data.mail,
        address: data.address
      }
      this.editData = {
        id: data.id,
        cname: data.cname,
        mono: data.mono,
        mail: data.mail,
        address: data.address
      }
    }
    localStorage.setItem("Cdata", JSON.stringify(this.lstCustomerData));
  };

  editRec: any;
  saveChange(index) {
    if (this.customerForm.valid) {
      let data = this.lstCustomerData[index];
      let body = {
        id: data.id,
        cname: data.cname,
        mono: data.mono,
        mail: data.mail,
        address: data.address,
      };
      this.CustRec = this.lstCustomerData.find((item) => item.mono == body.mono);
      if (this.CustRec && (this.CustRec.mono == body.mono)) {
        if (this.CustRec.cname == body.cname && this.CustRec.mail == body.mail && this.CustRec.address == body.address) {
          this.lstCustomerData[index] = body;
          this.updateIndex = -1;
          localStorage.setItem("Cdata", JSON.stringify(this.lstCustomerData));
        } else {
          alert('This Mobile is arleady added');
        }
      }
    }
  };

  cancelEdit(index) {
    this.lstCustomerData[index] = this.editData;
    this.editData = null;
    this.updateIndex = -1;
  }

  deleteAll() {
    if (!this.lstInvoices.length) {
      if (this.lstCustomerData != 0) {
        if (confirm(" Are you sure you want to delete All Record?")) {
          this.lstCustomerData = [];
          localStorage.setItem("Cdata", JSON.stringify(this.lstCustomerData));
        }
      }
      else if (this.lstCustomerData == 0) {
        alert(' Record Not Found');
      }
    }
    else if (this.lstInvoices.length) {
      alert('Can not delete some record invoice added');
    }

  }

  close() {
    this.addRecordModal.hide();
  }

  lstInvoices: any = [];
  constructor(private _cS: CommonService, private fb: FormBuilder) { }
  ngOnInit() {
    this.fbCustomer();
    if (localStorage.getItem("Cdata") != null) {
      this.lstCustomerData = JSON.parse(localStorage.getItem("Cdata"));
    }
    else {
      this.lstCustomerData = this._cS.customerData(); // service data
    }
    if (localStorage.getItem("Indata") != null) {
      this.lstInvoices = JSON.parse(localStorage.getItem("Indata"));
    }
  }
}
