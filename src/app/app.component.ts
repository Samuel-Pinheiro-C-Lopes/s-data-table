import { Component } from '@angular/core';
import { SDataTableModule } from './s-data-table/s-data-table.module';
import { BehaviorSubject } from 'rxjs';

class testeChild {
  otherDesc: number = 1;
  desc: string[] = ["descricao", "two"];
}

class teste {
  id: number;
  descricao: string = "teste";
  numero: number = 10;
  outraPropriedade: string = "teste";
  listaNomes: string[] = ["nome 1", "nome 2"];
  child: testeChild = new testeChild();
  numbers: number[] = [1, 2, 3];
  html: string = "<div style='width: 300px; height: 100px; background-color: black;'></div>";

  constructor(id: number) {
    this.id = id;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SDataTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sDataTable';
  clazz = teste;
  testes: teste[] = [new teste(0), new teste(1), new teste(2)];
  dataSource: BehaviorSubject<teste[]> = new BehaviorSubject<teste[]>([]);
  count: number = 1;

  changeData = () => {
    if (this.count%4 == 0)
      this.dataSource.next([new teste(1), new teste(2), new teste(3), new teste(4)]);
    else if (this.count%3 == 0) 
      this.dataSource.next([new teste(1), new teste(2), new teste(3), new teste(4), new teste(5), new teste(6)]);
    else if (this.count%2 == 0)
      this.dataSource.next([new teste(1), new teste(2)]);
    this.count++;

  }

  rowClicked = (n: number) => console.warn(n);
}
