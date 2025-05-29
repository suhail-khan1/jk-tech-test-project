import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DocumentListComponent } from './document-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from '../document.service';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

describe('DocumentListComponent', () => {
  let component: DocumentListComponent;
  let fixture: ComponentFixture<DocumentListComponent>;
  let documentServiceSpy: jasmine.SpyObj<DocumentService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockDocuments = [
    { _id: '1', title: 'Doc 1', description: 'Desc 1', url: 'url1' },
    { _id: '2', title: 'Doc 2', description: 'Desc 2', url: 'url2' }
  ];

  beforeEach(async () => {
    documentServiceSpy = jasmine.createSpyObj('DocumentService', ['getDocuments', 'deleteDocument']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    documentServiceSpy.getDocuments.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [DocumentListComponent],
      imports: [MatTableModule, MatIconModule, BrowserAnimationsModule],
      providers: [
        { provide: DocumentService, useValue: documentServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load documents on init', fakeAsync(() => {
    documentServiceSpy.getDocuments.and.returnValue(of(mockDocuments));
    component.loadDocuments();
    tick();

    expect(documentServiceSpy.getDocuments).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockDocuments);
    expect(component.loading).toBeFalse();
  }));

  it('should show error snackbar when loadDocuments fails', fakeAsync(() => {
    documentServiceSpy.getDocuments.and.returnValue(throwError(() => new Error('error')));

    component.loadDocuments();
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to load documents', 'Close', { duration: 3000 });
    expect(component.loading).toBeFalse();
  }));

  it('should show error snackbar when deleteDocument fails', fakeAsync(() => {
    documentServiceSpy.deleteDocument.and.returnValue(throwError(() => new Error('Delete error')));

    component.deleteDocument('1');
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to delete document', 'Close', { duration: 3000 });
  }));

  it('should call deleteDocument when confirmDeleteDocument is confirmed', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    spyOn(component, 'deleteDocument');

    component.confirmDeleteDocument('123');
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.deleteDocument).toHaveBeenCalledWith('123');
  }));

  it('should not call deleteDocument when confirmDeleteDialog is cancelled', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(false) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    spyOn(component, 'deleteDocument');

    component.confirmDeleteDocument('123');
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.deleteDocument).not.toHaveBeenCalled();
  }));

  it('should unsubscribe all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
