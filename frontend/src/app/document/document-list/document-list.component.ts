import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentService, Document } from '../document.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ConfirmDeleteDialogComponent } from 'src/app/shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['title', 'description', 'actions'];
  dataSource = new MatTableDataSource<Document>([]);
  private subscriptions = new Subscription();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private documentService: DocumentService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDocuments(): void {
    this.loading = true;
    const sub = this.documentService.getDocuments().subscribe({
      next: (documents) => {
        this.dataSource.data = documents;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load documents', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  deleteDocument(id: string) {
    const sub = this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.snackBar.open('Document deleted', 'Close', { duration: 3000 });
        this.loadDocuments();
      },
      error: () => {
        this.snackBar.open('Failed to delete document', 'Close', { duration: 3000 });
      }
    });
    this.subscriptions.add(sub);
  }

  confirmDeleteDocument(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteDocument(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}