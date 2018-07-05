import { Component } from '@angular/core';
import { NavController, LoadingController ,ToastController} from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
//import { Observable } from 'rxjs';
//import { Doctors } from '../../model/doctors';
import { DoctorServiceProvider } from '../../providers/doctor-service/doctor-service';
import { Network } from '@ionic-native/network';




@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {



  itemArray = [];
  myObject = []
  items: AngularFireObject<any>;




  constructor(public navCtrl: NavController,
              public db: AngularFireDatabase,
              public doctorServiceProvider: DoctorServiceProvider,
              public loadingCtrl: LoadingController,
              private network: Network,
              private toastCtrl: ToastController) {


    this.FillData();
    this.presentLoadingCustom();

    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.presentToast('لايوجد انترنات')      
    });
    // watch network for a connect
    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.presentToast('تم الأتصال')      
    });

  }



  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.presentLoadingCustom();
    this.FillData();
    
    refresher.complete();

  }


  // Get Data From Firbase.
  FillData() {
    this.items = this.db.object('doctorsmap');
    this.items.snapshotChanges().subscribe(action => {

      if (action.payload.val() == null || action.payload.val() == undefined) {
        console.log('no data')
      } else {
        this.itemArray.push(action.payload.val())
        this.myObject = Object.entries(this.itemArray[0])
        console.log('Getting data...');
        console.log(this.myObject);
      }
    });


  }




  //Loanding function.
  presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: `
        <div class="custom-spinner-container">
        <p>جاري تحميل البيانات</p>
        <ion-spinner name="ios"></ion-spinner>
        </div>`,
      duration: 1000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  // Show Message Alter
  presentToast(Msg) {
    let toast = this.toastCtrl.create({
      message: Msg,
      duration: 2000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
}
