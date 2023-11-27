import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, deleteDoc, doc, onSnapshot } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAboutUserComponent } from '../dialog-edit-about-user/dialog-edit-about-user.component';
import { DialogEditAddressUserComponent } from '../dialog-edit-address-user/dialog-edit-address-user.component';
import { DialogAddPurchaseComponent } from '../dialog-add-purchase/dialog-add-purchase.component';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  loading: boolean = false;
  userId: any = '';
  userSubscription: any = '';
  userData: any = '';
  birthDate!: any;
  firestore: Firestore = inject(Firestore);
  NoAddedPurchases: boolean = false;
  totalPurchase: number = 0;
  totalRevenue: number = 0;


  constructor(private route: ActivatedRoute, private authService: AuthService,
    public dialog: MatDialog, public router: Router) {
  }


  openDialog(): void {
    this.dialog.open(DialogAddPurchaseComponent, { panelClass: 'custom-container' });
  }


  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("id");
    this.authService.navigate();
    this.subscribeUser();
  }


  subscribeUser(): void {
    const userCollection = collection(this.firestore, 'users');
    const userDoc = doc(userCollection, this.userId);

    this.userSubscription = onSnapshot(userDoc, this.handleUserSnapshot.bind(this));
  }


  checkPurchaseRevenue() {
    this.userData.purchases.forEach((purchase: any) => {
      if (purchase.amount > 1) {
        let totalPur = purchase.value * purchase.amount;
        this.totalRevenue += +totalPur;
      } else {
        this.totalRevenue += +purchase.value;
      }
    });
  }


  checkAddedPurchase() {
    if (this.userData.purchases.length !== 0) {
      this.NoAddedPurchases = true;
      this.userData.purchases.forEach((purchase: any) => {
        this.totalPurchase += purchase.amount;
      });
      this.checkPurchaseRevenue();
    }
  }


  handleUserSnapshot(userSnapshot: any): void {
    const userSnapshotData: any = userSnapshot.data();
    if (userSnapshotData) {
      this.userData = new User(userSnapshotData);
      this.birthDate = new Date(this.userData.birthDate);
      this.checkAddedPurchase();
    }
  }


  editAbout() {
    const dialog = this.dialog.open(DialogEditAboutUserComponent, { panelClass: 'custom-container' });
    this.userData.id = this.userId;
    dialog.componentInstance.birthDate = new Date(this.userData.birthDate);
    dialog.componentInstance.user = new User({ ...this.userData });
  }


  editAddress() {
    const dialog = this.dialog.open(DialogEditAddressUserComponent, { panelClass: 'custom-container' });
    dialog.componentInstance.user = new User({ ...this.userData });
  }


  async deleteUser() {
    this.loading = true;
    await deleteDoc(this.getSingleDocRef(this.userId)).catch(
      (err) => { console.error(err); }
    );
    this.loading = false;
    this.redirectToUserList();
  }


  redirectToUserList() {
    this.router.navigate(['user']);
  }


  getSingleDocRef(docId: string) {
    return doc(collection(this.firestore, 'users'), docId);
  }
}
