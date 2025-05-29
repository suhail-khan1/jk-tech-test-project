import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserEditComponent } from './user-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService, User } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let activatedRouteStub: any;

  const mockUser: User = {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'editor'
  };

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getUser', 'updateUser'], {
      selectedUser$: new Subject<User>()
    });
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule, MatCardModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
      declarations: [UserEditComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    userServiceSpy.getUser.and.returnValue(of(mockUser));
    userServiceSpy.updateUser.and.returnValue(of(mockUser));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateUser and navigate on successful role update', fakeAsync(() => {
    component.userId = '1';
    component.user = mockUser;
    component.ngOnInit();
    component.userForm.patchValue({ role: 'admin' });
    component.user.role = 'admin';

    component.updateRole();
    tick();

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(mockUser);
    expect(snackBarSpy.open).toHaveBeenCalledWith('User updated successfully!', 'Close', { duration: 3000 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['dashboard/users']);
  }));

  it('should show error snackbar if updateUser fails', fakeAsync(() => {
    userServiceSpy.updateUser.and.returnValue(throwError(() => new Error('Update Error')));
    component.userId = '1';
    component.user = mockUser;
    component.ngOnInit();
    component.userForm.patchValue({ role: 'admin' });
    component.user.role = 'admin';

    component.updateRole();
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to update user.', 'Close', { duration: 3000 });
  }));

  it('should reset form and navigate on cancel', () => {
    component.ngOnInit();
    spyOn(component.userForm, 'reset');
    component.cancel();

    expect(component.userForm.reset).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['dashboard/users']);
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });
});
