import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Increment active requests counter
    this.activeRequests++;
    
    // Add common headers
    const modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    console.log(`HTTP Request: ${modifiedReq.method} ${modifiedReq.url}`);
    const startTime = Date.now();

    return next.handle(modifiedReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          console.log(`HTTP Response: ${event.status} ${modifiedReq.url} (${duration}ms)`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const duration = Date.now() - startTime;
        console.error(`HTTP Error: ${error.status} ${modifiedReq.url} (${duration}ms)`, error);
        
        // Handle different error types
        switch (error.status) {
          case 401:
            console.warn('Unauthorized access - redirecting to login');
            break;
          case 403:
            console.warn('Forbidden access');
            break;
          case 404:
            console.warn('Resource not found');
            break;
          case 500:
            console.error('Internal server error');
            break;
          default:
            console.error('Unknown error occurred');
        }

        return throwError(() => error);
      }),
      finalize(() => {
        // Decrement active requests counter
        this.activeRequests--;
        console.log(`Active HTTP requests: ${this.activeRequests}`);
      })
    );
  }

  getActiveRequestsCount(): number {
    return this.activeRequests;
  }
}
