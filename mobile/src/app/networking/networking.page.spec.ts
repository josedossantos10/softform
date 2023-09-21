import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NetworkingPage } from './networking.page';

describe('NetworkingPage', () => {
  let component: NetworkingPage;
  let fixture: ComponentFixture<NetworkingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkingPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
