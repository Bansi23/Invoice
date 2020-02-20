import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-create-invoices',
  templateUrl: './create-invoices.component.html',
  styleUrls: ['./create-invoices.component.scss']
})


export class CreateInvoicesComponent implements PipeTransform, OnInit {
  transform(val: any): string {
    let rval = '';
    if (val != null) {
      if (val('invalid') == true) {
        rval = 'invalid';
      }
      if (val('exists') == true) {
        rval = 'User allready exists!'
      }
    }
    return rval;
  }


  //#region proprerty
  invoicesForm: FormGroup;
  itemForm: FormGroup;
  Customer: any = [];
  Item: any = [];
  lstInvoice: any = [];
  readonlyText: boolean = true;
  selectedRow: any;
  NewItemArray: any = [];
  currencyCode = [{ 'id': 1, 'name': '%' }, { 'id': 2, 'name': '$' }]
  totalAmountRead: boolean = false;
  total: any = 0;
  Discount: any; shipping: any; discount_amount: any; NewPrice: any; shipping_charge: any; price: any;
  maxDate: any = new Date();
  index: any = 1;
  invoiceDate: any;
  dueDate: any;
  minDate: any = new Date();
  userData: any;
  edit: boolean = false;
  storeId: any = [];

  //#endregion

  //#region form group
  fbInvoices() {
    this.invoicesForm = this.fb.group({
      cname: ['', Validators.required],
      invoices: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]\\d{5}')])],
      orderno: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]*')])],
      indate: ['', Validators.required],
      duedate: ['', Validators.required],
      itemRows: this.fb.array([]),
      totalAmount: [0, Validators.required],
      discount: [null, Validators.compose([Validators.pattern('^[0-9]\d{0,7}(?:\.\d{1,4})?|\.\d{1,4}$')])],
      shippingCharge: [null, Validators.compose([Validators.pattern('^[0-9]\d{0,7}(?:\.\d{1,4})?|\.\d{1,4}$')])],
      currencyCode: ['%'],
      isAuto: false
    });
  }

  initItemRows() {
    for (let i = 0; i < this.Item.length; i++) {
      this.storeId = this.Item[i].id;
      return this.fb.group({
        id: this.index++,
        iname: [this.Item[0].iname, Validators.required],
        quantity: [1, Validators.required],
        rate: [this.Item[0].rate],
        amount: [this.Item[0].amount],
      });
    }
  }


  addedItem: any = [];
  getAddItem() {
    this.addedItem = [];
    for (let i = 0; i < this.lstInvoice.length; i++) {
      for (let j = 0; j < this.lstInvoice[i].itemRows.length; j++) {
        var added = this.lstInvoice[i].itemRows[j].iname;
        const added_Item = this.Item.find((item) => item.iname == added);
        this.addedItem.push(added_Item);
      }
    }
    localStorage.setItem('addItem', JSON.stringify(this.addedItem));
  }

  get itemRows() {
    return this.invoicesForm.get('itemRows') as FormArray;
  }

  addNewRow() {
    if (this.Item.length > 0) {
      this.itemRows.push(this.initItemRows());
      this.NewItemArray = this.formVal.value;
      this.TotalAmount();
    }
    else {
      alert('Not Found Item');
    }
  }

  invoiceData() {
    for (let val in this.invoicesForm.controls) {
      this.invoicesForm.controls[val].markAsTouched();
    };
    if (this.invoicesForm.valid) {
      if (this.lstInvoice == null) {
        this.lstInvoice = [];
      }
      const form_data = this.invoicesForm.value;
      if (!this.NewItemArray.length) {
        alert('Atleast one Item must be added!!!');
      }
      else {
        const invoiceNO = this.lstInvoice.find((item) => item.invoices == form_data.invoices);
        if (invoiceNO) {
          alert('This Invoice Number is arleady added');
          this.invoicesForm.get('invoices').setValue(null);
        }
        else {
          form_data.id = (new Date()).getTime();
          form_data.indate = (form_data.indate.getMonth() + 1 + '/' + form_data.indate.getDate() + '/' + form_data.indate.getFullYear());
          form_data.duedate = (form_data.duedate.getMonth() + 1 + '/' + form_data.duedate.getDate() + '/' + form_data.duedate.getFullYear());
          this.lstInvoice.push(form_data);
          localStorage.setItem("Indata", JSON.stringify(this.lstInvoice));
          this.invoicesForm.reset();
          this.readonlyText = true;
          this.discount_amount = 0;
          this.shipping_charge = 0;
          this.shipping = this.invoicesForm.get('shippingCharge').disable();
          this.Discount = this.invoicesForm.get('discount').disable();
          this.invoicesForm.get('currencyCode').disable();
          this.ngOnInit();
          this.getAddItem();
        }
      }
    }
  }

  //#endregion

  //#region method

  get formVal() {
    return <FormArray>this.invoicesForm.get('itemRows');
  }
  invno: any;
  formItem: any = [];
  patchRec() {
    this.edit = true; // for edit button
    this.invno = localStorage.getItem('index');
    if (this.invno) {
      const data = this.lstInvoice.find((item) => item.invoices == this.invno);
      if (data) {
        const Customer = this.Customer.find(item => JSON.stringify(item) === JSON.stringify(data.cname));
        this.invoicesForm.patchValue({
          invoices: data.invoices ? data.invoices : null,
          cname: Customer,
          orderno: data.orderno ? data.orderno : null,
          indate: data.indate ? data.indate : null,
          duedate: data.duedate ? data.duedate : null,
          totalAmount: data.totalAmount ? data.totalAmount : null,
          discount: data.discount ? data.discount : null,
          shippingCharge: data.shippingCharge ? data.shippingCharge : null,
          currencyCode: data.currencyCode ? data.currencyCode : null,
          isAuto: false
        });
        this.readonlyText = true;
        this.edit = false;
        this.invoicesForm.setControl('itemRows', this.setexistingItem(data.itemRows));
      }
    }
    this.NewItemArray = this.invoicesForm.get('itemRows').value;
    localStorage.removeItem('index');
    this.TotalAmount();
  }
  setexistingItem(itemSets): FormArray {
    const formarray = new FormArray([]);
    itemSets.forEach(e => {
      formarray.push(this.fb.group({
        id: e.id,
        iname: e.iname,
        quantity: e.quantity,
        rate: e.rate,
        amount: e.amount
      }));
    });
    return formarray;
  }

  editRec(row) {
    if (this.invoicesForm.valid) {
      const form_data = this.invoicesForm.value;
      const data = this.lstInvoice.find((item) => item.invoices == row);
      var test = this.lstInvoice.find((item) => item.invoices == form_data.invoices);

      if (this.invno != form_data.invoices && test != null && test.id > 0) {
        alert('Invoice Number arleady exist!')
        return;
      }
      if (data) {
        let body = {
          invoices: data.invoices = form_data.invoices,
          cname: data.cname = form_data.cname,
          orderno: data.orderno = form_data.orderno,
          indate: data.indate = form_data.indate,
          duedate: data.duedate = form_data.duedate,
          totalAmount: data.totalAmount = form_data.totalAmount,
          discount: data.discount = form_data.discount,
          shippingCharge: data.shippingCharge = form_data.shippingCharge,
          currencyCode: data.currencyCode = form_data.currencyCode,
          itemRows: data.itemRows = form_data.itemRows,
          isAuto: false
        }
        if (body.totalAmount == 0) {
          alert('Total Amount is Not valid 0');
        }
        else {
          this.getAddItem();
          this.lstInvoice[data] = body;
          localStorage.setItem("Indata", JSON.stringify(this.lstInvoice));
          this.TotalAmount();
          this.discount_amount = 0;
          this.shipping_charge = 0;
          this.edit = true;
          this.readonlyText = true;
          this.shipping = this.invoicesForm.get('shippingCharge').disable();
          this.Discount = this.invoicesForm.get('discount').disable();
          this.invoicesForm.get('currencyCode').disable();
          this.ngOnInit();
        }
      }
    }
    else {
      alert('Enter Valid Invoice Number');
    }
  }

  selectVal(value, i) {
    this.selectedRow = this.Item.find((item) => item.iname == value);
    this.formVal.controls[i].get('rate').setValue(this.selectedRow.rate);
    this.formVal.controls[i].get('amount').setValue(this.selectedRow.amount);
    const quantity = this.formVal.controls[i].get('quantity').value;
    const rate = this.formVal.controls[i].get('rate').value;
    if (this.NewItemArray.length > 0) {
      let amount = rate * quantity;
      this.formVal.controls[i].get('amount').setValue(amount);
    }
    this.NewItemArray = this.formVal.value;
    this.TotalAmount();
  }

  valuechange(value, i) {
    if (value <= 0) {
      alert("Can not be zero")
    }
    if (this.NewItemArray.length > 0) {
      let amount = value * this.formVal.value[i].rate;
      this.formVal.controls[i].get('amount').setValue(amount);
    }
    this.NewItemArray = this.formVal.value;
    this.TotalAmount();
  }

  get formControlArr() {
    return <FormArray>this.invoicesForm.controls.itemRows;
  }

  DeleteRecord(index: number) {
    if (this.formControlArr.length <= 1) {
      alert('Atleast one Item must be added!!!');
    }
    else {
      if (confirm(" Are you sure you want to delete this Record?")) {
        this.itemRows.removeAt(index);
        this.NewItemArray = this.invoicesForm.get('itemRows').value;
        // if (this.NewItemArray == null || this.NewItemArray.length < 1) {
        //   this.shipping_charge = 0;
        //   this.discount_amount = 0;
        //   this.invoicesForm.get('discount').setValue('');
        //   this.invoicesForm.get('shippingCharge').setValue('');
        //   this.invoicesForm.get('totalAmount').setValue(0);
        // }
        this.TotalAmount();
      }
    }
  }

  resetAmount() {
    this.Discount = this.invoicesForm.get('discount').setValue('');
    this.discount_amount = 0;
    this.TotalAmount();
  }

  TotalAmount() {
    if (this.NewItemArray) {
      this.total = this.NewItemArray.map(o => o.amount).reduce((a, c) => a + c, 0);
      if (this.total == 0) {
        this.shipping = this.invoicesForm.get('shippingCharge').disable();
        this.Discount = this.invoicesForm.get('discount').disable();
        this.invoicesForm.get('currencyCode').disable();
      }
      else {
        this.shipping = this.invoicesForm.get('shippingCharge').enable();
        this.Discount = this.invoicesForm.get('discount').enable();
        this.invoicesForm.get('currencyCode').enable();
      }
      const currencyCode = this.invoicesForm.get('currencyCode').value;
      this.shipping = this.invoicesForm.get('shippingCharge').value;
      this.Discount = this.invoicesForm.get('discount').value;
      if (currencyCode == '%') {
        if (this.Discount < 100) {
          this.discount_amount = (+this.total * this.Discount) / 100;
          this.NewPrice = this.total - this.discount_amount;
        }
        else {
          this.resetAmount();
        }
      }
      else if (currencyCode == '$') {
        if (this.Discount < this.total) {
          this.discount_amount = +this.Discount;
          this.NewPrice = +this.total - +this.Discount;
        }
        else {
          this.resetAmount();
        }
      }
      if (this.shipping <= this.total) {
        this.shipping_charge = +this.shipping;
        const newshippingPrise = +this.NewPrice + +this.shipping;
        this.price = newshippingPrise;
      }
      else {
        this.shipping = this.invoicesForm.get('shippingCharge').setValue('');
        this.shipping_charge = 0;
        this.TotalAmount();
      }
      if (this.price) {
        this.invoicesForm.get('totalAmount').setValue(this.price.toFixed(2))
      } else {
        this.invoicesForm.get('totalAmount').setValue(this.total.toFixed(2));
      }
    }
  }

  pad(str, max) {
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }
  autoGenerate(value) {
    this.lstInvoice = JSON.parse(localStorage.getItem("Indata"));
    if (value == true) {
      this.readonlyText = false;
      if (!this.lstInvoice) {
        this.invoicesForm.get('invoices').setValue('000001');
      }
      else if (this.lstInvoice && !this.invno) {
        let invoiceNo = Math.max.apply(Math, this.lstInvoice.map(function (o) { return o.invoices; }));
        const number = this.pad(invoiceNo + 1, 6)
        this.invoicesForm.get('invoices').setValue(number);
      }
      else if (this.lstInvoice && this.invno) {
        this.invoicesForm.get('invoices').setValue(this.invno);
      }
    } else {
      this.readonlyText = true;
      this.invoicesForm.get('invoices').setValue(null);
    }
  }
  selectcurrency() {
    this.TotalAmount()
  }

  onInvoicesChange(value) {
    this.minDate = value;
  }
  onDueChange(value) {
    this.maxDate = value;
    if (this.maxDate == undefined) {
      this.maxDate = new Date(2998, 12);
    }
  }
  //#endregion

  constructor(private fb: FormBuilder, private _cS: CommonService) { }


  ngOnInit() {
    this.fbInvoices();
    if (localStorage.getItem("Idata") != null) {
      this.Item = JSON.parse(localStorage.getItem("Idata"));
    } else {
      this.Item = this._cS.itemData();
    }
    if (localStorage.getItem("Cdata") != null) {
      this.Customer = JSON.parse(localStorage.getItem("Cdata"));
    }
    else {
      this.Customer = this._cS.customerData();
    }
    this.Item.map(x => {
      x.amount = x.rate;
      x.quantity = 1;
    });

    this.invoicesForm.get('totalAmount').setValue(0);
    this.total = 0;
    this.price = 0;
    this.lstInvoice = JSON.parse(localStorage.getItem("Indata"));
    this.patchRec();
  }
}
