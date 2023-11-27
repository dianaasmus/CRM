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


  /**
   * Opens a dialog to add a new purchase.
   */
  openDialog(): void {
    this.dialog.open(DialogAddPurchaseComponent, { panelClass: 'custom-container' });
  }


  /**
   * Retrieves the user ID from the route snapshot, navigates using the AuthService, and subscribes to the user data.
   */
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("id");
    this.authService.navigate();
    this.subscribeUser();
  }


  /**
   * Subscribes to the user data in Firestore using the provided user ID.
   */
  subscribeUser(): void {
    const userCollection = collection(this.firestore, 'users');
    const userDoc = doc(userCollection, this.userId);

    this.userSubscription = onSnapshot(userDoc, this.handleUserSnapshot.bind(this));
  }


  /**
   * Calculates the total revenue based on the user's purchases.
   */
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


  /**
   * Checks if there are added purchases for the user and calculates the total purchase amount and revenue.
   */
  checkAddedPurchase() {
    if (this.userData.purchases.length !== 0) {
      this.NoAddedPurchases = true;
      this.userData.purchases.forEach((purchase: any) => {
        this.totalPurchase += purchase.amount;
      });
      this.checkPurchaseRevenue();
    }
  }


  /**
   * Handles the snapshot of user data received from Firestore and updates the user information.
   * 
   * @param {any} userSnapshot - The snapshot of user data from Firestore.
   */
  handleUserSnapshot(userSnapshot: any): void {
    const userSnapshotData: any = userSnapshot.data();
    if (userSnapshotData) {
      this.userData = new User(userSnapshotData);
      this.birthDate = new Date(this.userData.birthDate);
      this.checkAddedPurchase();
    }
  }


  /**
   * Opens a dialog to edit the about section of the user profile.
   */
  editAbout() {
    const dialog = this.dialog.open(DialogEditAboutUserComponent, { panelClass: 'custom-container' });
    this.userData.id = this.userId;
    dialog.componentInstance.birthDate = new Date(this.userData.birthDate);
    dialog.componentInstance.user = new User({ ...this.userData });
  }


  /**
   * Opens a dialog to edit the address of the user profile.
   */
  editAddress() {
    const dialog = this.dialog.open(DialogEditAddressUserComponent, { panelClass: 'custom-container' });
    dialog.componentInstance.user = new User({ ...this.userData });
  }


  /**
   * Deletes the user profile and navigates to the user list.
   */
  async deleteUser() {
    this.loading = true;
    await deleteDoc(this.getSingleDocRef(this.userId)).catch(
      (err) => { console.error(err); }
    );
    this.loading = false;
    this.redirectToUserList();
  }


  /**
   * Redirects to the user list after deleting the user profile.
   */
  redirectToUserList() {
    this.router.navigate(['user']);
  }


  /**
   * Gets a reference to a single document in the 'users' collection in Firestore.
   * 
   * @param {string} docId - The ID of the document.
   * @returns {DocumentReference} Reference to the requested document.
   */
  getSingleDocRef(docId: string) {
    return doc(collection(this.firestore, 'users'), docId);
  }
}
