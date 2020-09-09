import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import * as XLSX from 'xlsx';
import * as _ from "lodash";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public sheet1 = [];
  public data1 = [];
  public data2 = [];
  public sheet2 = [];
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public shownGraphs: boolean = false;
  public active = 1;
  public pokazatelji2 = [];
  public pokazatelji1 = [
    {
      opis: 'Koeficijent tekuće likvidnosti',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent ubrzane likvidnosti',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent trenutne likvidnosti',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent finansijske stabilnosti',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Ekonomičnost ukupnog poslovanja',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Odnos ukupnog prihoda i troška zaposlenih',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Ekonomičnost finansiranja',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Rentabilnost (profitabilnost) kapitala (ROE)',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Rentabilnost (profitabilnost) imovine (ROA)',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Pokazatelj zaduženosti',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent vlastitog finansiranja',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Odnos duga i kapitala',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent obrta potraživanja',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Trajanje naplate potraživanja u danima',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent obrta ukupne imovine',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Dani vezivanja ukupne imovine',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent obrta kratkotrajne imovine',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Dani vezivanja kratkotrajne imovine',
      godina2018: null,
      godina2019: null
    },
    {
      opis: 'Koeficijent obrta zaliha',
      godina2018: null,
      godina2019: null
    }
,
    {
      opis: 'Dani vezivanja zaliha',
      godina2018: null,
      godina2019: null
    }


  ];

  title = 'read-excel-in-angular8';
  exceltoJson = {};

  constructor(private toastr: ToastrService) {
    this.pokazatelji2 = _.cloneDeep(this.pokazatelji1);

  }


  onFileChange(event: any) {
    this.exceltoJson = {};
    var headerJson = {};
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    // if (target.files.length !== 1) {
    //   throw new Error('Cannot use multiple files');
    // }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    /*console.log("filename", target.files[0].name);*/
    this.exceltoJson['filename'] = target.files[0].name;
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      for (var i = 0; i < wb.SheetNames.length; ++i) {
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        this.exceltoJson[`sheet${i + 1}`] = data;
        const headers = this.get_header_row(ws);
        headerJson[`header${i + 1}`] = headers;
        //  console.log("json",headers)
      }
      this.exceltoJson['headers'] = headerJson;
      // console.log(this.exceltoJson);
      this.loadDataFromExcelFile(this.exceltoJson);
    };
  }

  get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
      // console.log("cell",cell)
      var hdr = "UNKNOWN " + C; // <-- replace with your desired default
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
    }
    return headers;
  }


  loadDataFromExcelFile(file: any) {
    this.sheet1 = file.sheet1;
    this.sheet2 = file.sheet2;

    this.sheet1.forEach((item: any) => {
      this.data1.push({
        opis: item.opis,
        godina2018: item.godina2018 ? item.godina2018 : '',
        godina2019: item.godina2019 ? item.godina2019 : ''
      })
    });

    this.sheet2.forEach((item: any) => {
      this.data2.push({
        opis: item.opis,
        godina2018: item.godina2018 ? item.godina2018 : '',
        godina2019: item.godina2019 ? item.godina2019 : ''
      })
    });
  }

  calculate1() {
    /*POKAZATELJI LIKVIDNOSTI*/
    this.pokazatelji1.find(x => x.opis === 'Koeficijent tekuće likvidnosti').godina2018 = this.sheet1.find(x => x.opis === 'kratkorocna_aktiva').godina2018 / this.sheet1.find(x => x.opis === 'kratkorocna_pasiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent tekuće likvidnosti').godina2019 = this.sheet1.find(x => x.opis === 'kratkorocna_aktiva').godina2019 / this.sheet1.find(x => x.opis === 'kratkorocna_pasiva').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Koeficijent ubrzane likvidnosti').godina2018 = (this.sheet1.find(x => x.opis === 'kratkorocna_aktiva').godina2018 - this.sheet1.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2018) / this.sheet1.find(x => x.opis === 'kratkorocna_pasiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent ubrzane likvidnosti').godina2019 = (this.sheet1.find(x => x.opis === 'kratkorocna_aktiva').godina2019 - this.sheet1.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2019) / this.sheet1.find(x => x.opis === 'kratkorocna_pasiva').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Koeficijent trenutne likvidnosti').godina2018 = (this.sheet1.find(x => x.opis === 'gotovina').godina2018 + this.sheet1.find(x => x.opis === 'gotovinski_ekvivalenti').godina2018) / this.sheet1.find(x => x.opis === 'kratkorocna_pasiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent trenutne likvidnosti').godina2019 = (this.sheet1.find(x => x.opis === 'gotovina').godina2019 + this.sheet1.find(x => x.opis === 'gotovinski_ekvivalenti').godina2019) / this.sheet1.find(x => x.opis === 'kratkorocna_pasiva').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Koeficijent finansijske stabilnosti').godina2018 = this.sheet1.find(x => x.opis === 'dugotrajna_imovina').godina2018 / (this.sheet1.find(x => x.opis === 'dugorocne_obaveze').godina2018 + this.sheet1.find(x => x.opis === 'kapital').godina2018);
    this.pokazatelji1.find(x => x.opis === 'Koeficijent finansijske stabilnosti').godina2019 = this.sheet1.find(x => x.opis === 'dugotrajna_imovina').godina2019 / (this.sheet1.find(x => x.opis === 'dugorocne_obaveze').godina2019 + this.sheet1.find(x => x.opis === 'kapital').godina2019);


    /*POKAZATELJI EKONOMICNOSTI*/

    this.pokazatelji1.find(x => x.opis === 'Ekonomičnost ukupnog poslovanja').godina2018 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet1.find(x => x.opis === 'ukupni_rashodi').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Ekonomičnost ukupnog poslovanja').godina2019 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet1.find(x => x.opis === 'ukupni_rashodi').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Odnos ukupnog prihoda i troška zaposlenih').godina2018 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet1.find(x => x.opis === 'trosak_zaposlenih').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Odnos ukupnog prihoda i troška zaposlenih').godina2019 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet1.find(x => x.opis === 'trosak_zaposlenih').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Ekonomičnost finansiranja').godina2018 = this.sheet1.find(x => x.opis === 'finansijski_prihodi').godina2018 / this.sheet1.find(x => x.opis === 'finansijski_rashodi').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Ekonomičnost finansiranja').godina2019 = this.sheet1.find(x => x.opis === 'finansijski_prihodi').godina2019 / this.sheet1.find(x => x.opis === 'finansijski_rashodi').godina2019;

    /*POKAZATELJI RENTABILNOSTI*/

    this.pokazatelji1.find(x => x.opis === 'Rentabilnost (profitabilnost) kapitala (ROE)').godina2018 = this.sheet1.find(x => x.opis === 'neto_dobit').godina2018 / this.sheet1.find(x => x.opis === 'kapital').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Rentabilnost (profitabilnost) kapitala (ROE)').godina2019 = this.sheet1.find(x => x.opis === 'neto_dobit').godina2019 / this.sheet1.find(x => x.opis === 'kapital').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Rentabilnost (profitabilnost) imovine (ROA)').godina2018 = this.sheet1.find(x => x.opis === 'dobit_prije_poreza').godina2018 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Rentabilnost (profitabilnost) imovine (ROA)').godina2019 = this.sheet1.find(x => x.opis === 'dobit_prije_poreza').godina2019 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2019;

    /*POKAZATELJI ZADUZENOSTI*/

    this.pokazatelji1.find(x => x.opis === 'Pokazatelj zaduženosti').godina2018 = this.sheet1.find(x => x.opis === 'ukupne_obaveze').godina2018 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Pokazatelj zaduženosti').godina2019 = this.sheet1.find(x => x.opis === 'ukupne_obaveze').godina2019 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Koeficijent vlastitog finansiranja').godina2018 = this.sheet1.find(x => x.opis === 'kapital').godina2018 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent vlastitog finansiranja').godina2019 = this.sheet1.find(x => x.opis === 'kapital').godina2019 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Odnos duga i kapitala').godina2018 = this.sheet1.find(x => x.opis === 'ukupne_obaveze').godina2018 / this.sheet1.find(x => x.opis === 'kapital').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Odnos duga i kapitala').godina2019 = this.sheet1.find(x => x.opis === 'ukupne_obaveze').godina2019 / this.sheet1.find(x => x.opis === 'kapital').godina2019;

    /*POKAZATELJI AKTIVNOSTI*/

    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2018 = (this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2018 + this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2018) / this.sheet1.find(x => x.opis === 'kupci').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2019 = (this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2019 + this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2019) / this.sheet1.find(x => x.opis === 'kupci').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Trajanje naplate potraživanja u danima').godina2018 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Trajanje naplate potraživanja u danima').godina2019 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2018 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2019 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet1.find(x => x.opis === 'ukupna_aktiva').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Dani vezivanja ukupne imovine').godina2018 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Dani vezivanja ukupne imovine').godina2019 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2018 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet1.find(x => x.opis === 'kratkorocna_aktiva').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2019 = this.sheet1.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet1.find(x => x.opis === 'kratkorocna_aktiva').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Dani vezivanja kratkotrajne imovine').godina2018 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Dani vezivanja kratkotrajne imovine').godina2019 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta zaliha').godina2018 = (this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2018 + this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2018) / this.sheet1.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta zaliha').godina2019 = (this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2019 + this.sheet1.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2019) / this.sheet1.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2019;

    this.pokazatelji1.find(x => x.opis === 'Dani vezivanja zaliha').godina2018 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta zaliha').godina2018;
    this.pokazatelji1.find(x => x.opis === 'Dani vezivanja zaliha').godina2019 = 365 / this.pokazatelji1.find(x => x.opis === 'Koeficijent obrta zaliha').godina2019;

    this.pokazatelji1.forEach((item: any) => {
      item.godina2018 = Math.round(item.godina2018 * 100) / 100;
      item.godina2019 = Math.round(item.godina2019 * 100) / 100;
    });

    this.showGraphs(this.pokazatelji1);
  }


  calculate2() {
    /*POKAZATELJI LIKVIDNOSTI*/
    this.pokazatelji2.find(x => x.opis === 'Koeficijent tekuće likvidnosti').godina2018 = this.sheet2.find(x => x.opis === 'kratkorocna_aktiva').godina2018 / this.sheet2.find(x => x.opis === 'kratkorocna_pasiva').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent tekuće likvidnosti').godina2019 = this.sheet2.find(x => x.opis === 'kratkorocna_aktiva').godina2019 / this.sheet2.find(x => x.opis === 'kratkorocna_pasiva').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Koeficijent ubrzane likvidnosti').godina2018 = (this.sheet2.find(x => x.opis === 'kratkorocna_aktiva').godina2018 - this.sheet2.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2018) / this.sheet2.find(x => x.opis === 'kratkorocna_pasiva').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent ubrzane likvidnosti').godina2019 = (this.sheet2.find(x => x.opis === 'kratkorocna_aktiva').godina2019 - this.sheet2.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2019) / this.sheet2.find(x => x.opis === 'kratkorocna_pasiva').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Koeficijent trenutne likvidnosti').godina2018 = (this.sheet2.find(x => x.opis === 'gotovina').godina2018 + this.sheet2.find(x => x.opis === 'gotovinski_ekvivalenti').godina2018) / this.sheet2.find(x => x.opis === 'kratkorocna_pasiva').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent trenutne likvidnosti').godina2019 = (this.sheet2.find(x => x.opis === 'gotovina').godina2019 + this.sheet2.find(x => x.opis === 'gotovinski_ekvivalenti').godina2019) / this.sheet2.find(x => x.opis === 'kratkorocna_pasiva').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Koeficijent finansijske stabilnosti').godina2018 = this.sheet2.find(x => x.opis === 'dugotrajna_imovina').godina2018 / (this.sheet2.find(x => x.opis === 'dugorocne_obaveze').godina2018 + this.sheet2.find(x => x.opis === 'kapital').godina2018);
    this.pokazatelji2.find(x => x.opis === 'Koeficijent finansijske stabilnosti').godina2019 = this.sheet2.find(x => x.opis === 'dugotrajna_imovina').godina2019 / (this.sheet2.find(x => x.opis === 'dugorocne_obaveze').godina2019 + this.sheet2.find(x => x.opis === 'kapital').godina2019);


    /*POKAZATELJI EKONOMICNOSTI*/

    this.pokazatelji2.find(x => x.opis === 'Ekonomičnost ukupnog poslovanja').godina2018 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet2.find(x => x.opis === 'ukupni_rashodi').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Ekonomičnost ukupnog poslovanja').godina2019 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet2.find(x => x.opis === 'ukupni_rashodi').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Odnos ukupnog prihoda i troška zaposlenih').godina2018 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet2.find(x => x.opis === 'trosak_zaposlenih').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Odnos ukupnog prihoda i troška zaposlenih').godina2019 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet2.find(x => x.opis === 'trosak_zaposlenih').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Ekonomičnost finansiranja').godina2018 = this.sheet2.find(x => x.opis === 'finansijski_prihodi').godina2018 / this.sheet2.find(x => x.opis === 'finansijski_rashodi').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Ekonomičnost finansiranja').godina2019 = this.sheet2.find(x => x.opis === 'finansijski_prihodi').godina2019 / this.sheet2.find(x => x.opis === 'finansijski_rashodi').godina2019;

    /*POKAZATELJI RENTABILNOSTI*/

    this.pokazatelji2.find(x => x.opis === 'Rentabilnost (profitabilnost) kapitala (ROE)').godina2018 = (this.sheet2.find(x => x.opis === 'neto_dobit').godina2018) ?
      (this.sheet2.find(x => x.opis === 'neto_dobit').godina2018 / this.sheet2.find(x => x.opis === 'kapital').godina2018) : null;
    this.pokazatelji2.find(x => x.opis === 'Rentabilnost (profitabilnost) kapitala (ROE)').godina2019 = (this.sheet2.find(x => x.opis === 'neto_dobit').godina2019) ?
      (this.sheet2.find(x => x.opis === 'neto_dobit').godina2019 / this.sheet2.find(x => x.opis === 'kapital').godina2019) : null;

    this.pokazatelji2.find(x => x.opis === 'Rentabilnost (profitabilnost) imovine (ROA)').godina2018 =  (this.sheet2.find(x => x.opis === 'dobit_prije_poreza').godina2018) ?
      this.sheet2.find(x => x.opis === 'dobit_prije_poreza').godina2018 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2018 : null;
    this.pokazatelji2.find(x => x.opis === 'Rentabilnost (profitabilnost) imovine (ROA)').godina2019 =  (this.sheet2.find(x => x.opis === 'dobit_prije_poreza').godina2018) ?
      this.sheet2.find(x => x.opis === 'dobit_prije_poreza').godina2019 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2019: null;

    /*POKAZATELJI ZADUZENOSTI*/

    this.pokazatelji2.find(x => x.opis === 'Pokazatelj zaduženosti').godina2018 = this.sheet2.find(x => x.opis === 'ukupne_obaveze').godina2018 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Pokazatelj zaduženosti').godina2019 = this.sheet2.find(x => x.opis === 'ukupne_obaveze').godina2019 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Koeficijent vlastitog finansiranja').godina2018 = this.sheet2.find(x => x.opis === 'kapital').godina2018 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent vlastitog finansiranja').godina2019 = this.sheet2.find(x => x.opis === 'kapital').godina2019 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Odnos duga i kapitala').godina2018 = this.sheet2.find(x => x.opis === 'ukupne_obaveze').godina2018 / this.sheet2.find(x => x.opis === 'kapital').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Odnos duga i kapitala').godina2019 = this.sheet2.find(x => x.opis === 'ukupne_obaveze').godina2019 / this.sheet2.find(x => x.opis === 'kapital').godina2019;

    /*POKAZATELJI AKTIVNOSTI*/

    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2018 = (this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2018 + this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2018) / this.sheet2.find(x => x.opis === 'kupci').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2019 = (this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2019 + this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2019) / this.sheet2.find(x => x.opis === 'kupci').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Trajanje naplate potraživanja u danima').godina2018 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Trajanje naplate potraživanja u danima').godina2019 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2018 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2019 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet2.find(x => x.opis === 'ukupna_aktiva').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Dani vezivanja ukupne imovine').godina2018 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Dani vezivanja ukupne imovine').godina2019 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2018 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2018 / this.sheet2.find(x => x.opis === 'kratkorocna_aktiva').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2019 = this.sheet2.find(x => x.opis === 'ukupni_prihodi').godina2019 / this.sheet2.find(x => x.opis === 'kratkorocna_aktiva').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Dani vezivanja kratkotrajne imovine').godina2018 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Dani vezivanja kratkotrajne imovine').godina2019 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta zaliha').godina2018 = (this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2018 + this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2018) / this.sheet2.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta zaliha').godina2019 = (this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_robe').godina2019 + this.sheet2.find(x => x.opis === 'prihodi_od_prodaje_ucinika').godina2019) / this.sheet2.find(x => x.opis === 'zalihe_i_sredstva_namjenjena_prodaji').godina2019;

    this.pokazatelji2.find(x => x.opis === 'Dani vezivanja zaliha').godina2018 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta zaliha').godina2018;
    this.pokazatelji2.find(x => x.opis === 'Dani vezivanja zaliha').godina2019 = 365 / this.pokazatelji2.find(x => x.opis === 'Koeficijent obrta zaliha').godina2019;

    this.pokazatelji2.forEach((item: any) => {
      item.godina2018 = Math.round(item.godina2018 * 100) / 100;
      item.godina2019 = Math.round(item.godina2019 * 100) / 100;
    });

    this.showGraphs(this.pokazatelji2);
  }


  ngOnInit() {

  }

  public showGraphs(data: any) {
    this.shownGraphs = true;
    this.showLikvidnostGraph(data, 'likvidnostPokazatelji' + this.active.toString());
    this.showZaduzenostGraph(data, 'zaduzenostPokazatelji' + this.active.toString());
    this.showEkonomicnostGraph(data, 'ekonomicnostPokazatelji' + this.active.toString());
    this.showAkvinostGraph(data, 'aktivnostiPokazatelji' + this.active.toString());

    if(this.active === 1) {
      this.showRentabilnostGraph(data, 'rentabilnostPokazatelji' + this.active.toString());
    }
  }

  public showLikvidnostGraph(data: any, id: any) {

    if(data[0].godina2018 === null) {
      this.toastr.error('You must calculate first', 'Missing data');
      return;
    }
    this.canvas = document.getElementById(id);
    this.ctx  = this.canvas.getContext("2d");

    let myLikivdnostiData = [];

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent tekuće likvidnosti').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent tekuće likvidnosti').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent ubrzane likvidnosti').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent ubrzane likvidnosti').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent trenutne likvidnosti').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent trenutne likvidnosti').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent finansijske stabilnosti').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent finansijske stabilnosti').godina2019);


/*
    GRADIJENT PRIMJER



    var blueStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    blueStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    blueStroke.addColorStop(0.8, 'rgba(29,140,248,0.0)');
    blueStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var redStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    redStroke.addColorStop(1, 'rgba(233,32,16,1)');
    redStroke.addColorStop(0.8, 'rgba(233,32,16,0.5)');
    redStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors*/


    var myData = {
      labels: ["Koeficijent tekuće likvidnosti", "Koeficijent ubrzane likvidnosti", "Koeficijent trenutne likvidnosti", "Koeficijent finansijske stabilnosti"],
      datasets: [
        {
          label: "2018",
          backgroundColor: "#1f8ef1",
          data: [myLikivdnostiData[0], myLikivdnostiData[2], myLikivdnostiData[4], myLikivdnostiData[6]]
        },
        {
          label: "2019",
          backgroundColor: "red",
          data: [myLikivdnostiData[1], myLikivdnostiData[3], myLikivdnostiData[5], myLikivdnostiData[7]]
        }
      ]
    };


    var myChart = new Chart(this.ctx, {
      type: 'bar',
      responsive: true,
      legend: {
        display: false
      },
      data: myData,
      options: {
        barValueSpacing: 20,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
            }
          }]
        }
      }
    });
    myChart.options.scales.yAxes[0].ticks.fontSize = 20 ;
    myChart.options.scales.xAxes[0].ticks.fontSize = 20 ;

    myChart.options.legend.labels.fontSize = 20 ;
    myChart.options.tooltips.bodyFontSize = 20;
    myChart.options.tooltips.titleFontSize = 20;
    myChart.update();
  }

  showEkonomicnostGraph(data: any, id: any) {
    if(data[0].godina2018 === null) {
      this.toastr.error('You must calculate first', 'Missing data');
      return;
    }
    this.canvas = document.getElementById(id);
    this.ctx  = this.canvas.getContext("2d");

    let myLikivdnostiData = [];

    myLikivdnostiData.push(data.find(x => x.opis === 'Ekonomičnost ukupnog poslovanja').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Ekonomičnost ukupnog poslovanja').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Odnos ukupnog prihoda i troška zaposlenih').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Odnos ukupnog prihoda i troška zaposlenih').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Ekonomičnost finansiranja').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Ekonomičnost finansiranja').godina2019);


    var blueStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    blueStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    blueStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    blueStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var redStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    redStroke.addColorStop(1, 'rgba(233,32,16,1)');
    redStroke.addColorStop(0.4, 'rgba(233,32,16,0.5)');
    redStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors*/


   /* borderColor: 'red',*/

    var dataFirst = {
      label: "2018",
      data: [myLikivdnostiData[0], myLikivdnostiData[2],myLikivdnostiData[4]],
      lineTension: 0,
      fill: false,
      backgroundColor: blueStroke,
      hoverBackgroundColor: blueStroke,
      borderColor: '#1f8ef1',
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
    };

    var dataSecond = {
      label: "2019",
      data: [myLikivdnostiData[1],myLikivdnostiData[3],myLikivdnostiData[5]],
      lineTension: 0,
      fill: false,
      backgroundColor: redStroke,
      hoverBackgroundColor: redStroke,
      borderColor: '#ec250d',
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
    };

    var chartData = {
      labels: ["Ekonomičnost ukupnog poslovanja", "Odnos ukupnog prihoda i troška zaposlenih", "Ekonomičnost finansiranja"],
      datasets: [dataFirst, dataSecond]
    };

    var chartOptions = {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 10
        }
      }
    };

    var lineChart = new Chart(this.ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });

    lineChart.options.scales.yAxes[0].ticks.fontSize = 20 ;
    lineChart.options.scales.xAxes[0].ticks.fontSize = 20 ;

    lineChart.options.tooltips.bodyFontSize = 20;
    lineChart.options.tooltips.titleFontSize = 20;
    lineChart.options.legend.labels.fontSize = 20 ;
    lineChart.update();
  }


  public showZaduzenostGraph(data: any, id: any) {

    if(data[0].godina2018 === null) {
      this.toastr.error('You must calculate first', 'Missing data');
      return;
    }
    this.canvas = document.getElementById(id);
    this.ctx  = this.canvas.getContext("2d");

    let myLikivdnostiData = [];

    myLikivdnostiData.push(data.find(x => x.opis === 'Odnos duga i kapitala').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Odnos duga i kapitala').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent vlastitog finansiranja').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent vlastitog finansiranja').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Pokazatelj zaduženosti').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Pokazatelj zaduženosti').godina2019);


    var myData = {
      labels: ["Odnos duga i kapitala", "Koeficijent vlastitog finansiranja", "Pokazatelj zaduženosti"],
      datasets: [
        {
          label: "2018",
          backgroundColor: "#1f8ef1",
          data: [myLikivdnostiData[0], myLikivdnostiData[2], myLikivdnostiData[4]]
        },
        {
          label: "2019",
          backgroundColor: "red",
          data: [myLikivdnostiData[1], myLikivdnostiData[3], myLikivdnostiData[5]]
        }
      ]
    };


    var myChart = new Chart(this.ctx, {
      type: 'horizontalBar',
      responsive: true,
      legend: {
        display: false
      },
      data: myData,
      options: {
        barValueSpacing: 20,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
            }
          }]
        }
      }
    });

    myChart.options.scales.yAxes[0].ticks.fontSize = 20 ;
    myChart.options.scales.xAxes[0].ticks.fontSize = 20 ;

    myChart.options.tooltips.bodyFontSize = 20;
    myChart.options.tooltips.titleFontSize = 20;
    myChart.options.legend.labels.fontSize = 20 ;
    myChart.update();
  }



  showAkvinostGraph(data: any, id: any) {
    if(data[0].godina2018 === null) {
      this.toastr.error('You must calculate first', 'Missing data');
      return;
    }
    this.canvas = document.getElementById(id);
    this.ctx  = this.canvas.getContext("2d");

    let myLikivdnostiData = [];

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta potraživanja').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Trajanje naplate potraživanja u danima').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Trajanje naplate potraživanja u danima').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta ukupne imovine').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Dani vezivanja ukupne imovine').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Dani vezivanja ukupne imovine').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta kratkotrajne imovine').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Dani vezivanja kratkotrajne imovine').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Dani vezivanja kratkotrajne imovine').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta zaliha').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Koeficijent obrta zaliha').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Dani vezivanja zaliha').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Dani vezivanja zaliha').godina2019);


    var blueStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    blueStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    blueStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    blueStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var redStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    redStroke.addColorStop(1, 'rgba(233,32,16,1)');
    redStroke.addColorStop(0.4, 'rgba(233,32,16,0.5)');
    redStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors*/


    var dataFirst = {
      label: "2018",
      data: [myLikivdnostiData[0], myLikivdnostiData[2],myLikivdnostiData[4], myLikivdnostiData[6], myLikivdnostiData[8]
        ,myLikivdnostiData[10], myLikivdnostiData[12], myLikivdnostiData[14]],
      lineTension: 0,
      fill: false,
      backgroundColor: blueStroke,
      hoverBackgroundColor: blueStroke,
      borderColor: '#1f8ef1',
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
    };

    var dataSecond = {
      label: "2019",
      data: [myLikivdnostiData[1],myLikivdnostiData[3],myLikivdnostiData[5], myLikivdnostiData[7], myLikivdnostiData[9]
        ,myLikivdnostiData[11], myLikivdnostiData[13], myLikivdnostiData[15]],
      lineTension: 0,
      fill: false,
      backgroundColor: redStroke,
      hoverBackgroundColor: redStroke,
      borderColor: '#ec250d',
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
    };

    var chartData = {
      labels: ["Koeficijent obrta potraživanja", "Trajanje naplate potraživanja u danima", "Koeficijent obrta ukupne imovine",
        "Dani vezivanja ukupne imovine", "Koeficijent obrta kratkotrajne imovine", "Dani vezivanja kratkotrajne imovine",
        "Koeficijent obrta zaliha", "Dani vezivanja zaliha"],
      datasets: [dataFirst, dataSecond]
    };

    var chartOptions = {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 10
        }
      }
    };

    var lineChart = new Chart(this.ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });

    lineChart.options.scales.yAxes[0].ticks.fontSize = 20 ;
    lineChart.options.scales.xAxes[0].ticks.fontSize = 20 ;

    lineChart.options.tooltips.bodyFontSize = 20;
    lineChart.options.tooltips.titleFontSize = 20;
    lineChart.options.legend.labels.fontSize = 20 ;
    lineChart.update();
  }


  public showRentabilnostGraph(data: any, id: any) {
    if(data[0].godina2018 === null) {
      this.toastr.error('You must calculate first', 'Missing data');
      return;
    }
    this.canvas = document.getElementById(id);
    this.ctx  = this.canvas.getContext("2d");

    let myLikivdnostiData = [];

    myLikivdnostiData.push(data.find(x => x.opis === 'Rentabilnost (profitabilnost) kapitala (ROE)').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Rentabilnost (profitabilnost) kapitala (ROE)').godina2019);

    myLikivdnostiData.push(data.find(x => x.opis === 'Rentabilnost (profitabilnost) imovine (ROA)').godina2018);
    myLikivdnostiData.push(data.find(x => x.opis === 'Rentabilnost (profitabilnost) imovine (ROA)').godina2019);

    var myData = {
      labels: ["Rentabilnost (profitabilnost) kapitala (ROE)", "Rentabilnost (profitabilnost) imovine (ROA)"],
      datasets: [
        {
          label: "2018",
          backgroundColor: "#1f8ef1",
          data: [myLikivdnostiData[0], myLikivdnostiData[2]]
        },
        {
          label: "2019",
          backgroundColor: "red",
          data: [myLikivdnostiData[1], myLikivdnostiData[3]]
        }
      ]
    };

    var myChart = new Chart(this.ctx, {
      type: 'bar',
      responsive: true,
      legend: {
        display: false
      },
      data: myData,
      options: {
        barValueSpacing: 20,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
            }
          }]
        }
      }
    });

    myChart.options.scales.yAxes[0].ticks.fontSize = 20 ;
    myChart.options.scales.xAxes[0].ticks.fontSize = 20 ;
    myChart.options.legend.labels.fontSize = 20 ;
    myChart.options.tooltips.bodyFontSize = 20;
    myChart.options.tooltips.titleFontSize = 20;
    myChart.update();
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }
}
