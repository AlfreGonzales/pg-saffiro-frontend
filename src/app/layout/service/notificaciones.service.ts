import { Injectable } from '@angular/core';
import { Database, equalTo, onChildAdded, orderByChild, query, ref } from '@angular/fire/database';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private notificacion$ = new Subject<any>();
  private unreadCount$ = new BehaviorSubject<number>(0);

  constructor(private db: Database, private localStorageService: LocalStorageService) {
    const notificacionRef = ref(this.db, 'notificaciones');
    const notificacionQuery = query(
      notificacionRef,
      orderByChild('id_usuario'),
      equalTo(localStorageService.getUsuario().id)
    )
    onChildAdded(notificacionQuery, (snapshot) => {
      this.updateUnreadCount(snapshot);
    });
  }

  getNotificaciones(): Observable<any> {
    return this.notificacion$.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  private updateUnreadCount(notification: any) {
    const readNotifications = this.getReadNotifications();
    if (!readNotifications.includes(notification.key)) {
      this.notificacion$.next({ id: notification.key, ...notification.val(), read: false });
      this.unreadCount$.next(this.unreadCount$.value + 1);
    } else {
      this.notificacion$.next({ id: notification.key, ...notification.val(), read: true });
    }
  }

  private getReadNotifications(): string[] {
    const readNotifications = localStorage.getItem('readNotifications');
    return readNotifications ? JSON.parse(readNotifications) : [];
  }

  notiLeida() {
    this.unreadCount$.next(this.unreadCount$.value - 1);
  }
}
