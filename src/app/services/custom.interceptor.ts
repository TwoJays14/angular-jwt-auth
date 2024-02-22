import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('jwt');

    // Clone the request and set the Authorization header
    const newCloneRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle the request
    return next.handle(newCloneRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 403) {
          // Token expired or invalid, try refreshing the token
          return this.refreshToken().pipe(
            switchMap((newToken: string) => {
              // If token refresh successful, retry the original request with the new token
              const newRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next.handle(newRequest);
            }),
            catchError((refreshError: any) => {
              // If token refresh failed, log out the user or handle the error accordingly
              console.error('Token refresh failed:', refreshError);
              // For example, you can log out the user
              // this.authService.logout();
              // Or you can rethrow the error
              return throwError(refreshError);
            })
          );
        }
        // If the error is not related to token expiration, rethrow it
        return throwError(error);
      })
    );
  }

  // Method to refresh the access token using the refresh token
  private refreshToken(): Observable<string> {
    const refresh = localStorage.getItem('refreshJWT');
    console.log(refresh);

    if (!refresh) {
      return throwError('Refresh token not found');
    }

    return this.http
      .post<string>('http://localhost:4000/token', {
        token: refresh,
      })
      .pipe(
        catchError((error: any) => {
          console.error('Token refresh failed:', error);
          return throwError('Token refresh failed');
        }),
        switchMap((res: any) => {
          console.log(res);

          const newAccessToken = res.accessToken;
          if (!newAccessToken) {
            return throwError('New access token not received');
          }
          return of(newAccessToken);
        })
      );
  }
}
