import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import * as XLSX from 'xlsx';
import * as _ from "lodash";

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

  constructor() {
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
    console.log("filename", target.files[0].name);
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
    console.log("file", file);
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

  }


  ngOnInit() {
    var gradientChartOptionsConfigurationWithTooltipBlue: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#2380f7"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#2380f7"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipPurple: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipOrange: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 110,
            padding: 20,
            fontColor: "#ff8a76"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(220,53,69,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#ff8a76"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipGreen: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };


    var gradientBarChartConfiguration: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };

    this.canvas = document.getElementById("chartLineRed");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    var data = {
      labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      datasets: [{
        label: "Data",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#ec250d',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#ec250d',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#ec250d',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [80, 100, 70, 80, 120, 80],
      }]
    };

    var myChart = new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipRed
    });


    this.canvas = document.getElementById("chartLineGreen");
    this.ctx = this.canvas.getContext("2d");


    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
      labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
      datasets: [{
        label: "My First dataset",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [90, 27, 60, 12, 80],
      }]
    };

    var myChart = new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen

    });



    var chart_labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    this.datasets = [
      [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
      [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
      [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
    ];
    this.data = this.datasets[0];



    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    var config = {
      type: 'line',
      data: {
        labels: chart_labels,
        datasets: [{
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#ec250d',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#ec250d',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#ec250d',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.data,
        }]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };
    this.myChartData = new Chart(this.ctx, config);


    this.canvas = document.getElementById("CountryChart");
    this.ctx  = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


    var myChart = new Chart(this.ctx, {
      type: 'bar',
      responsive: true,
      legend: {
        display: false
      },
      data: {
        labels: ['USA', 'GER', 'AUS', 'UK', 'RO', 'BR'],
        datasets: [{
          label: "Countries",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [53, 20, 10, 80, 100, 45],
        }]
      },
      options: gradientBarChartConfiguration
    });

  }
  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }
}
