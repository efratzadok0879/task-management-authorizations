import { Component, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.css']
})
export class TreeTableComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  colomns:{field:string,header:string}[];

  @Input()
  info: TreeNode[];
  
}
