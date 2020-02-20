import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  // val = 5;

  // increment(){
  //   this.val++;
  // }

  lstItemData: any = [];
  updateIndex: number = -1;
  editData: any = null;
  isdisabled: boolean = true;
  isChecked: boolean = true;
  isexist: boolean = false;
  lstexistRec: any = [];
  @ViewChild('addRecord') addRecordModal: ModalDirective;
  itemForm: FormGroup;
  existRec: any;
  itemRec: any;

  fbItem() {
    this.itemForm = this.fb.group({
      iname: ['', Validators.compose([Validators.required, Validators.pattern('[a-z A-Z]*')])],
      rate: [null, Validators.compose([Validators.required, Validators.pattern('^[1-9]\d{0,7}(?:\.\d{1,4})?|\.\d{1,4}$')])],
    });
  }

  DeleteRecord(index) {
    this.isexist = false;
    this.lstexistRec = [];
    this.lstexistRec = JSON.parse(localStorage.getItem('addItem'));
    if (this.lstexistRec != null && this.lstexistRec.length > -1) {
      for (let i = 0; i < this.lstexistRec.length; i++) {
        const element = this.lstexistRec[i].id;
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
        for (let i = 0; i < this.lstItemData.length; ++i) {
          if (this.lstItemData[i].id == index) {
            this.lstItemData.splice(i, 1);
            localStorage.setItem("Idata", JSON.stringify(this.lstItemData));
          }
        }
      }
    }
  }
  AddRecordModal() {
    this.itemForm.reset();
    this.addRecordModal.show();
  }

  add_Record() {
    for (let val in this.itemForm.controls) {
      this.itemForm.controls[val].markAsTouched();
    }
    if (this.itemForm.valid) {
      let IForm = this.itemForm.value;
      const index = this.lstItemData.findIndex(x => x.id == IForm.id);
      if (index > -1) {
        this.lstItemData.splice(index, 1, IForm);
      } else {
        IForm.id = this.lstItemData.length + 1;
        IForm.iname = IForm.iname.toUpperCase().trim();
        this.existRec = this.lstItemData.find((item) => item.iname.toUpperCase().trim() == IForm.iname.toUpperCase().trim());
        if (this.existRec) {
          alert('This Item is arleady added');
        }
        else {
          IForm.rate = +IForm.rate;
          this.lstItemData.push(IForm);
        }
        localStorage.setItem("Idata", JSON.stringify(this.lstItemData));
      }
      this.close();
    }
  }
  editRecord(index, id) {
    this.isexist = false;
    this.lstexistRec = [];
    this.lstexistRec = JSON.parse(localStorage.getItem('addItem'));
    if (this.lstexistRec != null && this.lstexistRec.length > -1) {
      for (let i = 0; i < this.lstexistRec.length; i++) {
        const element = this.lstexistRec[i].id;
        if (element == id) {
          this.isexist = true;
          break;
        }
      }
    }
    if (this.isexist) {
      alert('Can not edit this record it added in invoices ');
    }
    else {
      this.updateIndex = index;
      if (index > -1) {
        let data = this.lstItemData[index];
        this.itemRec = this.lstItemData[index].iname;
        data.rate = +data.rate;
        this.lstItemData[index] = {
          id: data.id,
          iname: data.iname,
          rate: data.rate,
        }
        this.editData = {
          id: data.id,
          iname: data.iname,
          rate: data.rate,
        }
      }
      localStorage.setItem("Idata", JSON.stringify(this.lstItemData));
    }
  }
  editRec: any;
  saveChange(index) {
    if (this.itemForm.valid) {
      let data = this.lstItemData[index];
      let body = {
        id: data.id,
        iname: data.iname,
        rate: +data.rate,
      }
      this.existRec = this.lstItemData.find((item) => item.iname.toUpperCase().trim() == body.iname.toUpperCase().trim());
      console.log('this.existRec', this.existRec)
      if (this.existRec && (this.existRec.iname.toUpperCase().trim() == body.iname.toUpperCase().trim())) {
        if (this.existRec.rate == body.rate) {
          this.lstItemData[index] = body;
          this.updateIndex = -1;
          localStorage.setItem("Idata", JSON.stringify(this.lstItemData));
        } else {
          alert('This Item is arleady added');
        }
      }
    }
  }

  cancelEdit(index) {
    this.lstItemData[index] = this.editData;
    this.editData = null;
    this.updateIndex = -1;
  };
  deleteAll() {
    if (!this.lstInvoices.length) {
      if (this.lstItemData != 0) {
        if (confirm(" Are you sure you want to delete All Record?")) {
          this.lstItemData = [];
          localStorage.setItem("Idata", JSON.stringify(this.lstItemData));
        }
      }
      else if (this.lstItemData == 0) {
        alert('No record Found');
      }
    }
    else if (this.lstInvoices.length) {
      alert('Can not delete some Item invoice added')
    }
  };
  close() {
    this.addRecordModal.hide();
  };

  lstInvoices: any = [];
  constructor(private _cS: CommonService, private fb: FormBuilder) { }
  ngOnInit() {
    this.fbItem(); // validation
    if (localStorage.getItem("Idata") != null) {
      this.lstItemData = JSON.parse(localStorage.getItem("Idata"));
    }
    else {
      this.lstItemData = this._cS.itemData(); // service data
    }

    //  if (localStorage.getItem("Idata") == null) {
    this.lstItemData.map(x => {
      const addedItem = localStorage.getItem('addItem');
      console.log(addedItem, 'addedItem')
      x.isselect = this.isChecked;
      if (addedItem) {
        x.isselect = true;
      }
      else {
        x.isselect = false;
      }
    });
    //    }


    if (localStorage.getItem("Indata") != null) {
      this.lstInvoices = JSON.parse(localStorage.getItem("Indata"));
    }
  }

}
