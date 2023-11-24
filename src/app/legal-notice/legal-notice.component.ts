import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent {

  constructor(private authService: AuthService) { }
  

  ngOnInit(): void {
    this.authService.navigate();
  }
}
